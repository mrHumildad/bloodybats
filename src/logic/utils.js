
// Function to generate a random die size (d4-d12)
const randomDie = () => {
  // Randomly choose a die from d4 to d12
  const dieTypes = [4, 6, 8, 10, 12];
  const randomIndex = Math.floor(Math.random() * dieTypes.length);
  return dieTypes[randomIndex];
};
// Function to create a player with random attributes
const createPlayer = (id, conventId, role, isReserve = false) => {
  return {
    id: `${id}_${conventId}`,
    name: 'placeholder',
    role,
    age: Math.floor(Math.random() * 20) + 18, // Age between 18 and 37
    isReserve,
    attributes: {
      body: randomDie(),
      mind: randomDie(),
      heart: randomDie(),
      emanation: randomDie(),
      perception: randomDie(),
      essence: randomDie(),
      cunning: randomDie(),
      power: randomDie(),
      fortitude: randomDie()
    }
  };
}

export const createRandomTeam = (conventId) => {
  const players = [];
  let playerId = 1;

  // 1 Pitcher
  players.push(createPlayer(playerId++, conventId, 'pitcher'));

  // 5 Batters
  for (let i = 0; i < 5; i++) {
    players.push(createPlayer(playerId++, conventId, 'batter'));
  }

  // 1 Catcher
  players.push(createPlayer(playerId++, conventId, 'catcher'));

  // 2 Base Guards
  for (let i = 0; i < 2; i++) {
    players.push(createPlayer(playerId++, conventId, 'baseGuard'));
  }

  // 1 Fielder
  players.push(createPlayer(playerId++, conventId, 'fielder'));

  // 5 Reserves
  for (let i = 0; i < 5; i++) {
    players.push(createPlayer(playerId++, conventId, 'reserve', true));
  }

  return players;
};

// Function to get CSS class based on role
export const getRoleColorClass = (role) => {
  switch (role) {
    case 'pitcher': return 'role-pitcher';
    case 'batter': return 'role-batter';
    case 'catcher': return 'role-catcher';
    case 'baseGuard': return 'role-base-guard';
    case 'fielder': return 'role-fielder';
    case 'reserve': return 'role-reserve';
    default: return 'role-reserve';
  }
};
