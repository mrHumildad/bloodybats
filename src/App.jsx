import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConventSelector from './components/ConventSelector';
import GameScreen from './components/GameScreen';
import MainMenu from './components/MainMenu.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/convent-selector" element={<ConventSelector />} />
          <Route path="/game/:conventId" element={<GameScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;