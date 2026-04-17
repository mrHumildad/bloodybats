import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const MainMenu = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  const handleNewGame = () => {
    navigate('/convent-selector');
  };

  const handleLoadGame = () => {
    alert('Load Game functionality not implemented yet');
  };

  const handleOptions = () => {
    alert('Options functionality not implemented yet');
  };

  return (
    <div className="main-menu">
      <h1>{getTranslation('appTitle', language)}</h1>
      <button onClick={handleNewGame}>{getTranslation('newGame', language)}</button>
      <button onClick={handleLoadGame}>{getTranslation('loadGame', language)}</button>
      <button onClick={handleOptions}>{getTranslation('options', language)}</button>
      <button onClick={toggleLanguage} className="language-toggle">
        {language === 'en' ? 'Español' : 'English'}
      </button>
    </div>
  );
};

export default MainMenu;