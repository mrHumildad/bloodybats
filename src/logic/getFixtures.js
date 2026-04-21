export function getFixtures(teams) {
  if (teams.length % 2 !== 0) teams.push("BYE");

  const n = teams.length;
  const rounds = n - 1;
  const schedule = [];
  let pool = [...teams];

  for (let r = 0; r < rounds; r++) {
    const roundMatches = [];
    for (let i = 0; i < n / 2; i++) {
      let home = pool[i];
      let away = pool[n - 1 - i];

      // Balancing Logic: Swap roles based on round index
      if (i === 0) {
        // Toggle the fixed team's role every round
        if (r % 2 !== 0) [home, away] = [away, home];
      } else {
        // Alternate others based on match index and round
        if ((i + r) % 2 !== 0) [home, away] = [away, home];
      }

      if (home !== "BYE" && away !== "BYE") {
        roundMatches.push({ home, away });
      }
    }
    schedule.push({ round: r + 1, matches: roundMatches });

    // Standard Round-Robin rotation
    pool.splice(1, 0, pool.pop());
  }
  return schedule;
}