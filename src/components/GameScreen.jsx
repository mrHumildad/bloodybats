import React from 'react';
import { convents } from '../world/convents';
import { useGame } from '../context/GameContext';
import Header from './Header';
const GameScreen = () => {
  const { gameState } = useGame();
  console.log('GameState in GameScreen:', gameState);
  const selectedConvent = convents.find(convent => convent.id === gameState.selectedConvent);
  if (!selectedConvent) {
    return (
      <div className="game-screen">
        <h1>No Convent Selected</h1>
        <p>Please select a convent to continue.</p>
      </div>
    );
    }
   return (
    <div className="game-screen" style={{ 
      backgroundColor: selectedConvent.colors.primary,
      color: selectedConvent.colors.secondary,
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Header title={selectedConvent.name} />
      <div className="convent-details">
        <h2>About {selectedConvent.name}</h2>
        <p>{selectedConvent.description}</p>
         
        <div className="convent-stats">
          <div className="stat-group">
            <h3>Stats</h3>
            <p><strong>Stat Focus:</strong> {selectedConvent.stat_focus}</p>
            <p><strong>Data Flow:</strong> {selectedConvent.data_flow}</p>
            <p><strong>Nature:</strong> {selectedConvent.nature}</p>
          </div>
          
          <div className="stat-group">
            <h3>Traits & Rules</h3>
            <p><strong>Special Trait:</strong> {selectedConvent.special_trait}</p>
            <p><strong>Arena Rule:</strong> {selectedConvent.arena_rule}</p>
          </div>
          
          <div className="stat-group">
            <h3>Wine Stats</h3>
            <p><strong>Label:</strong> {selectedConvent.wine_stats.label}</p>
            <p><strong>Quantity:</strong> {selectedConvent.wine_stats.quantity_liters} liters</p>
            <p><strong>Quality:</strong> {selectedConvent.wine_stats.quality}</p>
          </div>
          
          <div className="stat-group">
            <h3>Game Mechanics</h3>
            <p><strong>Hooligan Die:</strong> {selectedConvent.hooligan_die}</p>
            <p><strong>Fanaticism Level:</strong> {selectedConvent.fanaticism.level} (Frenzy Die: {selectedConvent.fanaticism.frenzy_die})</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameScreen;