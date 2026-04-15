import React from 'react';
import { playerStars } from '../../logic/ui_utils';
const Team = ({ convent, setActiveTab, setSelectedPlayer, selectedPlayer }) => {
  if (!convent || !convent.team) {
    return (
      <div className="team-tab tab">
        <p>No team data available</p>
      </div>
    );
  }
  const handlePlayerClick = (event) => {
    const playerName = event.currentTarget.querySelector('td').textContent;
    const player = convent.team.find(p => p.name === playerName);
    setSelectedPlayer(player);
    setActiveTab('playerInfo');
  }
  return (
    <div className="team-tab tab">
      <h2>{convent.name} Team</h2>
      <table className="team-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Age</th>
            <th>Reserve</th>
            <th>Stars</th>
          </tr>
        </thead>
        <tbody>
          {convent.team.map(player => (
            <tr key={player.id} onClick={handlePlayerClick}>
              <td>{player.name}</td>
              <td>{player.role}</td>
              <td>{player.age}</td>
              <td>{player.isReserve ? 'Yes' : 'No'}</td>
              <td>{playerStars(player)}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Team;