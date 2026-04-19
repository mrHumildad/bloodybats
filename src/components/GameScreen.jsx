import React, { useState, useMemo, useEffect } from 'react';
import { convents } from '../world/convents';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, getConventField } from '../translations';
import Header from './Header';
import Home from './tabs/Home';
import Overview from './tabs/Overview';
import Team from './tabs/Team';
import Friendly from './tabs/Friendly';
import PlayerInfo from './tabs/PlayerInfo.jsx';

const GameScreen = () => {
  const { gameState, startMatch, executeAtBat, checkGameOver, matchState } = useGame();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const myConvent = convents.find(convent => convent.id === gameState?.selectedConvent);

  const conventName = myConvent ? getConventField(myConvent, 'name', language) : '';

  // Initialize match once when convent is selected
  useEffect(() => {
    if (myConvent && !matchState) {
      const otherConvents = convents.filter(c => c.id !== myConvent.id);
      const seed = (myConvent.id * 9301 + 49297) % 233280;
      const randomIndex = seed % otherConvents.length;
      const opponentConvent = otherConvents[randomIndex];

      const homeTeam = myConvent.team;
      const awayTeam = opponentConvent.team;

      startMatch(homeTeam, awayTeam, { innings: 3 });
    }
  }, [myConvent, matchState, startMatch]);

  const friendlyOpponent = useMemo(() => {
    if (!myConvent) return null;
    const otherConvents = convents.filter(convent => convent.id !== myConvent.id);
    const seed = (myConvent.id * 9301 + 49297) % 233280;
    const randomIndex = seed % otherConvents.length;
    return otherConvents[randomIndex];
  }, [myConvent]);

  return (
    <div className="game-screen">
      {/* Hide header and back button during active friendly match */}
      {activeTab !== 'friendly' && <Header title={conventName} />}
      {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
      {activeTab === 'overview' && <Overview convent={myConvent} />}
      {activeTab === 'team' && <Team convent={myConvent} setActiveTab={setActiveTab} setSelectedPlayer={setSelectedPlayer} />}
      {activeTab === 'friendly' && (
        <Friendly
          myConvent={myConvent}
          setActiveTab={setActiveTab}
          opponent={friendlyOpponent}
          matchState={matchState}
          onPitch={matchState && !checkGameOver() ? executeAtBat : null}
        />
      )}
      {activeTab === 'playerInfo' && (
        <PlayerInfo
          setActiveTab={setActiveTab}
          selectedPlayer={selectedPlayer}
          myConvent={myConvent}
        />
      )}
      {activeTab !== 'home' && activeTab !== 'playerInfo' && activeTab !== 'friendly' && (
        <button className="back-button" onClick={() => setActiveTab('home')}>
          {getTranslation('back', language)}
        </button>
      )}
    </div>
  );
};

export default GameScreen;