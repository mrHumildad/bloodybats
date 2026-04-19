import React from 'react';
import { playerStars } from '../../logic/ui_utils';
import { getRoleColorClass } from '../../logic/utils';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, translateRole } from '../../translations';

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
            <th>{getTranslation('age', language)}</th>
            <th>{getTranslation('stars', language)}</th>
          </tr>
        </thead>
        <tbody>
          {convent.team.map(player => (
            <tr key={player.id} onClick={handlePlayerClick}>
              <td>{player.name}</td>
              <td className={getRoleColorClass(player.role)}>{translateRole(player.role, language).slice(0, 3)}</td>
              <td className="shirt-number"><span className="player-number">{player.shirtNumber}</span></td>
              <td className="player-position">{player.position}</td>
              <td>{player.age}</td>
              <td>{playerStars(player)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Team;