import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate('/convent-selector'); // Navigate to ConventSelector
  };

  const handleLoadGame = () => {
    // Placeholder for load game functionality
    alert('Load Game functionality not implemented yet');
  };

  const handleOptions = () => {
    // Placeholder for options functionality
    alert('Options functionality not implemented yet');
  };

  return (
    <div className="main-menu">
      <h1>Bloody Bats</h1>
      <button onClick={handleNewGame}>New Game</button>
      <button onClick={handleLoadGame}>Load Game</button>
      <button onClick={handleOptions}>Options</button>
    </div>
  );
};

export default MainMenu;