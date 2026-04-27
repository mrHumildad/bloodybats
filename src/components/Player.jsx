import React from 'react';

const ROLE_COLORS = {
  pitcher: '#5b8c9a',
  batter: '#a0522d',
  catcher: '#8b5a2b',
  baseGuard: '#556b2f',
  fielder: '#b8860b',
  reserve: '#696969',
};

const Player = ({ player, primaryColor, secondaryColor, tertiaryColor }) => {
  if (!player) return null;

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(player.name);
  const jerseyNumber = player.shirtNumber;
  const roleColor = ROLE_COLORS[player.role] || ROLE_COLORS.reserve;
  const isReserve = player.role === 'reserve';
  const strokeDash = isReserve ? '4 2' : undefined;

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      className="player-badge"
    >
       {/* Jersey shape - wider proportions */}
       <path
         d="M 110 30
            L 65 55
            L 50 100
            L 65 115
            L 90 95
            L 90 170
            L 130 170
            L 130 95
            L 155 115
            L 170 100
            L 155 55
            Z"
         fill="none"
         stroke={roleColor}
         strokeWidth="4"
         strokeLinejoin="round"
         strokeDasharray={strokeDash}
       />

      {/* Left half - primary color */}
      <path
        d="M 110 30
           L 65 55
           L 50 100
           L 65 115
           L 90 95
           L 90 170
           L 110 180
           Z"
        fill={primaryColor}
      />

      {/* Right half - secondary color */}
      <path
        d="M 110 30
           L 155 55
           L 170 100
           L 155 115
           L 130 95
           L 130 170
           L 110 180
           Z"
        fill={secondaryColor}
      />

       {/* Re-draw outline on top for clean edges */}
       <path
         d="M 110 30
            L 65 55
            L 50 100
            L 65 115
            L 90 95
            L 90 170
            L 130 170
            L 130 95
            L 155 115
            L 170 100
            L 155 55
            Z"
         fill="none"
         stroke={roleColor}
         strokeWidth="4"
         strokeLinejoin="round"
         strokeDasharray={strokeDash}
       />

       {/* Bottom hem line */}
       <path
         d="M 90 170 L 130 170"
         fill="none"
         stroke={roleColor}
         strokeWidth="3"
         strokeLinecap="round"
         strokeDasharray={strokeDash}
       />

       {/* V-neck collar */}
       <path
         d="M 78 42
            L 110 62
            L 142 42"
         fill="none"
         stroke={roleColor}
         strokeWidth="3"
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeDasharray={strokeDash}
       />

       {/* Sleeve seam hints */}
       <path
         d="M 65 58 L 52 98"
         fill="none"
         stroke={roleColor}
         strokeWidth="2"
         strokeLinecap="round"
         strokeDasharray={strokeDash}
         opacity="0.5"
       />
       <path
         d="M 155 58 L 168 98"
         fill="none"
         stroke={roleColor}
         strokeWidth="2"
         strokeLinecap="round"
         strokeDasharray={strokeDash}
         opacity="0.5"
       />

       {/* Heraldic emblem - left chest */}
       {!isReserve && (
         <g transform="translate(70, 85)">
            {player.role === 'pitcher' && (
              /* Crossed swords */
              <path
               d="M 0 -10 L 4 0 L 0 10 M -4 0 L 4 -10 M -4 0 L 4 10"
               stroke="#4a4540"
               strokeWidth="2"
               fill="none"
               strokeLinecap="round"
             />
           )}
            {player.role === 'batter' && (
              /* Upward lightning bolt */
              <path
               d="M -4 8 L 0 -8 L 4 8"
               stroke="#4a4540"
               strokeWidth="2"
               fill="none"
               strokeLinejoin="round"
               strokeLinecap="round"
             />
           )}
            {player.role === 'catcher' && (
              /* Rounded shield */
              <path
               d="M 0 -9 C 5 -9 7 -6 7 -3 L 7 4 Q 7 9 0 9 Q -7 9 -7 4 L -7 -3 C -7 -6 -5 -9 0 -9 Z"
               fill={roleColor}
               stroke="#4a4540"
               strokeWidth="1.5"
             />
           )}
            {player.role === 'baseGuard' && (
              /* Arch/gate shape */
              <path
               d="M -6 6 L -6 -3 Q -6 -9 0 -9 Q 6 -9 6 -3 L 6 6"
               fill="none"
               stroke="#4a4540"
               strokeWidth="2"
               strokeLinecap="round"
             />
           )}
            {player.role === 'fielder' && (
              /* Triangle pointing down */
              <polygon
               points="0,-10 8,8 -8,8"
               fill={roleColor}
               stroke="#4a4540"
               strokeWidth="1.5"
             />
           )}
         </g>
       )}

       {/* Player Initials - larger, moved up */}
      <text
        x="110"
        y="92"
        textAnchor="middle"
        fontFamily="Cinzel, var(--font-heading), serif"
        fontSize="44"
        fontWeight="700"
        fill={tertiaryColor}
        stroke="rgba(0,0,0,0.6)"
        strokeWidth="2"
      >
        {initials}
      </text>

      {/* Jersey Number - no # symbol, positioned lower */}
      <text
        x="110"
        y="140"
        textAnchor="middle"
        fontFamily="Oswald, var(--font-heading), sans-serif"
        fontSize="46"
        fontWeight="900"
        fill={tertiaryColor}
        stroke="rgba(0,0,0,0.6)"
        strokeWidth="0.5"
      >
        {jerseyNumber}
      </text>
    </svg>
  );
};

export default Player;
