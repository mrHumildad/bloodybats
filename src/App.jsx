import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InitNewGame from './components/InitNewGame';
import GameScreen from './components/GameScreen';
import MainMenu from './components/MainMenu.jsx';
import { GameProvider } from './context/GameContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  return (
    <Router>
      <LanguageProvider>
        <GameProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/convent-selector" element={<InitNewGame setData={setData} />} />
               <Route path="/game" element={<GameScreen data={data} setData={setData} />} />
            </Routes>
          </div>
        </GameProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;