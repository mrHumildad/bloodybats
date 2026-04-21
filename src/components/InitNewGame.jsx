import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConventCard from './ConventCard';
import { convents } from '../world/convents';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { getFixtures } from '../logic/getFixtures';
import { getDefaultStats } from '../logic/stats';

const data = {
  myId : null,
  week: 1,
  year: 1,
  convents: convents.map(c => ({ ...c, stats: getDefaultStats() })),
  fixtures: getFixtures(convents.map(c => c.id)),
}

const InitNewGame = ({ setData }) => {
  const [currentConventIndex, setCurrentConventIndex] = useState(0);
  const navigate = useNavigate();
  const { language } = useLanguage();

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
    const newData = { ...data, myId: selectedConvent };
    setData(newData);
    //setGameState({ selectedConvent });
    navigate(`/game`);
  };

  const currentConvent = convents[currentConventIndex];

  return (
    <div className="convent-selector">
      <h1>{getTranslation('chooseConvent', language)}</h1>

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
          {getTranslation('startGame', language)}
        </button>
      </div>
    </div>
  );
};

export default InitNewGame;