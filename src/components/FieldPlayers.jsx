import React from 'react';
import Player from './Player';

// Coordinate mapping for defensive positions on the 100x100 SVG field
const POSITION_COORDS = {
  PIT: { x: 50, y: 50 },     // pitcher's mound
  CAT: { x: 50, y: 68 },     // catcher behind home plate
  'BAS-1': { x: 68, y: 52 }, // first base guard
  'BAS-2': { x: 32, y: 52 }, // third base guard
  FIE: { x: 50, y: 25 },     // center fielder
};

// Batter positions: spread horizontally behind home plate
const getBatterPosition = (index, total) => {
  if (total === 1) return { x: 50, y: 78 };
  if (total === 2) return { x: index === 0 ? 45 : 55, y: 78 };
  if (total === 3) return { x: 40 + index * 10, y: 78 };
  // 4 or 5 batters
  return { x: 30 + index * 10, y: 78 };
};

const FieldPlayers = ({ homeConvent, awayConvent, half, animationPhase }) => {
  if (!homeConvent || !awayConvent) return null;

  // Determine which convent is fielding (defensive positions) and which is batting
  // Top of inning: away team batting, home team fielding
  // Bottom of inning: home team batting, away team fielding
  const isHomeFielding = half === 'top';
  const fieldingConvent = isHomeFielding ? homeConvent : awayConvent;
  const battingConvent = isHomeFielding ? awayConvent : homeConvent;
  const fieldingTeam = fieldingConvent.team; // array of players
  const battingTeam = battingConvent.team;

  // Get fielding players by position
  const getPlayerByPosition = (positionCode) => {
    return fieldingTeam.find(p => p.position === positionCode);
  };

  const pitcher = getPlayerByPosition('PIT');
  const catcher = getPlayerByPosition('CAT');
  const baseGuard1 = getPlayerByPosition('BAS-1');
  const baseGuard2 = getPlayerByPosition('BAS-2');
  const fielder = getPlayerByPosition('FIE');

  // Get all batters from batting team
  const batters = battingTeam.filter(p => p.role === 'batter' || p.position?.startsWith('BAT'));

  const fieldingPrimaryColor = fieldingConvent.colors.primary;
  const fieldingSecondaryColor = fieldingConvent.colors.secondary;
  const battingPrimaryColor = battingConvent.colors.primary;
  const battingSecondaryColor = battingConvent.colors.secondary;

  // Determine animation class for a player based on role and current phase
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
        key={player.id}
        className={`field-player${animClass ? ` ${animClass}` : ''}`}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
      >
        <Player
          player={player}
          primaryColor={primary}
          secondaryColor={secondary}
        />
      </div>
    );
  };

  return (
    <div className="field-players">
      {/* ========== FIELDING TEAM ========== */}
      {/* Pitcher */}
      {renderPlayer(pitcher, POSITION_COORDS.PIT)}

      {/* Catcher */}
      {renderPlayer(catcher, POSITION_COORDS.CAT)}

      {/* Base Guard at first base */}
      {renderPlayer(baseGuard1, POSITION_COORDS['BAS-1'])}

      {/* Base Guard at third base */}
      {renderPlayer(baseGuard2, POSITION_COORDS['BAS-2'])}

      {/* Fielder (outfield) */}
      {renderPlayer(fielder, POSITION_COORDS.FIE)}

      {/* ========== BATTING TEAM ========== */}
      {/* Batters at bottom (home plate area) */}
      {batters.map((batter, idx) => {
        const pos = getBatterPosition(idx, batters.length);
        return renderPlayer(batter, pos, true);
      })}
    </div>
  );
};

export default FieldPlayers;
