
// Función para generar un atributo aleatorio basado en dados d4-d12
const randonDie = () => {
  // Elegir aleatoriamente un dado entre d4 y d12
  const diceTypes = [4, 6, 8, 10, 12];
  const randomIndex = Math.floor(Math.random() * diceTypes.length);
  return diceTypes[randomIndex];
};

// Función para crear un jugador con atributos aleatorios
const createPlayer = (id, role, isReserve = false) => {
  return {
    id,
    name: `${role} ${id}${isReserve ? ' (Reserva)' : ''}`,
    role,
    isReserve,
    attributes: {
      Cuerpo: randonDie(),
      Mente: randonDie(),
      Corazón: randonDie(),
      Emanación: randonDie(),
      Percepción: randonDie(),
      Esencia: randonDie(),
      Astucia: randonDie(),
      Potencia: randonDie(),
      Fortaleza: randonDie()
    }
  };
};

export const createRandomTeam = (convent_id) => {
  const players = [];
  let playerId = 1;
  
  // 1 Lanzador
  players.push(createPlayer(playerId++, convent_id, 'Lanzador'));
  
  // 5 Bateadores
  for (let i = 0; i < 5; i++) {
    players.push(createPlayer(playerId++, convent_id, 'Bateador'));
  }
  
  // 1 Receptor
  players.push(createPlayer(playerId++, convent_id, 'Receptor'));
  
  // 2 Guardias de Base
  for (let i = 0; i < 2; i++) {
    players.push(createPlayer(playerId++, convent_id, 'Guardia de Base'));
  }
  
  // 1 Jardinero
  players.push(createPlayer(playerId++, convent_id, 'Jardinero'));
  
  // 5 Reservas
  for (let i = 0; i < 5; i++) {
    players.push(createPlayer(playerId++, convent_id, 'Reserva', true));
  }
  
  return players;
};

// Función para obtener la clase CSS basada en el rol
export const getRoleColorClass = (role) => {
  switch (role) {
    case 'Lanzador': return 'role-lanzador';
    case 'Bateador': return 'role-bateador';
    case 'Receptor': return 'role-receptor';
    case 'Guardia de Base': return 'role-guardia-base';
    case 'Jardinero': return 'role-jardinero';
    case 'Reserva': return 'role-reserva';
    default: return 'role-reserva';
  }
};
