/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { createMatch, executeAtBat, endInning, isGameOver, getWinner } from '../logic/match';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({ selectedConvent: null });
  const [matchState, setMatchState] = useState(null);

  const startMatch = useCallback((homeTeam, awayTeam, config) => {
    const newMatch = createMatch(homeTeam, awayTeam, config);
    setMatchState(newMatch);
  }, []);

  const doExecuteAtBat = useCallback(() => {
    setMatchState(prev => {
      if (!prev) return prev;
      const next = executeAtBat(prev);
      return next;
    });
  }, []);

  const doEndInning = useCallback(() => {
    setMatchState(prev => {
      if (!prev) return prev;
      return endInning(prev);
    });
  }, []);

   const value = useMemo(() => ({
     gameState,
     setGameState,
     matchState,
     startMatch,
     executeAtBat: doExecuteAtBat,
     endInning: doEndInning,
     checkGameOver: () => isGameOver(matchState),
     checkWinner: () => getWinner(matchState),
   }), [gameState, matchState, startMatch, doExecuteAtBat, doEndInning]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};