import React from 'react';
import { playerStars } from '../../logic/ui_utils';
import { getRoleColorClass, getBackupPlayerIds } from '../../logic/utils';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, translateRole } from '../../translations';
import { getRoleFromPosition, getPositionForPlayer, getBattingOrderPosition } from '../../logic/positionUtils';

const Team = ({ convent, setActiveTab, setSelectedPlayer }) => {
  const { language } = useLanguage();

  if (!convent || !convent.team) {
    return (
      <div className="team-tab tab">
        <p>{getTranslation('noTeamData', language)}</p>
      </div>
    );
  }

  const handlePlayerClick = (event) => {
    const playerName = event.currentTarget.querySelector('td').textContent;
    const player = convent.team.find(p => p.name === playerName);
    setSelectedPlayer(player);
    setActiveTab('playerInfo');
  };

   // Helper to get display info for a player
   const getPlayerInfo = (player) => {
     // Check if player is a backup (not in batting order, field, or reserves)
     const backupIds = getBackupPlayerIds(convent);
     
     // Get field position (e.g., "PIT", "CAT", "BAS-1", "DH", etc.) or null if reserve/backup
     const fieldPos = getPositionForPlayer(player, convent);
     
     // Get role for styling
     let role;
     if (backupIds.includes(player.id)) {
       role = 'backup';
     } else if (fieldPos) {
       role = fieldPos === 'DH' ? 'dh' : getRoleFromPosition(fieldPos);
     } else {
       role = 'reserve';
     }
     
     // Get batting order position (1-8) or null if not in batting order
     const battingNum = convent.battingOrder 
       ? getBattingOrderPosition(player.id, convent.battingOrder)
       : null;
     
     return { fieldPos, role, battingNum };
   };

  return (
    <div className="team-tab tab">
      <h2>{convent.name} Team</h2>
      <table className="team-table">
        <thead>
          <tr>
            <th>{getTranslation('name', language)}</th>
            <th>{getTranslation('role', language)}</th>
            <th>{getTranslation('number', language)}</th>
            <th>{getTranslation('position', language)}</th>
            <th>Batting</th>
            <th>{getTranslation('age', language)}</th>
            <th>{getTranslation('stars', language)}</th>
          </tr>
        </thead>
        <tbody>
          {convent.team.map(player => {
            const { fieldPos, role, battingNum } = getPlayerInfo(player);
            return (
               <tr key={player.id} onClick={handlePlayerClick}>
                 <td>{player.name}</td>
                 <td className={getRoleColorClass(role)}>
                   {role === 'backup' ? 'BKP' : translateRole(role, language).slice(0, 3)}
                 </td>
                 <td className="shirt-number"><span className="player-number">{player.shirtNumber}</span></td>
                 <td className="player-position">{fieldPos === 'DH' ? '-' : (fieldPos || '-')}</td>
                 <td>{battingNum !== null ? battingNum : '-'}</td>
                 <td>{player.age}</td>
                 <td>{playerStars(player)}</td>
               </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Team;