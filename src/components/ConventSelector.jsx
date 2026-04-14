import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConventCard from './ConventCard';
import { convents } from '../world/convents';
import { useGame } from '../context/GameContext';

const ConventSelector = () => {
  const [currentConventIndex, setCurrentConventIndex] = useState(0);
  const navigate = useNavigate();
  const { setGameState } = useGame();

  const handlePrev = () => {
    setCurrentConventIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : convents.length - 1
    );
  };

  const handleNext = () => {
    setCurrentConventIndex(prevIndex => 
      prevIndex < convents.length - 1 ? prevIndex + 1 : 0
    );
  };

const handleConfirm = () => {
    const selectedConvent = convents[currentConventIndex].id;
    setGameState({ selectedConvent });
    navigate(`/game`);
};

  const currentConvent = convents[currentConventIndex];

  return (
    <div className="convent-selector">
      <h1>Choose Your Convent</h1>
      
      <div className="convent-navigation">
        <button 
          className="nav-button prev-button"
          onClick={handlePrev}
        >
          ←
        </button>
        
        <div className="convent-display">
          <ConventCard
            convent={currentConvent}
            isSelected={true}
            onSelect={() => {}}
          />
        </div>
        
        <button 
          className="nav-button next-button"
          onClick={handleNext}
        >
          →
        </button>
      </div>
      
      <div className="confirm-section">
        <button 
          className="confirm-button"
          onClick={handleConfirm}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default ConventSelector;