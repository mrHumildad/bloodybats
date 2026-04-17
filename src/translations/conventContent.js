// English translations for convent-specific content
// Keys correspond to convent IDs
export const conventTranslations = {
  en: {
    1: {
      name: "Order of Traumatic Impact",
      description: "They believe the rival's skull is the only worthy vessel for the sacred ball. Their masses end in concussions.",
      special_trait: "Sacred Fracture",
      arena_rule: "Tooth Rain: Critical hits launch bone projectiles into the stands.",
      wine_label: "Bone Marrow Liquor 'The Crusher'",
      wine_quality: "Taste of iron and remorse"
    },
    2: {
      name: "Synod of the Drunken Parable",
      description: "They calculate trajectories through visions produced by alcohol distilled in old bats. If you see three balls, hit the middle one.",
      special_trait: "Divine Liver",
      arena_rule: "Blurry Vision: Rival pitchers have mental blanks (miss chances).",
      wine_label: "Sparkling Wine 'Triple Vision'",
      wine_quality: "Blinds the weak"
    },
    3: {
      name: "Bunker of the Perpetual Home",
      description: "Defense fanatics who have sewn the glove to their hand. They consider letting someone through a capital sin.",
      special_trait: "Flesh Anchor",
      arena_rule: "Barbed Wire: Sliding into base requires an amputation test.",
      wine_label: "Trench Grog 'Immovable'",
      wine_quality: "Tastes like old boot and victory"
    },
    4: {
      name: "Daughters of the Muted Sewing",
      description: "Nuns who sew their lips shut not to distract the Goddess. Their stadium is so silent you can hear the batter's bones creak.",
      special_trait: "Leather Whisper",
      arena_rule: "Silence of the Grave: Cheers cause stress damage.",
      wine_label: "Mass Wine 'Tied Tongue'",
      wine_quality: "Smooth as a funeral"
    },
    5: {
      name: "Guild of Carbon and Splinters",
      description: "They extract wood from trees watered with loser's urine. Their bats burn on contact with air.",
      special_trait: "Spontaneous Combustion",
      arena_rule: "Infernal Boiler: The ball heats up each entry; second-degree burns when catching.",
      wine_label: "Moonshine 'Sacred Ash'",
      wine_quality: "Flammable"
    },
    6: {
      name: "Conclave of the Alcoholic Flight",
      description: "They believe the sky is the Goddess's stadium. If the ball doesn't leave the stadium, you don't have enough faith (or vodka).",
      special_trait: "Eth Levitation",
      arena_rule: "Dizziness: Outfielders have a 20% chance to vomit when looking up.",
      wine_label: "Champagne 'White Cloud'",
      wine_quality: "Bubbles of pure ego"
    },
    7: {
      name: "Circle of Spoils and Rage",
      description: "They live in the sewers of the main stadium. They play with bats made of femurs and balls wrapped in rat skin.",
      special_trait: "Sewer Thirst",
      arena_rule: "Infection: Any wound permanently reduces stats.",
      wine_label: "Waste Ferment 'Rage'",
      wine_quality: "Probably illegal"
    },
    8: {
      name: "Ministry of Ivory and Gold",
      description: "The nobility of diamond. Their bats are works of art and their balls are made from the leather of the best dead players.",
      special_trait: "Imperial Contempt",
      arena_rule: "Divine Bribery: You can reroll a roll if you sacrifice a liter of wine.",
      wine_label: "Elixir 'Goddess Tear'",
      wine_quality: "Liquid gold"
    }
  }
};

// Helper to get translated convent field based on language
export const getConventField = (convent, field, language = 'en') => {
  if (language === 'en') {
    const translation = conventTranslations.en[convent.id]?.[field];
    if (translation) return translation;
  }
  // Fallback to original convent field (Spanish)
  const keys = field.split('.');
  return keys.reduce((obj, key) => obj && obj[key], convent);
};
