/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { createMatch, executeAtBat, endInning, isGameOver, getWinner, setPendingAction, setRollResult } from '../logic/match';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({ selectedConvent: null });
  const [matchState, setMatchState] = useState(null);

  const startMatch = useCallback((homeTeam, awayTeam, config) => {
    const newMatch = createMatch(homeTeam, awayTeam, config);
    setMatchState(newMatch);
  }, []);

  const setPendingActionCallback = useCallback((role, actionId) => {
    setMatchState(prev => {
      if (!prev) return prev;
      return setPendingAction(prev, role, actionId);
    });
  }, []);

  const setRollResultCallback = useCallback((role, result) => {
    setMatchState(prev => {
      if (!prev) return prev;
      return setRollResult(prev, role, result);
    });
  }, []);

  const resolveTurn = useCallback(() => {
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
    setMatchState,
    startMatch,
    executeAtBat: resolveTurn,
    resolveTurn,
    setPendingAction: setPendingActionCallback,
    setRollResult: setRollResultCallback,
    endInning: doEndInning,
    checkGameOver: () => isGameOver(matchState),
    checkWinner: () => getWinner(matchState),
  }), [gameState, matchState, startMatch, resolveTurn, setPendingActionCallback, setRollResultCallback, doEndInning]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};