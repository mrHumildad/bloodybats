/**
 * Returns a fresh stats object with all zeros.
 * Used when initializing a new convent/season.
 */
export const getDefaultStats = () => ({
  gp: 0,          // Games Played
  w: 0,           // Wins
  l: 0,           // Losses
  runs_scored: 0, // Total runs scored
  runs_allowed: 0,// Total runs allowed
  hits: 0,        // Total hits
  errors: 0       // Total errors
});

/**
 * Calculates updated stats for both teams after a completed match.
 *
 * @param {Object} homeStats - Current stats for home convent
 * @param {Object} awayStats - Current stats for away convent
 * @param {number} homeScore - Final home team runs
 * @param {number} awayScore - Final away team runs
 * @param {number} homeHits - Total hits by home team
 * @param {number} awayHits - Total hits by away team
 * @param {number} homeErrors - Total errors by home team
 * @param {number} awayErrors - Total errors by away team
 * @returns {Object} { home: updatedHomeStats, away: updatedAwayStats }
 */
export const updateStatsFromMatch = (
  homeStats,
  awayStats,
  homeScore,
  awayScore,
  homeHits,
  awayHits,
  homeErrors,
  awayErrors
) => {
  // Both teams play one more game
  const homeGP = homeStats.gp + 1;
  const awayGP = awayStats.gp + 1;

  // Determine winner (ties increment GP only)
  let homeW = homeStats.w;
  let homeL = homeStats.l;
  let awayW = awayStats.w;
  let awayL = awayStats.l;

  if (homeScore > awayScore) {
    homeW++;
  } else if (awayScore > homeScore) {
    awayW++;
  }
  // Tie: no win/loss increment

  // Accumulate runs, hits, errors
  const homeRunsScored = homeStats.runs_scored + homeScore;
  const homeRunsAllowed = homeStats.runs_allowed + awayScore;
  const awayRunsScored = awayStats.runs_scored + awayScore;
  const awayRunsAllowed = awayStats.runs_allowed + homeScore;

  const homeHitsNew = homeStats.hits + homeHits;
  const homeErrorsNew = homeStats.errors + homeErrors;
  const awayHitsNew = awayStats.hits + awayHits;
  const awayErrorsNew = awayStats.errors + awayErrors;

  return {
    home: {
      ...homeStats,
      gp: homeGP,
      w: homeW,
      l: homeL,
      runs_scored: homeRunsScored,
      runs_allowed: homeRunsAllowed,
      hits: homeHitsNew,
      errors: homeErrorsNew
    },
    away: {
      ...awayStats,
      gp: awayGP,
      w: awayW,
      l: awayL,
      runs_scored: awayRunsScored,
      runs_allowed: awayRunsAllowed,
      hits: awayHitsNew,
      errors: awayErrorsNew
    }
  };
};

/**
 * Sorts convents by ranking criteria: primary = wins (desc),
 * secondary = run differential (runs_scored - runs_allowed) (desc),
 * tertiary = runs_scored (desc). Returns new sorted array.
 *
 * @param {Array} convents - Array of convent objects with stats
 * @returns {Array} Sorted convents
 */
export const sortConventsByRank = (convents) => {
  return [...convents].sort((a, b) => {
    const aStats = a.stats || getDefaultStats();
    const bStats = b.stats || getDefaultStats();

    if (bStats.w !== aStats.w) {
      return bStats.w - aStats.w; // more wins first
    }
    const aRunDiff = aStats.runs_scored - aStats.runs_allowed;
    const bRunDiff = bStats.runs_scored - bStats.runs_allowed;
    if (bRunDiff !== aRunDiff) {
      return bRunDiff - aRunDiff; // higher differential first
    }
    return bStats.runs_scored - aStats.runs_scored; // more runs scored first
  });
};

/**
 * Calculates win percentage (W / GP). Returns 0 if GP is 0.
 * @param {Object} stats
 * @returns {number} Win pct as decimal (0-1)
 */
export const calculateWinPct = (stats) => {
  if (!stats || stats.gp === 0) return 0;
  return stats.w / stats.gp;
};
