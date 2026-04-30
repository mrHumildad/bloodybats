import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, translateRole } from '../../translations';
import { getBackupPlayerIds, getRoleColorClass } from '../../logic/utils';
import { getPositionForPlayer, getRoleFromPosition, getBattingOrderPosition } from '../../logic/positionUtils';
import Field from '../Field';
import Player from '../Player';

const POSITION_COORDS = {
  PIT: { x: 50, y: 50 },
  CAT: { x: 50, y: 82 },
  'BAS-1': { x: 62.3, y: 61.1 },
  'BAS-2': { x: 62.3, y: 37.7 },
  'BAS-3': { x: 37.7, y: 61.1 },
  'FIE-1': { x: 50, y: 19.2 },
  'FIE-2': { x: 30, y: 25 },
};
const FIELD_POSITION_KEYS = ['PIT', 'CAT', 'BAS-1', 'BAS-2', 'BAS-3', 'FIE-1', 'FIE-2'];

const Lineup = ({ myConvent, onConventUpdate }) => {
  const { language } = useLanguage();
  const [firstSelected, setFirstSelected] = useState(null);
  const [secondSelected, setSecondSelected] = useState(null);

  if (!myConvent || !myConvent.team) {
    return (
      <div className="lineup-tab tab">
        <p>{getTranslation('noTeamData', language)}</p>
      </div>
    );
  }

  const team = myConvent.team;
  const fieldMap = myConvent.field || {};
  const battingOrder = myConvent.battingOrder || [];
  const reserves = myConvent.reserves || [];
  const backupIds = getBackupPlayerIds(myConvent);

  const getPlayer = (id) => team.find(p => p.id === id) || null;

  const getPlayerInfo = (player) => {
    const fieldPos = getPositionForPlayer(player, myConvent);
    let role;
    if (backupIds.includes(player.id)) {
      role = 'backup';
    } else if (fieldPos) {
      role = fieldPos === 'DH' ? 'dh' : getRoleFromPosition(fieldPos);
    } else  if (reserves.includes(player.id)) {
      role = 'reserve';
    }
    const battingNum = battingOrder.length ? getBattingOrderPosition(player.id, battingOrder) : null;
    return { fieldPos, role, battingNum };
  };

  const reservesPlayers = reserves.map(id => getPlayer(id)).filter(Boolean);
  const backupsPlayers = team.filter(p => backupIds.includes(p.id));

  const defensivePlayers = FIELD_POSITION_KEYS.map(pos => ({
    position: pos,
    player: fieldMap[pos] ? getPlayer(fieldMap[pos]) : null,
  }));

  const battingQueueItems = battingOrder.map(pid => ({
    player: getPlayer(pid),
  }));

  const isFirstSelected = (player) => firstSelected && firstSelected.id === player.id;
  const isSecondSelected = (player) => secondSelected && secondSelected.id === player.id;

  const handlePlayerClick = (player) => {
    if (isFirstSelected(player)) {
      setFirstSelected(null);
    } else if (isSecondSelected(player)) {
      setSecondSelected(null);
    } else if (firstSelected === null) {
      setFirstSelected(player);
    } else {
      setSecondSelected(player);
    }
  };

  const handleSwap = () => {
    if (!firstSelected || !secondSelected) return;

    const updatedField = { ...fieldMap };
    const updatedReserves = [...reserves];
    const updatedBattingOrder = [...battingOrder];

    const firstInfo = getPlayerInfo(firstSelected);
    const secondInfo = getPlayerInfo(secondSelected);

    const firstType = firstInfo.role;
    const secondType = secondInfo.role;

    const isFieldRole = (r) => ['pitcher','catcher','baseGuard','fielder','dh'].includes(r);
    const isBatterRole = (r) => r === 'batter';

    // Both are reserves → swap indices in reserves array
    if (firstType === 'reserve' && secondType === 'reserve') {
      const i1 = updatedReserves.indexOf(firstSelected.id);
      const i2 = updatedReserves.indexOf(secondSelected.id);
      if (i1 !== -1 && i2 !== -1) {
        updatedReserves[i1] = secondSelected.id;
        updatedReserves[i2] = firstSelected.id;
      }
    }
    // Both are backups → do nothing
    else if (firstType === 'backup' && secondType === 'backup') {
      // no‑op
    }
    // Both are in batting order (batter at home plate is just the first in list)
    else if (firstInfo.battingNum !== null && secondInfo.battingNum !== null) {
      const i1 = updatedBattingOrder.indexOf(firstSelected.id);
      const i2 = updatedBattingOrder.indexOf(secondSelected.id);
      if (i1 !== -1 && i2 !== -1) {
        updatedBattingOrder[i1] = secondSelected.id;
        updatedBattingOrder[i2] = firstSelected.id;
      }
    }
    // Both are in field positions (P, C, 1B, 2B, 3B, LF, CF, DH) → swap their field assignments
    else if (firstInfo.fieldPos && secondInfo.fieldPos) {
      const fp1 = firstInfo.fieldPos;
      const fp2 = secondInfo.fieldPos;
      updatedField[fp1] = secondSelected.id;
      updatedField[fp2] = firstSelected.id;
    }
    // One is reserve/backup, the other is field/batting
    else if ((firstType === 'reserve' || firstType === 'backup') && (isFieldRole(secondType) || isBatterRole(secondType))) {
      // First (bench) takes second's field/batting spot
      if (secondInfo.fieldPos) {
        if (secondInfo.fieldPos === 'DH') {
          updatedField['DH'] = firstSelected.id;
        } else {
          updatedField[secondInfo.fieldPos] = firstSelected.id;
        }
      }
      // Second goes to reserves
      if (!updatedReserves.includes(secondSelected.id)) {
        updatedReserves.push(secondSelected.id);
      }
    }
    else if ((secondType === 'reserve' || secondType === 'backup') && (isFieldRole(firstType) || isBatterRole(firstType))) {
      if (firstInfo.fieldPos) {
        if (firstInfo.fieldPos === 'DH') {
          updatedField['DH'] = secondSelected.id;
        } else {
          updatedField[firstInfo.fieldPos] = secondSelected.id;
        }
      }
      if (!updatedReserves.includes(firstSelected.id)) {
        updatedReserves.push(firstSelected.id);
      }
    }
    // All other combos → deselect only (already will deselect below)

    // Remove from reserves if they moved out
    if (reserves.includes(firstSelected.id)) {
      const idx = updatedReserves.indexOf(firstSelected.id);
      if (idx !== -1) updatedReserves.splice(idx, 1);
    }
    if (reserves.includes(secondSelected.id)) {
      const idx = updatedReserves.indexOf(secondSelected.id);
      if (idx !== -1) updatedReserves.splice(idx, 1);
    }

    const updatedConvent = {
      ...myConvent,
      field: updatedField,
      reserves: updatedReserves,
      battingOrder: updatedBattingOrder,
    };

    onConventUpdate(updatedConvent);
    setFirstSelected(null);
    setSecondSelected(null);
  };

  const renderSelectedInfo = (player, side) => {
    if (!player) {
      return (
        <div className="selected-panel-empty">
          <span className="empty-label">{side === 'left' ? getTranslation('firstSelected', language) : getTranslation('secondSelected', language)}</span>
        </div>
      );
    }
    const info = getPlayerInfo(player);
    const colors = myConvent.colors;
    return (
      <div className={`selected-panel ${side}`}>
        <div className="selected-player-badge">
          <Player
            player={player}
            role={info.role}
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
            tertiaryColor={colors.tertiary}
          />
        </div>
        <div className="selected-player-details">
          <h4 className="player-name">{player.name}</h4>
          <p className="player-number">#{player.shirtNumber}</p>
          <p className={`player-role ${getRoleColorClass(info.role)}`}>
            {translateRole(info.role, language)}
          </p>
          {info.fieldPos && <p className="player-position">{info.fieldPos}</p>}
          {info.battingNum && <p className="player-batting">Bat: {info.battingNum}</p>}
          <p className="player-attributes">
            {player.body} {player.mind} {player.heart}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="lineup-tab tab">
      <h2>{getTranslation('lineup', language)}</h2>

      {/* Field Visualization */}
      <div className="field-visualization">
        <Field>
          <div className="field-players">
            {defensivePlayers.map(({ position, player }) => {
              const coord = POSITION_COORDS[position];
              if (!coord) return null;
              const isSelected = player && (isFirstSelected(player) || isSecondSelected(player));
              return (
                <div
                  key={position}
                  className={`field-player${isSelected ? ' selected' : ''}`}
                  style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                  onClick={() => player && handlePlayerClick(player)}
                >
                  {player ? (
                    <Player
                      player={player}
                      role={getRoleFromPosition(position)}
                      primaryColor={myConvent.colors.primary}
                      secondaryColor={myConvent.colors.secondary}
                      tertiaryColor={myConvent.colors.tertiary}
                    />
                  ) : (
                    <span className="position-label">{position}</span>
                  )}
                  {isSelected && <div className="selection-indicator" />}
                </div>
              );
            })}
          </div>
        </Field>

        {/* Batting Queue overlay */}
        <div className="batting-queue-overlay">
          <div className="queue-players">
            {battingQueueItems.map((item, idx) => {
              if (!item.player) return null;
              const isSelected = isFirstSelected(item.player) || isSecondSelected(item.player);
              const info = getPlayerInfo(item.player);
              return (
                <div
                  key={idx}
                  className={`queue-player${isSelected ? ' selected' : ''}`}
                  onClick={() => handlePlayerClick(item.player)}
                >
                  <Player
                    player={item.player}
                    role={info.role}
                    primaryColor={myConvent.colors.primary}
                    secondaryColor={myConvent.colors.secondary}
                    tertiaryColor={myConvent.colors.tertiary}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reserves Section */}
      <div className="lineup-section">
        <h3>{getTranslation('reserves', language)}</h3>
        <div className="reserves-grid">
          {reservesPlayers.length === 0 ? (
            <p className="empty-message">{getTranslation('none', language)}</p>
          ) : (
            reservesPlayers.map(p => {
              const isSelected = isFirstSelected(p) || isSecondSelected(p);
              const info = getPlayerInfo(p);
              return (
                <div
                  key={p.id}
                  className={`reserve-player${isSelected ? ' selected' : ''}`}
                  onClick={() => handlePlayerClick(p)}
                >
                  <Player
                    player={p}
                    role={info.role}
                    primaryColor={myConvent.colors.primary}
                    secondaryColor={myConvent.colors.secondary}
                    tertiaryColor={myConvent.colors.tertiary}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Backups Section */}
      <div className="lineup-section">
        <h3>{getTranslation('backups', language)}</h3>
        <div className="backups-grid">
          {backupsPlayers.length === 0 ? (
            <p className="empty-message">{getTranslation('none', language)}</p>
          ) : (
            backupsPlayers.map(p => {
              const isSelected = isFirstSelected(p) || isSecondSelected(p);
              const info = getPlayerInfo(p);
              return (
                <div
                  key={p.id}
                  className={`backup-player${isSelected ? ' selected' : ''}`}
                  onClick={() => handlePlayerClick(p)}
                >
                  <Player
                    player={p}
                    role={info.role}
                    primaryColor={myConvent.colors.primary}
                    secondaryColor={myConvent.colors.secondary}
                    tertiaryColor={myConvent.colors.tertiary}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Info Panel */}
      <div className="selected-info-panel">
        {renderSelectedInfo(firstSelected, 'left')}
        <button
          className="swap-button"
          disabled={!firstSelected || !secondSelected}
          onClick={handleSwap}
        >
          {getTranslation('swap', language)}
        </button>
        {renderSelectedInfo(secondSelected, 'right')}
      </div>
    </div>
  );
};

export default Lineup;
