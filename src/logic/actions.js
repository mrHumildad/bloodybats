export const actions = {
    "Pitcher": [
        {
          "id": "sentence",
          "name": "Sentence",
          "combo": ["Body", "Power"],
          "phase": "pitch",
          "type": "direct_force",
          "effect": "high_speed_pitch_increases_difficulty"
        },
        {
          "id": "parable",
          "name": "Parable",
          "combo": ["Mind", "Power"],
          "phase": "pitch",
          "type": "precision_control",
          "effect": "disrupt_batter_timing"
        },
        {
          "id": "dogma_pitcher",
          "name": "Dogma",
          "combo": ["Mind", "Fortitude"],
          "phase": "pitch",
          "type": "stabilization",
          "effect": "reduces_extreme_outcomes"
        },
        {
          "id": "break",
          "name": "Break",
          "combo": ["Body", "Cunning"],
          "phase": "pitch",
          "type": "deception",
          "effect": "distorts_batter_reading"
        },
        {
          "id": "revelation_pitcher",
          "name": "Revelation",
          "combo": ["Mind", "Cunning"],
          "phase": "pitch",
          "type": "analysis",
          "effect": "reads_batter_intent"
        },
        {
          "id": "presence",
          "name": "Presence",
          "combo": ["Body", "Fortitude"],
          "phase": "pitch",
          "type": "pressure",
          "effect": "reduces_batter_performance"
        }
      ]
      ,

    "Batter":  [
        {
          "id": "impact",
          "name": "Impact",
          "combo": ["Body", "Power"],
          "phase": "bat",
          "type": "explosive_swing",
          "effect": "high_reward_high_risk_hit"
        },
        {
          "id": "anticipation",
          "name": "Anticipation",
          "combo": ["Mind", "Power"],
          "phase": "bat",
          "type": "aggressive_read",
          "effect": "breaks_pitch_timing"
        },
        {
          "id": "evasion",
          "name": "Evasion",
          "combo": ["Body", "Cunning"],
          "phase": "bat",
          "type": "technical_movement",
          "effect": "reduces_failure_risk"
        },
        {
          "id": "reading",
          "name": "Reading",
          "combo": ["Mind", "Cunning"],
          "phase": "bat",
          "type": "analysis",
          "effect": "improves_decision_quality"
        },
        {
          "id": "endurance",
          "name": "Endurance",
          "combo": ["Body", "Fortitude"],
          "phase": "bat",
          "type": "resistance",
          "effect": "prevents_weak_outcomes"
        },
        {
          "id": "discipline_batter",
          "name": "Discipline",
          "combo": ["Mind", "Fortitude"],
          "phase": "bat",
          "type": "stability",
          "effect": "resists_deception"
        }
      ]
    ,
      ///catcher action to be integrated in effective gameplay later.
    "Catcher":  [
        {
          "id": "excommunication",
          "name": "Excommunication",
          "combo": ["Body", "Power"],
          "phase": "system",
          "type": "physical_enforcement",
          "effect": "disrupt_opponent_rhythm"
        },
        {
          "id": "vigil",
          "name": "Vigil",
          "combo": ["Body", "Fortitude"],
          "phase": "system",
          "type": "protection",
          "effect": "reduces_explosive_hits"
        },
        {
          "id": "hidden_rite",
          "name": "Hidden Rite",
          "combo": ["Body", "Cunning"],
          "phase": "system",
          "type": "deception",
          "effect": "confuses_batter"
        },
        {
          "id": "dogma_catcher",
          "name": "Dogma",
          "combo": ["Mind", "Power"],
          "phase": "system",
          "type": "rule_enforcement",
          "effect": "changes_turn_conditions"
        },
        {
          "id": "confession",
          "name": "Confession",
          "combo": ["Mind", "Cunning"],
          "phase": "system",
          "type": "revelation",
          "effect": "reveals_opponent_intent"
        },
        {
          "id": "absolution",
          "name": "Absolution",
          "combo": ["Mind", "Fortitude"],
          "phase": "system",
          "type": "negation",
          "effect": "cancels_negative_effects"
        }
      ]
    ,

    "Defense":  [
        {
          "id": "impact_defense",
          "name": "Impact",
          "combo": ["Body", "Power"],
          "phase": "field",
          "type": "interception",
          "effect": "stops_advancement"
        },
        {
          "id": "evasion_defense",
          "name": "Evasion",
          "combo": ["Body", "Cunning"],
          "phase": "field",
          "type": "positioning",
          "effect": "improves_coverage"
        },
        {
          "id": "endurance_defense",
          "name": "Endurance",
          "combo": ["Body", "Fortitude"],
          "phase": "field",
          "type": "collision_resistance",
          "effect": "prevents_breakthrough"
        },
        {
          "id": "reading_defense",
          "name": "Reading",
          "combo": ["Mind", "Cunning"],
          "phase": "field",
          "type": "prediction",
          "effect": "improves_positioning"
        },
        {
          "id": "anticipation_defense",
          "name": "Anticipation",
          "combo": ["Mind", "Power"],
          "phase": "field",
          "type": "interception_timing",
          "effect": "cuts_off_momentum"
        },
        {
          "id": "discipline_defense",
          "name": "Discipline",
          "combo": ["Mind", "Fortitude"],
          "phase": "field",
          "type": "structure",
          "effect": "prevents_defensive_collapse"
        }
      ]
    }

