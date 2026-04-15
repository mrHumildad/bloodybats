import React, { useState, useEffect } from 'react';
import { convents } from '../world/convents';
import { useGame } from '../context/GameContext';
import Header from './Header';
import Home from './tabs/Home';
import Overview from './tabs/Overview';
import Team from './tabs/Team';
import Friendly from './tabs/Friendly';
import PlayerInfo from './tabs/PlayerInfo.jsx';


const GameScreen = () => {
  const { gameState } = useGame();
  const [activeTab, setActiveTab] = useState('home');
  const [ selectedPlayer, setSelectedPlayer] = useState(null);
  const [friendlyOpponent, setFriendlyOpponent] = useState(null);
  console.log(convents);
  console.log('GameState in GameScreen:', gameState);
  const myConvent = convents.find(convent => convent.id === gameState.selectedConvent);
  console.log('My Convent:', myConvent);
  
  useEffect(() => {
    if (!myConvent) return;
    const otherConvents = convents.filter(convent => convent.id !== myConvent.id);
    const randomIndex = Math.floor(Math.random() * otherConvents.length);
    setFriendlyOpponent(otherConvents[randomIndex]);
  }, [myConvent]);
   return (
    <div className="game-screen" >
      <Header title={myConvent.name} />
      { activeTab === 'home' &&   <Home setActiveTab={setActiveTab}/> }
      { activeTab === 'overview' && <Overview convent={myConvent}/> }
      { activeTab === 'team' && <Team convent={myConvent} setActiveTab={setActiveTab} setSelectedPlayer={setSelectedPlayer} player={selectedPlayer}/> }
      { activeTab === 'friendly' && <Friendly myConvent={myConvent} setActiveTab={setActiveTab} opponent={friendlyOpponent}/> }
      { activeTab === 'playerInfo' && <PlayerInfo setActiveTab={setActiveTab} selectedPlayer={selectedPlayer}/> }
      { activeTab !== 'home' && activeTab !== 'playerInfo' && <button className="back-button" onClick={() => setActiveTab('home')}>Back</button> }
      { activeTab === 'playerInfo' && <button className="back-button" onClick={() => setActiveTab('team')}>Back</button> }
    </div>
  );
};
export default GameScreen;