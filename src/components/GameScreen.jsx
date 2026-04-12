import React from 'react';
import { generateWorld } from '../world/world';
import { getConventById } from '../world/world';

const GameScreen = ({ conventId }) => {
  const world = generateWorld();
  const convent = getConventById(parseInt(conventId), world);
  
  if (!convent) {
    return (
      <div className="game-screen">
        <h1>Convent Not Found</h1>
        <p>The selected convent could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="game-screen">
      <h1>{convent.name}</h1>
      <div className="convent-header">
        <p className="convent-description">{convent.description}</p>
        <div className="convent-colors">
          <div 
            className="primary-color" 
            style={{ backgroundColor: convent.colors.primary }}
          ></div>
          <div 
            className="secondary-color" 
            style={{ backgroundColor: convent.colors.secondary }}
          ></div>
        </div>
      </div>
      
      <div className="monks-section">
        <h2>The Monks</h2>
        <p>Each convent fields a full team of monks generated for the holy game:</p>
        <div className="monks-grid">
          {convent.monks.map(player => (
            <div key={player.id} className="monk-card">
              <h3>{player.name}</h3>
              <p className="role">{player.role}</p>
              <div className="attributes">
                {Object.entries(player.attributes).map(([attr, value]) => (
                  <div key={attr} className="attribute">
                    <span className="attr-name">{attr}:</span>
                    <span className="attr-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;