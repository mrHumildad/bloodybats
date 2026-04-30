import React from 'react';
import Player from './Player';
import { POSITION_TO_ROLE } from '../logic/positionUtils';

const POSITION_COORDS = {
  PIT: { x: 50, y: 50 },
  CAT: { x: 50, y: 82 },
  'BAS-1': { x: 62.3, y: 61.1 },
  'BAS-2': { x: 62.3, y: 37.7 },
  'BAS-3': { x: 37.7, y: 61.1 },
  'FIE-1': { x: 50, y: 19.2 },
  'FIE-2': { x: 30, y: 25 },
};

const FIELD_POSITIONS = ['PIT', 'CAT', 'BAS-1', 'BAS-2', 'BAS-3', 'FIE-1', 'FIE-2'];

const BASE_POSITIONS = {
  home: { x: 50, y: 74.6154 },
  first: { x: 74.6154, y: 50 },
  second: { x: 50, y: 25.3846 },
  third: { x: 25.3846, y: 50 },
};

const FieldPlayers = ({
  homeConvent,
  awayConvent,
  half,
  battingQueue,
  baseRunners = [],
  onPlayerHover,
  highlightRole = null,
  animationPhase,
}) => {
  if (!homeConvent || !awayConvent) return null;

  const isHomeFielding = half === 'top';
  const fieldingConvent = isHomeFielding ? homeConvent : awayConvent;
  const battingConvent = isHomeFielding ? awayConvent : homeConvent;

  const fieldMap = fieldingConvent.field;
  const battingFieldMap = battingConvent.field;

  const getPlayerByFieldPosition = (posCode) => {
    const playerId = fieldMap[posCode];
    if (!playerId) return null;
    return fieldingConvent.team.find(p => p.id === playerId) || null;
  };

  const fieldingPrimaryColor = fieldingConvent.colors.primary;
  const fieldingSecondaryColor = fieldingConvent.colors.secondary;
  const fieldingTertiaryColor = fieldingConvent.colors.tertiary;
  const battingPrimaryColor = battingConvent.colors.primary;
  const battingSecondaryColor = battingConvent.colors.secondary;
  const battingTertiaryColor = battingConvent.colors.tertiary;

  const getAnimationClass = (role) => {
    if (!animationPhase || animationPhase === 'idle') return '';
    if (role === 'pitcher' && (animationPhase === 'pitch_throw' || animationPhase === 'contact')) {
      return 'animating-pitch';
    }
    if (role === 'batter' && animationPhase === 'contact') {
      return 'animating-swing';
    }
    if ((role === 'fielder' || role === 'baseGuard' || role === 'catcher') && animationPhase === 'out') {
      return 'animating-react';
    }
    if ((role === 'fielder' || role === 'baseGuard') && animationPhase === 'runner_advancing') {
      return 'animating-move';
    }
    return '';
  };

  const renderPlayer = (player, posCode, placement, isBatter = false) => {
    if (!player) return null;
    const primary = isBatter ? battingPrimaryColor : fieldingPrimaryColor;
    const secondary = isBatter ? battingSecondaryColor : fieldingSecondaryColor;
    const tertiary = isBatter ? battingTertiaryColor : fieldingTertiaryColor;

    let role;
    if (isBatter) {
      const fieldPos = Object.keys(battingFieldMap).find(key => battingFieldMap[key] === player.id);
      role = fieldPos ? POSITION_TO_ROLE[fieldPos] : 'fielder';
    } else {
      role = POSITION_TO_ROLE[posCode];
    }

    const animClass = getAnimationClass(role);
    const isHighlighted = highlightRole === role;

    return (
      <div
        className={`field-player${animClass ? ` ${animClass}` : ''}${isHighlighted ? ' highlighted' : ''}`}
        style={{
          left: `${placement.x}%`,
          top: `${placement.y}%`,
        }}
        onMouseEnter={() => onPlayerHover && onPlayerHover({ player, pos: placement, isBatter })}
        onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
      >
        <Player
          player={player}
          role={role}
          primaryColor={primary}
          secondaryColor={secondary}
          tertiaryColor={tertiary}
        />
      </div>
    );
  };

  // Fielding team players
  const pitcher = getPlayerByFieldPosition('PIT');
  const catcher = getPlayerByFieldPosition('CAT');
  const baseGuard1 = getPlayerByFieldPosition('BAS-1');
  const baseGuard2 = getPlayerByFieldPosition('BAS-2');
  const baseGuard3 = getPlayerByFieldPosition('BAS-3');
  const fielder1 = getPlayerByFieldPosition('FIE-1');
  const fielder2 = getPlayerByFieldPosition('FIE-2');

  // Current batter and base runners
  const currentBatterItem = battingQueue && battingQueue.find(item => item.status === 'batting');
  const currentBatter = currentBatterItem ? currentBatterItem.player : null;

  return (
    <div className="field-players">
      {/* Fielding defensive players */}
      {renderPlayer(pitcher, 'PIT', POSITION_COORDS.PIT, false)}
      {renderPlayer(catcher, 'CAT', POSITION_COORDS.CAT, false)}
      {renderPlayer(baseGuard1, 'BAS-1', POSITION_COORDS['BAS-1'], false)}
      {renderPlayer(baseGuard2, 'BAS-2', POSITION_COORDS['BAS-2'], false)}
      {renderPlayer(baseGuard3, 'BAS-3', POSITION_COORDS['BAS-3'], false)}
      {renderPlayer(fielder1, 'FIE-1', POSITION_COORDS['FIE-1'], false)}
      {renderPlayer(fielder2, 'FIE-2', POSITION_COORDS['FIE-2'], false)}

      {/* Batting team: current batter */}
      {currentBatter && renderPlayer(currentBatter, null, BASE_POSITIONS.home, true)}

      {/* Runners on bases */}
      {baseRunners && baseRunners.map(({ player, baseNum }) => {
        const baseKey = ['first', 'second', 'third'][baseNum - 1];
        return renderPlayer(player, null, BASE_POSITIONS[baseKey], true);
      })}

      {/* Batting Queue */}
      <div className="batting-queue" id="batting-queue">
        <div className="queue-players">
          {battingQueue && battingQueue.map((item, idx) => {
            if (item.status === 'batting') {
              return (
                <div
                  key={idx}
                  className="queue-player queue-slot-empty"
                  onMouseEnter={() => onPlayerHover && onPlayerHover({ player: item.player, type: 'queue' })}
                  onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
                >
                  <span className="slot-number">B</span>
                </div>
              );
            } else if (item.status === 'out') {
              return (
                <div
                  key={idx}
                  className="queue-player queue-out"
                  onMouseEnter={() => onPlayerHover && onPlayerHover({ player: item.player, type: 'queue' })}
                  onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
                >
                  <span className="out-x">X</span>
                </div>
              );
            } else if (item.status && item.status.startsWith('onbase')) {
              const baseNum = item.status.slice(-1);
              return (
                <div
                  key={idx}
                  className="queue-player queue-onbase"
                  onMouseEnter={() => onPlayerHover && onPlayerHover({ player: item.player, type: 'queue' })}
                  onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
                >
                  <span className="base-number">{baseNum}</span>
                </div>
              );
            } else if (item.isHomeRun) {
              return (
                <div
                  key={idx}
                  className="queue-player queue-homerun"
                  onMouseEnter={() => onPlayerHover && onPlayerHover({ player: item.player, type: 'queue' })}
                  onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
                >
                  <span className="hr-badge">HR</span>
                </div>
              );
            } else if (item.player) {
              const fieldPos = Object.keys(battingFieldMap).find(key => battingFieldMap[key] === item.player.id);
              const playerRole = fieldPos ? POSITION_TO_ROLE[fieldPos] : 'fielder';
              return (
                <div
                  key={idx}
                  className="queue-player"
                  onMouseEnter={() => onPlayerHover && onPlayerHover({ player: item.player, type: 'queue' })}
                  onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
                >
                  <Player
                    player={item.player}
                    role={playerRole}
                    primaryColor={battingPrimaryColor}
                    secondaryColor={battingSecondaryColor}
                    tertiaryColor={battingTertiaryColor}
                  />
                </div>
              );
            } else {
              return <div key={idx} className="queue-player queue-empty" />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default FieldPlayers;
