import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConventSelector from './components/ConventSelector';
import GameScreen from './components/GameScreen';
import MainMenu from './components/MainMenu.jsx';
import { GameProvider } from './context/GameContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <GameProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/convent-selector" element={<ConventSelector />} />
              <Route path="/game" element={<GameScreen />} />
            </Routes>
          </div>
        </GameProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;