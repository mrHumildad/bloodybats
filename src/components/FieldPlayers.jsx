import React, { useState } from 'react';
import Player from './Player';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, translateRole } from '../translations';
import { getRoleColorClass } from '../logic/utils';
import { playerStars } from '../logic/ui_utils';

// Coordinate mapping for defensive positions on the 100x100 SVG field
const POSITION_COORDS = {
  PIT: { x: 50, y: 50 },            // pitcher's mound (centered)
  CAT: { x: 50, y: 82 },            // catcher behind home plate
  'BAS-1': { x: 62.3077, y: 61.0769 }, // first base guard
  'BAS-2': { x: 62.3077, y: 37.6923 }, // second base guard
  FIE: { x: 50, y: 19.2308 },       // center fielder
};

const BASE_POSITIONS = {
  home: { x: 50, y: 74.6154 },      // directly on home plate
  first: { x: 74.6154, y: 50 },     // first base
  second: { x: 50, y: 25.3846 },    // second base
  third: { x: 25.3846, y: 50 },     // third base
};



const FieldPlayers = ({ homeConvent, awayConvent, half, bases, animationPhase, onPlayerHover }) => {
  const { language } = useLanguage();

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

    const handleMouseEnter = () => {
      onPlayerHover && onPlayerHover({ player, pos, isBatter });
    };

    const handleMouseLeave = () => {
      onPlayerHover && onPlayerHover(null);
    };

    return (
      <div
        key={player.id}
        className={`field-player${animClass ? ` ${animClass}` : ''}`}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Player
          player={player}
          primaryColor={primary}
          secondaryColor={secondary}
        />
      </div>
    );
  };

  // Build list of batting players to show on bases
  // Ensure bases is an array with 3 boolean entries [first, second, third]
  const safeBases = Array.isArray(bases) ? bases : [false, false, false];
  const batters = battingTeam.filter(p => p.role === 'batter' || p.position?.startsWith('BAT'));

  // Batter at home plate (current batter - first in lineup)
  const currentBatter = batters[0] || null;

  // Runners on bases: assign next batters to occupied bases
  const baseKeys = ['first', 'second', 'third'];
  const baseRunners = [];
  let batterIdx = 1; // start after current batter
  baseKeys.forEach((baseKey, i) => {
    if (safeBases[i] && batters[batterIdx]) {
      baseRunners.push({ player: batters[batterIdx], position: BASE_POSITIONS[baseKey] });
      batterIdx++;
    }
    // If base not occupied or no batter, skip (no runner shown)
  });

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
      {/* Current batter at home plate */}
      {currentBatter && renderPlayer(currentBatter, BASE_POSITIONS.home, true)}

      {/* Runners on occupied bases */}
      {baseRunners.map(({ player, position }) =>
        renderPlayer(player, position, true)
      )}


    </div>
  );
};

export default FieldPlayers;
