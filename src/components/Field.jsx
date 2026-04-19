import React from "react";
import Player from "./Player";

const Field = ({ children, myConvent, opponent, half, bases, animationPhase, battingQueue, punishmentPit, onPlayerHover }) => {
  const getTeamColors = (convent) => {
    if (!convent) return { primary: '#666', secondary: '#444' };
    return {
      primary: convent.colors.primary,
      secondary: convent.colors.secondary,
    };
  };

  const homeColors = getTeamColors(myConvent);
  const awayColors = getTeamColors(opponent);
  const isHomeBatting = half === 'bottom';
  const teamColors = isHomeBatting ? homeColors : awayColors;

  return (
    <div className="field-container">
      <svg viewBox="0 0 100 100" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
        {/* Group transform to zoom and align field drawing, removing top/bottom margins */}
        <g transform="translate(-11.53846, -11.53846) scale(1.23077)">
        {/* Outfield grass (TRUE wedge from home plate) */}
        <path
          d="M50 70 L10 30 A45 45 0 0 1 90 30 Z"
          fill="#2e7d32"
        />

        {/* Infield dirt (diamond) */}
        <path
          d="M50 30 L70 50 L50 70 L30 50 Z"
          fill="#c68642"
        />

        {/* Bases */}
        <rect x="48" y="28" width="4" height="4" fill="#ddd" /> {/* 2nd */}
        <rect x="68" y="48" width="4" height="4" fill="#ddd" /> {/* 1st */}
        <rect x="48" y="68" width="4" height="4" fill="#ddd" /> {/* home */}
        <rect x="28" y="48" width="4" height="4" fill="#ddd" /> {/* 3rd */}

        {/* Pitcher's mound */}
        <circle cx="50" cy="50" r="3" fill="#a0522d" />

        {/* Foul lines */}
        <line x1="50" y1="70" x2="10" y2="30" stroke="#ffffff" strokeWidth="0.7" />
        <line x1="50" y1="70" x2="90" y2="30" stroke="#ffffff" strokeWidth="0.7" />

        {/* Outfield fence (home run boundary aligned with grass) */}
        <path
          d="M10 30 A45 45 0 0 1 90 30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        </g>
      </svg>
      {children}

      {/* Batting Queue - next batters waiting (left of home plate) */}
      <div className="batting-queue" id="batting-queue">
        <div className="queue-label">BATTERS BATTERY</div>
        <div className="queue-players">
          {battingQueue && battingQueue.map((item, idx) => {
            if (item.status === 'batting') {
              return (
                <div key={idx} className="queue-player queue-slot-empty">
                  <span className="slot-number">{idx + 1}</span>
                </div>
              );
            } else if (item.status === 'out') {
              return (
                <div key={idx} className="queue-player queue-out">
                  <span className="out-x">X</span>
                </div>
              );
            } else if (item.status && item.status.startsWith('onbase')) {
              const baseNum = item.status.slice(-1);
              return (
                <div key={idx} className="queue-player queue-onbase">
                  <span className="base-number">{baseNum}</span>
                </div>
              );
            } else {
              return (
                <div
                  key={idx}
                  className="queue-player"
                  onMouseEnter={() => onPlayerHover && onPlayerHover({ player: item.player, type: 'queue' })}
                  onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
                >
                  <Player
                    player={item.player}
                    primaryColor={teamColors.primary}
                    secondaryColor={teamColors.secondary}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Punishment Pit - out counter (right of home plate) */}
      <div className="punishment-pit" id="punishment-pit">
        <div className="pit-label">OUTS</div>
        <div className="pit-players">
          {punishmentPit && punishmentPit.map((player, idx) => (
            <div
              key={idx}
              className="pit-player"
              onMouseEnter={() => onPlayerHover && onPlayerHover({ player, type: 'pit' })}
              onMouseLeave={() => onPlayerHover && onPlayerHover(null)}
            >
              <Player
                player={player}
                primaryColor={isHomeBatting ? homeColors.primary : awayColors.primary}
                secondaryColor={isHomeBatting ? homeColors.secondary : awayColors.secondary}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Field;
