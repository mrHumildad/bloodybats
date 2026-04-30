export const translations = {
  en: {
    // Main Menu
    appTitle: 'Bloody Bats',
    newGame: 'New Game',
    loadGame: 'Load Game',
    options: 'Options',

    // Convent Selector
    chooseConvent: 'Choose Your Convent',
    startGame: 'Start Game',

    // Game Screen
    back: 'Back',

      // Tabs
      overview: 'Overview',
      team: 'Team',
      match: 'Match',
      fixtures: 'Fixtures',
      leaderboard: 'Leaderboard',
      lineup: 'Lineup',

     // General
     week: 'Week',
     results: 'Results',

     // Fixtures Tab
     round: 'Round',

    // Leaderboard Tab
    pos: 'Pos',
    gp: 'GP',
    wins: 'W',
    losses: 'L',
    runs: 'Runs',
    hits: 'Hits',
    errors: 'Errors',
    runDiff: 'RDiff',
    winPct: 'PCT',
    noStats: 'No matches played yet',

    // Overview Tab
    statFocus: 'Stat Focus',
    dataFlow: 'Data Flow',
    nature: 'Nature',
    specialTrait: 'Special Trait',
    arenaRule: 'Arena Rule',
    hooliganDie: 'Hooligan Die',
    fanaticism: 'Fanaticism',
    wineStats: 'Wine Stats',
    label: 'Label',
    quantity: 'Quantity',
    quality: 'Quality',
    liters: 'liters',

    // Team Tab
    name: 'Name',
    role: 'Role',
    number: 'No.',
    position: 'Pos',
    age: 'Age',
    stars: 'Stars',
    noTeamData: 'No team data available',

     // Lineup Tab
     reserves: 'Reserves',
     backups: 'Backups',
     firstSelected: 'First Selected',
     secondSelected: 'Second Selected',
     swap: 'SWAP',

    // Player Info
    noPlayerSelected: 'No player selected',

    // Attribute Names (English)
    cuerpo: 'Body',
    mente: 'Mind',
    corazon: 'Heart',

    astucia: 'Cunning',
    potencia: 'Power',
    fortaleza: 'Fortitude',

    // Roles (English)
    lanzador: 'Pitcher',
    bateador: 'Batter',
    receptor: 'Catcher',
    guardiaDeBase: 'Base Guard',
    jardinero: 'Fielder',
    reserva: 'Reserve',

     // Match Tab
     seasonComplete: 'Season Complete',
     allFixturesPlayed: 'All fixtures have been played. The season is over.',
     none: 'None',
     inning: 'Inning',
     gameOver: 'Game Over',
     tie: 'Draw (Tie)',
     homeTeam: 'HOME',
     awayTeam: 'AWAY',
     viewResults: 'View Results',
     weekResults: 'Week Results',

     // NextWeek Tab
     homeWins: 'HOME WINS',
     awayWins: 'AWAY WINS',
     continue: 'Continue',
     noResults: 'No results available',

    // Header
    selectConvent: 'Select a convent to view overview.'
  },
  es: {
    // Main Menu
    appTitle: 'Bloody Bats',
    newGame: 'Nueva Partida',
    loadGame: 'Cargar Partida',
    options: 'Opciones',

    // Convent Selector
    chooseConvent: 'Elige Tu Convento',
    startGame: 'Iniciar Partida',

    // Game Screen
    back: 'Atrás',

      // Tabs
      overview: 'Visión General',
      team: 'Equipo',
      match: 'Partido',
      fixtures: 'Calendario',
      leaderboard: 'Clasificación',
      lineup: 'Alineación',

     // General
     week: 'Semana',
     results: 'Resultados',

     // Fixtures Tab
     round: 'Jornada',

     // Leaderboard Tab
    pos: 'Pos',
    gp: 'JJ',
    wins: 'V',
    losses: 'D',
    runs: 'Carreras',
    hits: 'Hits',
    errors: 'Errores',
    runDiff: 'Diff',
    winPct: 'PCT',
    noStats: 'Sin partidos jugados',

    // Overview Tab
    statFocus: 'Enfoque de Estadística',
    dataFlow: 'Flujo de Datos',
    nature: 'Naturaleza',
    specialTrait: 'Rasgo Especial',
    arenaRule: 'Regla de Arena',
    hooliganDie: 'Dado de Hooligan',
    fanaticism: 'Fanatismo',
    wineStats: 'Estadísticas de Vino',
    label: 'Etiqueta',
    quantity: 'Cantidad',
    quality: 'Calidad',
    liters: 'litros',

     // Team Tab
     name: 'Nombre',
     role: 'Posición',
     number: 'No.',
     position: 'Pos',
     age: 'Edad',
     stars: 'Estrellas',
     noTeamData: 'No hay datos de equipo disponibles',

      // Lineup Tab
      reserves: 'Reservas',
      backups: 'Suplentes',
      firstSelected: 'Primer Selección',
      secondSelected: 'Segunda Selección',
      swap: 'INTERCAMBIAR',

    // Player Info
    noPlayerSelected: 'No hay jugador seleccionado',

    // Attribute Names (Spanish)
    cuerpo: 'Cuerpo',
    mente: 'Mente',
    corazon: 'Corazón',
    emanacion: 'Emanación',
    percepcion: 'Percepción',
    esencia: 'Esencia',
    astucia: 'Astucia',
    potencia: 'Potencia',
    fortaleza: 'Fortaleza',

    // Roles (Spanish)
    lanzador: 'Lanzador',
    bateador: 'Bateador',
    receptor: 'Receptor',
    guardiaDeBase: 'Guardia de Base',
    jardinero: 'Jardinero',
    reserva: 'Reserva',

      // Match Tab
      seasonComplete: 'Temporada Completa',
      allFixturesPlayed: 'Se han jugado todos los partidos. La temporada ha terminado.',
      none: 'Ninguno',
      inning: 'Entrada',
       gameOver: 'Fin del Juego',
       tie: 'Empate',
       homeTeam: 'LOCAL',
       awayTeam: 'VISITANTE',
       viewResults: 'Ver Resultados',
       weekResults: 'Resultados de la Semana',
       homeWins: 'GANAN LOCALES',
       awayWins: 'GANAN VISITANTES',
       continue: 'Continuar',
       noResults: 'No hay resultados disponibles',

     // Header
     selectConvent: 'Selecciona un convento para ver la vista general.'
  }
};

// Dynamic translations for roles and attributes based on current language
export const roleTranslations = {
  en: {
    pitcher: 'Pitcher',
    batter: 'Batter',
    catcher: 'Catcher',
    baseGuard: 'Base Guard',
    fielder: 'Fielder',
    reserve: 'Reserve',
    backup: 'Backup',
    dh: 'DH'
  },
  es: {
    pitcher: 'Lanzador',
    batter: 'Bateador',
    catcher: 'Receptor',
    baseGuard: 'Guardia de Base',
    fielder: 'Jardinero',
    reserve: 'Reserva',
    backup: 'Suplente',
    dh: 'BD'
  }
};

export const attributeTranslations = {
  en: {
    body: 'Body',
    mind: 'Mind',
    heart: 'Heart',

    cunning: 'Cunning',
    power: 'Power',
    fortitude: 'Fortitude'
  },
  es: {
    body: 'Cuerpo',
    mind: 'Mente',
    heart: 'Corazón',

    cunning: 'Astucia',
    power: 'Potencia',
    fortitude: 'Fortaleza'
  }
};

// English translations for convent-specific content (original data is in Spanish)
const conventTranslations = {
  en: {
    1: {
      name: "Order of Traumatic Impact",
      description: "They believe the rival's skull is the only worthy vessel for the sacred ball. Their masses end in concussions.",
      special_trait: "Sacred Fracture",
      arena_rule: "Tooth Rain: Critical hits launch bone projectiles into the stands.",
      wine_stats: {
        label: "Bone Marrow Liquor 'The Crusher'",
        quality: "Taste of iron and remorse"
      }
    },
    2: {
      name: "Synod of the Drunken Parable",
      description: "They calculate trajectories through visions produced by alcohol distilled in old bats. If you see three balls, hit the middle one.",
      special_trait: "Divine Liver",
      arena_rule: "Blurry Vision: Rival pitchers have mental blanks (miss chances).",
      wine_stats: {
        label: "Sparkling Wine 'Triple Vision'",
        quality: "Blinds the weak"
      }
    },
    3: {
      name: "Bunker of the Perpetual Home",
      description: "Defense fanatics who have sewn the glove to their hand. They consider letting someone through a capital sin.",
      special_trait: "Flesh Anchor",
      arena_rule: "Barbed Wire: Sliding into base requires an amputation test.",
      wine_stats: {
        label: "Trench Grog 'Immovable'",
        quality: "Tastes like old boot and victory"
      }
    },
    4: {
      name: "Daughters of the Muted Sewing",
      description: "Nuns who sew their lips shut not to distract the Goddess. Their stadium is so silent you can hear the batter's bones creak.",
      special_trait: "Leather Whisper",
      arena_rule: "Silence of the Grave: Cheers cause stress damage.",
      wine_stats: {
        label: "Mass Wine 'Tied Tongue'",
        quality: "Smooth as a funeral"
      }
    },
    5: {
      name: "Guild of Carbon and Splinters",
      description: "They extract wood from trees watered with loser's urine. Their bats burn on contact with air.",
      special_trait: "Spontaneous Combustion",
      arena_rule: "Infernal Boiler: The ball heats up each entry; second-degree burns when catching.",
      wine_stats: {
        label: "Moonshine 'Sacred Ash'",
        quality: "Flammable"
      }
    },
    6: {
      name: "Conclave of the Alcoholic Flight",
      description: "They believe the sky is the Goddess's stadium. If the ball doesn't leave the stadium, you don't have enough faith (or vodka).",
      special_trait: "Ethyl Levitation",
      arena_rule: "Dizziness: Outfielders have a 20% chance to vomit when looking up.",
      wine_stats: {
        label: "Champagne 'White Cloud'",
        quality: "Bubbles of pure ego"
      }
    },
    7: {
      name: "Circle of Spoils and Rage",
      description: "They live in the sewers of the main stadium. They play with bats made of femurs and balls wrapped in rat skin.",
      special_trait: "Sewer Thirst",
      arena_rule: "Infection: Any wound permanently reduces stats.",
      wine_stats: {
        label: "Waste Ferment 'Rage'",
        quality: "Probably illegal"
      }
    },
    8: {
      name: "Ministry of Ivory and Gold",
      description: "The nobility of diamond. Their bats are works of art and their balls are made from the leather of the best dead players.",
      special_trait: "Imperial Contempt",
      arena_rule: "Divine Bribery: You can reroll a roll if you sacrifice a liter of wine.",
      wine_stats: {
        label: "Elixir 'Goddess Tear'",
        quality: "Liquid gold"
      }
    }
  }
};

// Helper to get translated convent field based on language
export const getConventField = (convent, field, language = 'en') => {
  if (language === 'en') {
    const trans = conventTranslations.en[convent.id];
    if (trans && field.includes('.')) {
      const keys = field.split('.');
      return keys.reduce((obj, key) => obj?.[key], trans);
    } else if (trans && trans[field] !== undefined) {
      return trans[field];
    }
  }
  // Fallback to original convent field (Spanish)
  const keys = field.split('.');
  return keys.reduce((obj, key) => obj && obj[key], convent);
};

export const getTranslation = (key, language = 'en') => {
  return translations[language][key] || key;
};

export const translateRole = (role, language = 'en') => {
  return roleTranslations[language][role] || role;
};

export const translateAttribute = (attribute, language = 'en') => {
  return attributeTranslations[language][attribute] || attribute;
};
