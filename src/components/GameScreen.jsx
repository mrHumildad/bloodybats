import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, getConventField } from '../translations';
import { getCpuMatchResult } from '../logic/getCpuMatchResult';
import { updateStatsFromMatch, getDefaultStats } from '../logic/stats';
import Header from './Header';
import Home from './tabs/Home';
import Overview from './tabs/Overview';
import Team from './tabs/Team';
import Match from './tabs/Match';
import Fixtures from './tabs/Fixtures';
import LeaderBoard from './tabs/LeaderBoard.jsx';
import PlayerInfo from './tabs/PlayerInfo.jsx';
import NextWeek from './tabs/NextWeek.jsx';
import Lineup from './tabs/Lineup.jsx';

const GameScreen = ({ data, setData }) => {
  const { startMatch, executeAtBat, checkGameOver, matchState, setMatchState } = useGame();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const myConvent = data.convents.find(convent => convent.id === data.myId);

  const handleConventUpdate = (updatedConvent) => {
    setData(prev => ({
      ...prev,
      convents: prev.convents.map(c => c.id === updatedConvent.id ? updatedConvent : c)
    }));
  };

  const conventName = myConvent ? getConventField(myConvent, 'name', language) : '';
  const roundIdx = data.week - 1;
  const round = data.fixtures[roundIdx];
  const match = round.matches.find(m => m.home === myConvent.id || m.away === myConvent.id);
  const oppId = match.home === myConvent.id ? match.away : match.home;
  const opponentConvent = data.convents.find(c => c.id === oppId);
  const isHome = match.home === myConvent.id;
  
  const handleMatchEnd = (updatedConvents) => {
    const roundIdx = data.week - 1;
    const currentRound = data.fixtures[roundIdx];

    // Build mutable stats map from updatedConvents (includes player's match updates)
    const statsMap = new Map();
    updatedConvents.forEach(c => {
      statsMap.set(c.id, { ...c.stats });
    });

    // Process all matches in this round: add scores to fixtures and update stats for CPU matches
    const newMatches = currentRound.matches.map(match => {
      const isPlayerMatch = (match.home === myConvent.id && match.away === opponentConvent.id) ||
                            (match.home === opponentConvent.id && match.away === myConvent.id);

      if (isPlayerMatch) {
        // Player's match: scores already in matchState; stats already in updatedConvents
        return { ...match, homeScore: matchState.score.home, awayScore: matchState.score.away };
      }

      // CPU match: if no scores yet, generate and update stats
      if (match.homeScore === undefined || match.awayScore === undefined) {
        const homeC = updatedConvents.find(c => c.id === match.home);
        const awayC = updatedConvents.find(c => c.id === match.away);
        if (homeC && awayC) {
          const cpuResult = getCpuMatchResult(homeC, awayC);

          // Update stats for home and away CPU teams
          const homeStats = statsMap.get(match.home) || getDefaultStats();
          const awayStats = statsMap.get(match.away) || getDefaultStats();

          const updated = updateStatsFromMatch(
            homeStats,
            awayStats,
            cpuResult.homeScore,
            cpuResult.awayScore,
            cpuResult.homeHits,
            cpuResult.awayHits,
            cpuResult.homeErrors,
            cpuResult.awayErrors
          );

          statsMap.set(match.home, updated.home);
          statsMap.set(match.away, updated.away);

          return { ...match, ...cpuResult };
        }
      }

      // Already has scores (shouldn't happen for current week, but keep)
      return match;
    });

    // Build final convents with merged stats
    const finalConvents = updatedConvents.map(c => ({
      ...c,
      stats: statsMap.get(c.id)
    }));

    // Build updated fixtures
    const updatedFixtures = data.fixtures.map((r, idx) => {
      if (idx !== roundIdx) return r;
      return { ...r, matches: newMatches };
    });

    setData(prev => ({
      ...prev,
      convents: finalConvents,
      fixtures: updatedFixtures,
      week: prev.week + 1
    }));
  };

   // Reset matchState when leaving match tab to force fresh start next time
   useEffect(() => {
     if (activeTab !== 'match') {
       setMatchState(null);
     }
   }, [activeTab, setMatchState]);

   // Initialize match when entering match tab if no match exists
   useEffect(() => {
     if (activeTab === 'match' && !matchState && myConvent && opponentConvent) {
        if (isHome) {
          startMatch(myConvent, opponentConvent, { innings: 3 });
        } else {
          startMatch(opponentConvent, myConvent, { innings: 3 });
        }
     }
   }, [activeTab, matchState, myConvent, opponentConvent, isHome, startMatch]);

   return (
    <div className="game-screen">
      {/* Hide header and back button during active match */}
      {activeTab !== 'match' && <Header title={conventName} />}
      {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
      {activeTab === 'overview' && <Overview convent={myConvent} />}
      {activeTab === 'team' && <Team convent={myConvent} setActiveTab={setActiveTab} setSelectedPlayer={setSelectedPlayer} />}
      {activeTab === 'lineup' && (
        <Lineup
          myConvent={myConvent}
          onConventUpdate={handleConventUpdate}
        />
      )}
      {activeTab === 'fixtures' && (
        <Fixtures
          fixtures={data.fixtures}
          convents={data.convents}
          myId={data.myId}
          roundIdx={roundIdx}
        />
      )}
      {activeTab === 'leaderboard' && (
        <LeaderBoard
          convents={data.convents}
          myId={data.myId}
        />
      )}
      {activeTab === 'match' && (
        <Match
          myConvent={myConvent}
          opponent={opponentConvent}
          convents={data.convents}
          setActiveTab={setActiveTab}
          matchState={matchState}
          onPitch={matchState && !checkGameOver() ? executeAtBat : null}
          onMatchEnd={handleMatchEnd}
        />
      )}
      {activeTab === 'playerInfo' && (
        <PlayerInfo
          setActiveTab={setActiveTab}
          selectedPlayer={selectedPlayer}
          myConvent={myConvent}
        />
      )}
      {activeTab === 'nextWeek' && (
        <NextWeek
          fixtures={data.fixtures}
          convents={data.convents}
          currentWeek={data.week - 1}
          onContinue={() => setActiveTab('home')}
        />
      )}
      {activeTab !== 'home' && activeTab !== 'playerInfo' && activeTab !== 'match' && activeTab !== 'nextWeek' && (
        <button className="back-button" onClick={() => setActiveTab('home')}>
          {getTranslation('back', language)}
        </button>
      )}
    </div>
  );
};

export default GameScreen;