// Match logic for Bloody Bats
// Core state and functions for managing a baseball match with dice-based player attributes.

import { actions } from './actions.js';

export const matchConfig = {
  innings: 3,
};

// Empty template (kept for backward compatibility)
export const match = {
  homeTeam: null,
  awayTeam: null,
  currentInning: 1,
  events: [],
  score: {
    home: 0,
    away: 0,
  },
  inningScores: {
    home: [],
    away: [],
  },
  hits: {
    home: 0,
    away: 0,
  },
  errors: {
    home: 0,
    away: 0,
  },
};

// Attribute map: display name -> player attribute key
export const ATTRIBUTE_MAP = {
  Body: 'body',
  Mind: 'mind',
  Heart: 'heart',
  Cunning: 'cunning',
  Power: 'power',
  Fortitude: 'fortitude',
};

// Helper: roll a die with given number of sides (1 to sides)
export const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

// Helper: advance runners on bases by a number of steps (1-4)
// bases: boolean array [first, second, third]
// returns { newBases: boolean[], runs: number }
const advanceRunners = (bases, steps) => {
  let runs = 0;
  const newBases = [false, false, false];
  for (let i = 0; i < 3; i++) {
    if (bases[i]) {
      const baseNumber = i + 1; // 1,2,3
      const newPos = baseNumber + steps;
      if (newPos >= 4) {
        runs++;
      } else {
        newBases[newPos - 1] = true;
      }
    }
  }
  return { newBases, runs };
};

// Get total roll for a player action: roll 2 dice for each attribute in the combo
// Returns { total: number, dice: [d1, d2] } where dice are individual die rolls
export const getActionTotal = (player, action) => {
  const comboAttributes = action.combo; // e.g., ['Body', 'Power']
  const dice = [];
  for (const attr of comboAttributes) {
    const attrKey = ATTRIBUTE_MAP[attr];
    if (!attrKey) {
      console.error(`Unknown attribute: ${attr}`);
      dice.push(rollDie(6)); // fallback
    } else {
      const sides = player.attributes[attrKey];
      dice.push(rollDie(sides));
    }
  }
  const total = dice[0] + dice[1];
  return { total, dice };
};

// Set a pending action for a role in state
export const setPendingAction = (state, role, actionId) => {
  return {
    ...state,
    pendingActions: {
      ...state.pendingActions,
      [role]: actionId,
    },
  };
};

// Set a roll result for a role (catcher, pitcher, batter)
export const setRollResult = (state, role, result) => {
  const fieldMap = {
    catcher: 'catcherRollResult',
    pitcher: 'pitcherRollResult',
    batter: 'batterRollResult',
  };
  const field = fieldMap[role];
  if (!field) {
    console.error(`Unknown role for roll result: ${role}`);
    return state;
  }
  return {
    ...state,
    [field]: result,
  };
};

// Clear all turn state (pending actions and roll results)
export const clearTurnState = (state) => {
  return {
    ...state,
    pendingActions: { pitcher: null, catcher: null, batter: null },
    catcherRollResult: null,
    pitcherRollResult: null,
    batterRollResult: null,
  };
};

// Determine outcome string from die roll difference (batterRoll - pitcherRoll)
// Now includes ball and strike outcomes for more realistic gameplay
const getOutcome = (diff) => {
  if (diff >= 4) return 'home_run';
  if (diff === 3) return 'triple';
  if (diff === 2) return 'double';
  if (diff === 1) return 'single';
  if (diff === 0) return 'ground_out';
  if (diff === -1) return 'fly_out';
  if (diff === -2) return 'strike';
  if (diff === -3) return 'ball';
  return 'strikeout';
};

// Get the current batting team and pitching team based on half
const getTeams = (state) => {
  if (state.half === 'top') {
    return {
      battingTeam: state.awayTeam,
      pitchingTeam: state.homeTeam,
      battingOrder: state.awayBattingOrder,
      batterIndex: state.awayBatterIndex,
      teamKey: 'away',
    };
  }
  return {
    battingTeam: state.homeTeam,
    pitchingTeam: state.awayTeam,
    battingOrder: state.homeBattingOrder,
    batterIndex: state.homeBatterIndex,
    teamKey: 'home',
  };
};

// Update the state with new batter index for the appropriate team
const setBatterIndex = (state, teamKey, index) => {
  if (teamKey === 'away') {
    return { ...state, awayBatterIndex: index };
  }
  return { ...state, homeBatterIndex: index };
};

// End the current half-inning, switch half or increment inning
export const endInning = (state) => {
  const isTop = state.half === 'top';
  const newHalf = isTop ? 'bottom' : 'top';
  const newInning = isTop ? state.currentInning : state.currentInning + 1;
  return {
    ...state,
    currentInning: newInning,
    half: newHalf,
    bases: [false, false, false],
    outs: 0,
    balls: 0,
    strikes: 0,
    // Reset batting index for the team that will bat next
    homeBatterIndex: newHalf === 'bottom' ? 0 : state.homeBatterIndex,
    awayBatterIndex: newHalf === 'top' ? 0 : state.awayBatterIndex,
  };
};

// Helper: build field position map from a convent
// Returns object mapping position code (PIT, CAT, etc.) to player object
const buildField = (convent) => {
  const fieldMap = {};
  Object.entries(convent.field).forEach(([pos, playerId]) => {
    const player = convent.team.find(p => p.id === playerId);
    if (player) fieldMap[pos] = player;
  });
  return fieldMap;
};

// Create a new match state from two convents and optional config
export const createMatch = (homeConvent, awayConvent, config = {}) => {
  const innings = config.innings || matchConfig.innings;
  const awayBattingOrder = awayConvent.battingOrder.map(id =>
    awayConvent.team.find(p => p.id === id)
  ).filter(Boolean);
  const homeBattingOrder = homeConvent.battingOrder.map(id =>
    homeConvent.team.find(p => p.id === id)
  ).filter(Boolean);

  // Build field maps (position → player)
  const homeField = buildField(homeConvent);
  const awayField = buildField(awayConvent);

  // Extract convent IDs
  const homeConventId = homeConvent.id ?? null;
  const awayConventId = awayConvent.id ?? null;

  const emptyInningArray = Array(innings).fill(0);

  return {
    homeConvent: homeConvent,
    awayConvent: awayConvent,
    homeConventId,
    awayConventId,
    homeTeam: homeConvent.team,
    awayTeam: awayConvent.team,
    homeBattingOrder,
    awayBattingOrder,
    homeField,
    awayField,
    currentInning: 1,
    half: 'top',
    score: { home: 0, away: 0 },
    inningScores: {
      home: [...emptyInningArray],
      away: [...emptyInningArray],
    },
    hits: { home: 0, away: 0 },
    errors: { home: 0, away: 0 },
    bases: [false, false, false],
    outs: 0,
    events: [],
    awayBatterIndex: 0,
    homeBatterIndex: 0,
    balls: 0,
    strikes: 0,
    config: { innings },
    pendingActions: { pitcher: null, catcher: null, batter: null },
    catcherRollResult: null,
    pitcherRollResult: null,
    batterRollResult: null,
  };
};

// Execute one at-bat (pitch) and return the updated state
// Uses pendingActions and pre-rolled dice results from state
export const executeAtBat = (state) => {
  const { battingOrder, batterIndex, teamKey } = getTeams(state);
  const batter = battingOrder[batterIndex];

  // Pitcher comes from the field map of the pitching team
  const pitchingFieldKey = teamKey === 'away' ? 'homeField' : 'awayField';
  const pitcher = state[pitchingFieldKey]?.PIT;

  if (!batter || !pitcher) {
    console.error('Missing batter or pitcher – cannot execute at-bat');
    return state;
  }

  // Retrieve selected action IDs from pendingActions (fallback to random if missing)
  const { pendingActions } = state;
  const pitcherActionId = pendingActions?.pitcher || actions.Pitcher[Math.floor(Math.random() * actions.Pitcher.length)].id;
  const batterActionId = pendingActions?.batter || actions.Batter[Math.floor(Math.random() * actions.Batter.length)].id;

  // Look up action objects
  const pitcherAction = actions.Pitcher.find(a => a.id === pitcherActionId) || actions.Pitcher[0];
  const batterAction = actions.Batter.find(a => a.id === batterActionId) || actions.Batter[0];

  // Get roll results from state (must exist; fallback to random if somehow missing)
  let pitcherTotal = state.pitcherRollResult?.total;
  let batterTotal = state.batterRollResult?.total;

  if (pitcherTotal === undefined) {
    const pr = getActionTotal(pitcher, pitcherAction);
    pitcherTotal = pr.total;
  }
  if (batterTotal === undefined) {
    const br = getActionTotal(batter, batterAction);
    batterTotal = br.total;
  }

  // Catcher roll result is stored but not used in outcome calculation yet
  // (catcherRollResult preserved in state for future mechanics)

  // Calculate outcome from difference
  const diff = batterTotal - pitcherTotal;
  const outcome = getOutcome(diff);

  let newBases = [...state.bases];
  let newOuts = state.outs;
  let runsScored = 0;
  let description = '';
  let newBalls = state.balls || 0;
  let newStrikes = state.strikes || 0;

  switch (outcome) {
    case 'ball': {
      newBalls += 1;
      if (newBalls >= 3) {
        const adv = advanceRunners(state.bases, 1);
        runsScored = adv.runs;
        newBases = adv.newBases;
        newBases[0] = true;
        description = `${batter.name} walks!`;
        newBalls = 0;
        newStrikes = 0;
      } else {
        description = `Ball ${newBalls}`;
      }
      break;
    }
    case 'strike': {
      newStrikes += 1;
      if (newStrikes >= 3) {
        description = `${batter.name} strikes out!`;
        newOuts = state.outs + 1;
        newBalls = 0;
        newStrikes = 0;
      } else {
        description = `Strike ${newStrikes}`;
      }
      break;
    }
    case 'home_run': {
      runsScored = state.bases.reduce((acc, occupied) => acc + (occupied ? 1 : 0), 0) + 1;
      newBases = [false, false, false];
      description = `${batter.name} hits a HOME RUN! ${runsScored} run${runsScored !== 1 ? 's' : ''} scored.`;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'triple': {
      const adv = advanceRunners(state.bases, 3);
      runsScored = adv.runs;
      newBases = adv.newBases;
      newBases[2] = true;
      description = `${batter.name} hits a TRIPLE! ${runsScored} run${runsScored !== 1 ? 's' : ''} scored.`;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'double': {
      const adv = advanceRunners(state.bases, 2);
      runsScored = adv.runs;
      newBases = adv.newBases;
      newBases[1] = true;
      description = `${batter.name} hits a DOUBLE! ${runsScored} run${runsScored !== 1 ? 's' : ''} scored.`;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'single': {
      const adv = advanceRunners(state.bases, 1);
      runsScored = adv.runs;
      newBases = adv.newBases;
      newBases[0] = true;
      description = `${batter.name} hits a SINGLE! ${runsScored} run${runsScored !== 1 ? 's' : ''} scored.`;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'ground_out': {
      description = `${batter.name} hits a ground out.`;
      newOuts = state.outs + 1;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'fly_out': {
      description = `${batter.name} hits a fly out.`;
      newOuts = state.outs + 1;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'strikeout': {
      description = `${batter.name} strikes out!`;
      newOuts = state.outs + 1;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    default: {
      description = `${batter.name} is out.`;
      newOuts = state.outs + 1;
      newBalls = 0;
      newStrikes = 0;
    }
  }

  const newScore = { ...state.score };
  if (teamKey === 'away') {
    newScore.away += runsScored;
  } else {
    newScore.home += runsScored;
  }

  const newHits = { ...state.hits };
  if (['single', 'double', 'triple', 'home_run'].includes(outcome)) {
    if (teamKey === 'away') {
      newHits.away += 1;
    } else {
      newHits.home += 1;
    }
  }

  const inningIndex = state.currentInning - 1;
  const newInningScores = {
    home: [...state.inningScores.home],
    away: [...state.inningScores.away],
  };
  if (teamKey === 'away') {
    newInningScores.away[inningIndex] += runsScored;
  } else {
    newInningScores.home[inningIndex] += runsScored;
  }

  const newEvent = {
    inning: state.currentInning,
    half: state.half,
    description,
    runsScored,
    batterId: batter.id,
    pitcherId: pitcher.id,
    batterRoll: batterTotal,
    pitcherRoll: pitcherTotal,
    outcome,
    // Include action info for debugging
    pitcherAction: pitcherAction.id,
    batterAction: batterAction.id,
  };

  const newEvents = [...state.events, newEvent];

  const nextBatterIndex = (batterIndex + 1) % battingOrder.length;
  const newState = setBatterIndex(state, teamKey, nextBatterIndex);

  newState.score = newScore;
  newState.bases = newBases;
  newState.outs = newOuts;
  newState.events = newEvents;
  newState.hits = newHits;
  newState.inningScores = newInningScores;
  newState.balls = newBalls;
  newState.strikes = newStrikes;
  newState.errors = state.errors || { home: 0, away: 0 };

  if (newOuts >= 3) {
    return clearTurnState(endInning(newState));
  }

  return clearTurnState(newState);
};

// Check if the match is over (all configured innings completed)
export const isGameOver = (state) => {
  return state.currentInning > state.config.innings;
};

// Determine the winner once the game is over
export const getWinner = (state) => {
  if (!isGameOver(state)) return null;
  if (state.score.home > state.score.away) return 'home';
  if (state.score.away > state.score.home) return 'away';
  return 'tie';
};

// Get current batter for UI
export const getCurrentBatter = (state) => {
  const { battingOrder, batterIndex } = getTeams(state);
  return battingOrder[batterIndex];
};

// Get current pitcher for UI
export const getCurrentPitcher = (state) => {
  return state.half === 'top' ? state.homeField.PIT : state.awayField.PIT;
};

// Get current catcher for UI
export const getCurrentCatcher = (state) => {
  return state.half === 'top' ? state.homeField.CAT : state.awayField.CAT;
};
