// Match logic for Bloody Bats
// Core state and functions for managing a baseball match with dice-based player attributes.

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

// Helper: roll a die with given number of sides (1 to sides)
const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

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

// Create a new match state from two teams and optional config
export const createMatch = (homeTeam, awayTeam, config = {}) => {
  const innings = config.innings || matchConfig.innings;
  const awayBattingOrder = awayTeam.filter((p) => p.position.slice(0, 3) === 'BAT');
  const homeBattingOrder = homeTeam.filter((p) => p.position.slice(0, 3) === 'BAT');

  // Extract convent IDs from the first player id (format: "playerId_conventId")
  const homeConventId = Number(homeTeam[0]?.id?.split('_')[1]) || null;
  const awayConventId = Number(awayTeam[0]?.id?.split('_')[1]) || null;

  // Initialize inning scores arrays (1-indexed, so index 0 is inning 1)
  const emptyInningArray = Array(innings).fill(0);

  return {
    homeTeam,
    awayTeam,
    homeConventId,
    awayConventId,
    homeBattingOrder,
    awayBattingOrder,
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
  };
};

// Execute one at-bat (pitch) and return the updated state
export const executeAtBat = (state) => {
  const { pitchingTeam, battingOrder, batterIndex, teamKey } = getTeams(state);
  const batter = battingOrder[batterIndex];
  const pitcher = pitchingTeam.find((p) => p.role === 'pitcher');

  if (!batter || !pitcher) {
    console.error('Missing batter or pitcher – cannot execute at-bat');
    return state;
  }

  // Roll dice: pitcher uses 'power', batter uses 'cunning'
  const pitcherDie = pitcher.attributes.power;
  const batterDie = batter.attributes.cunning;
  const pitcherRoll = rollDie(pitcherDie);
  const batterRoll = rollDie(batterDie);
  const diff = batterRoll - pitcherRoll;
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
        // Ball 4: Walk (counts as single)
        const adv = advanceRunners(state.bases, 1);
        runsScored = adv.runs;
        newBases = adv.newBases;
        newBases[0] = true; // batter on first
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
        // Strike 3: Strikeout
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
      newBases[2] = true; // batter on third
      description = `${batter.name} hits a TRIPLE! ${runsScored} run${runsScored !== 1 ? 's' : ''} scored.`;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'double': {
      const adv = advanceRunners(state.bases, 2);
      runsScored = adv.runs;
      newBases = adv.newBases;
      newBases[1] = true; // batter on second
      description = `${batter.name} hits a DOUBLE! ${runsScored} run${runsScored !== 1 ? 's' : ''} scored.`;
      newBalls = 0;
      newStrikes = 0;
      break;
    }
    case 'single': {
      const adv = advanceRunners(state.bases, 1);
      runsScored = adv.runs;
      newBases = adv.newBases;
      newBases[0] = true; // batter on first
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

  // Update score
  const newScore = { ...state.score };
  if (teamKey === 'away') {
    newScore.away += runsScored;
  } else {
    newScore.home += runsScored;
  }

  // Update hits (on any hit: single, double, triple, home_run)
  const newHits = { ...state.hits };
  if (['single', 'double', 'triple', 'home_run'].includes(outcome)) {
    if (teamKey === 'away') {
      newHits.away += 1;
    } else {
      newHits.home += 1;
    }
  }

  // Update inningScores (record runs scored in current inning)
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

  // Record event
  const newEvent = {
    inning: state.currentInning,
    half: state.half,
    description,
    runsScored,
    batterId: batter.id,
    pitcherId: pitcher.id,
    batterRoll,
    pitcherRoll,
    outcome,
  };

  const newEvents = [...state.events, newEvent];

  // Advance batter index for the current team
  const nextBatterIndex = (batterIndex + 1) % battingOrder.length;
  const newState = setBatterIndex(state, teamKey, nextBatterIndex);

  // Apply other updates
  newState.score = newScore;
  newState.bases = newBases;
  newState.outs = newOuts;
  newState.events = newEvents;
  newState.hits = newHits;
  newState.inningScores = newInningScores;
  newState.balls = newBalls;
  newState.strikes = newStrikes;
  // Errors remain zero for now (no error logic implemented)
  newState.errors = state.errors || { home: 0, away: 0 };

  // If inning ended (3 outs), advance to next inning/half
  if (newOuts >= 3) {
    return endInning(newState);
  }

  return newState;
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
  const { pitchingTeam } = getTeams(state);
  return pitchingTeam.find((p) => p.role === 'pitcher');
};

// Get current catcher for UI
export const getCurrentCatcher = (state) => {
  const { pitchingTeam } = getTeams(state);
  return pitchingTeam.find((p) => p.role === 'catcher');
};
