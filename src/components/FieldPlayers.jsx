import React from 'react';
import Player from './Player';

const POSITION_COORDS = {
  PIT: { x: 50, y: 50 },
  CAT: { x: 50, y: 82 },
  'BAS-1': { x: 62.3077, y: 61.0769 },
  'BAS-2': { x: 62.3077, y: 37.6923 },
  FIE: { x: 50, y: 19.2308 },
};

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
  animationPhase,
  battingQueue,
  baseRunners = [],
  onPlayerHover,
  pitcher,
  catcher
}) => {
  if (!homeConvent || !awayConvent) return null;

  const isHomeFielding = half === 'top';
  const fieldingConvent = isHomeFielding ? homeConvent : awayConvent;
  const battingConvent = isHomeFielding ? awayConvent : homeConvent;
  const fieldingTeam = fieldingConvent.team;

  const getPlayerByPosition = (positionCode) => {
    return fieldingTeam.find(p => p.position === positionCode);
  };

  const baseGuard1 = getPlayerByPosition('BAS-1');
  const baseGuard2 = getPlayerByPosition('BAS-2');
  const fielder = getPlayerByPosition('FIE');

  const fieldingPrimaryColor = fieldingConvent.colors.primary;
  const fieldingSecondaryColor = fieldingConvent.colors.secondary;
  const battingPrimaryColor = battingConvent.colors.primary;
  const battingSecondaryColor = battingConvent.colors.secondary;

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

  const renderPlayer = (player, pos, isBatter = false) => {
    if (!player) return null;
    const primary = isBatter ? battingPrimaryColor : fieldingPrimaryColor;
    const secondary = isBatter ? battingSecondaryColor : fieldingSecondaryColor;
    const animClass = getAnimationClass(player.role);

    return (
      <div
        className={`field-player${animClass ? ` ${animClass}` : ''}`}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
        onMouseEnter={() => onPlayerHover && onPlayerHover({ player, pos, isBatter })}
        onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
      >
        <Player
          player={player}
          primaryColor={primary}
          secondaryColor={secondary}
        />
      </div>
    );
  };

  // Current batter is the slot with 'batting' status
  const currentBatterItem = battingQueue && battingQueue.find(item => item.status === 'batting');
  const currentBatter = currentBatterItem ? currentBatterItem.player : null;

  return (
    <div className="field-players">
      {/* Fielding team */}
      {renderPlayer(pitcher, POSITION_COORDS.PIT)}
      {renderPlayer(catcher, POSITION_COORDS.CAT)}
      {renderPlayer(baseGuard1, POSITION_COORDS['BAS-1'])}
      {renderPlayer(baseGuard2, POSITION_COORDS['BAS-2'])}
      {renderPlayer(fielder, POSITION_COORDS.FIE)}

      {/* Batting team */}
      {currentBatter && renderPlayer(currentBatter, BASE_POSITIONS.home, true)}

      {/* Runners on bases */}
      {baseRunners && baseRunners.map(({ player, baseNum }) => {
        const baseKey = ['first', 'second', 'third'][baseNum - 1];
        return renderPlayer(player, BASE_POSITIONS[baseKey], true);
      })}

      {/* Batting Queue - fixed 5-slot bench */}
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
              return (
                <div
                  key={idx}
                  className="queue-player"
                  onMouseEnter={() => onPlayerHover && onPlayerHover({ player: item.player, type: 'queue' })}
                  onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
                >
                  <Player
                    player={item.player}
                    primaryColor={battingPrimaryColor}
                    secondaryColor={battingSecondaryColor}
                  />
                </div>
              );
            } else {
              return (
                <div key={idx} className="queue-player queue-empty" />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default FieldPlayers;
