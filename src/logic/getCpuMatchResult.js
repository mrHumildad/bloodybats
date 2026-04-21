// Generate a random plausible score for CPU vs CPU matches
// Based on team power stats with some randomness
export const getCpuMatchResult = (homeConvent, awayConvent) => {
  const homePower = homeConvent.team?.reduce((sum, p) => sum + (p.attributes?.power || 5), 0) || 50;
  const awayPower = awayConvent.team?.reduce((sum, p) => sum + (p.attributes?.power || 5), 0) || 50;

  const homeBase = Math.floor(homePower / 10);
  const awayBase = Math.floor(awayPower / 10);

  const homeRuns = Math.max(0, Math.floor(Math.random() * 8) + homeBase - 2);
  const awayRuns = Math.max(0, Math.floor(Math.random() * 8) + awayBase - 2);

  // Rough estimate: hits ~ runs * (1.2 - 1.7)
  const homeHits = Math.max(0, Math.floor(homeRuns * (1.2 + Math.random() * 0.5)));
  const awayHits = Math.max(0, Math.floor(awayRuns * (1.2 + Math.random() * 0.5)));

  // Errors: 0-3 typical
  const homeErrors = Math.floor(Math.random() * 4);
  const awayErrors = Math.floor(Math.random() * 4);

  return { homeScore: homeRuns, awayScore: awayRuns, homeHits, awayHits, homeErrors, awayErrors };
};
