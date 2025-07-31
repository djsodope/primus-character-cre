import { Role, Archetype, Skill } from './types';

export const ROLES: Role[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Masters of combat and physical prowess, warriors excel in melee combat and protecting allies.',
    primaryStats: ['strength', 'constitution'],
    recommendedSkills: ['combat-mastery', 'shield-wall', 'intimidation']
  },
  {
    id: 'scout',
    name: 'Scout', 
    description: 'Agile and perceptive, scouts specialize in reconnaissance, ranged combat, and survival.',
    primaryStats: ['dexterity', 'wisdom'],
    recommendedSkills: ['archery', 'stealth', 'tracking']
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Students of arcane knowledge, scholars wield magic and possess vast intellectual abilities.',
    primaryStats: ['intelligence', 'wisdom'],
    recommendedSkills: ['arcane-lore', 'ritual-magic', 'investigation']
  },
  {
    id: 'mystic',
    name: 'Mystic',
    description: 'Connected to divine or natural forces, mystics heal allies and commune with otherworldly powers.',
    primaryStats: ['wisdom', 'charisma'],
    recommendedSkills: ['divine-channeling', 'healing', 'nature-bond']
  }
];

export const ARCHETYPES: Archetype[] = [
  // Warrior Archetypes
  {
    id: 'guardian',
    name: 'Guardian',
    description: 'A defensive specialist focused on protecting allies.',
    roleId: 'warrior',
    bonuses: { constitution: 2, strength: 1 }
  },
  {
    id: 'berserker',
    name: 'Berserker', 
    description: 'A fierce combatant who channels rage into devastating attacks.',
    roleId: 'warrior',
    bonuses: { strength: 2, constitution: 1 }
  },
  
  // Scout Archetypes
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'A wilderness expert skilled in tracking and survival.',
    roleId: 'scout',
    bonuses: { wisdom: 2, dexterity: 1 }
  },
  {
    id: 'assassin',
    name: 'Assassin',
    description: 'A deadly infiltrator who strikes from the shadows.',
    roleId: 'scout', 
    bonuses: { dexterity: 2, intelligence: 1 }
  },
  
  // Scholar Archetypes
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'A master of arcane magic through study and preparation.',
    roleId: 'scholar',
    bonuses: { intelligence: 2, wisdom: 1 }
  },
  {
    id: 'artificer',
    name: 'Artificer',
    description: 'A magical inventor who crafts wondrous items and constructs.',
    roleId: 'scholar',
    bonuses: { intelligence: 2, dexterity: 1 }
  },
  
  // Mystic Archetypes
  {
    id: 'cleric',
    name: 'Cleric',
    description: 'A divine servant who channels the power of their deity.',
    roleId: 'mystic',
    bonuses: { wisdom: 2, charisma: 1 }
  },
  {
    id: 'druid',
    name: 'Druid',
    description: 'A guardian of nature who can shapeshift and command the elements.',
    roleId: 'mystic',
    bonuses: { wisdom: 2, constitution: 1 }
  }
];

export const SKILLS: Skill[] = [
  // Tier 1 Skills - Basic abilities
  {
    id: 'combat-mastery',
    name: 'Combat Mastery',
    tier: 1,
    description: 'Proficiency with weapons and basic combat techniques.',
    roles: ['warrior']
  },
  {
    id: 'archery',
    name: 'Archery',
    tier: 1,
    description: 'Skill with bows and ranged weapons.',
    roles: ['scout']
  },
  {
    id: 'arcane-lore',
    name: 'Arcane Lore',
    tier: 1,
    description: 'Knowledge of magical theory and spell identification.',
    roles: ['scholar']
  },
  {
    id: 'healing',
    name: 'Healing',
    tier: 1,
    description: 'Ability to restore health and treat injuries.',
    roles: ['mystic']
  },
  {
    id: 'stealth',
    name: 'Stealth',
    tier: 1,
    description: 'Moving unseen and unheard.',
    roles: ['scout', 'warrior']
  },
  {
    id: 'investigation',
    name: 'Investigation',
    tier: 1,
    description: 'Gathering clues and solving mysteries.',
    roles: ['scholar', 'scout']
  },
  
  // Tier 2 Skills - Advanced abilities
  {
    id: 'shield-wall',
    name: 'Shield Wall',
    tier: 2,
    description: 'Advanced defensive formations and protection techniques.',
    roles: ['warrior']
  },
  {
    id: 'tracking',
    name: 'Tracking',
    tier: 2,
    description: 'Following trails and hunting quarry through any terrain.',
    roles: ['scout']
  },
  {
    id: 'ritual-magic',
    name: 'Ritual Magic',
    tier: 2,
    description: 'Casting powerful spells through extended ceremonies.',
    roles: ['scholar', 'mystic']
  },
  {
    id: 'divine-channeling',
    name: 'Divine Channeling',
    tier: 2,
    description: 'Manifesting divine power for healing or harm.',
    roles: ['mystic']
  },
  {
    id: 'intimidation',
    name: 'Intimidation',
    tier: 2,
    description: 'Using presence and threats to influence others.',
    roles: ['warrior']
  },
  {
    id: 'nature-bond',
    name: 'Nature Bond',
    tier: 2,
    description: 'Deep connection with natural forces and creatures.',
    roles: ['mystic', 'scout']
  },
  
  // Tier 3 Skills - Master-level abilities
  {
    id: 'weapon-mastery',
    name: 'Weapon Mastery',
    tier: 3,
    description: 'Legendary skill with weapons, unlocking devastating techniques.',
    roles: ['warrior']
  },
  {
    id: 'shadow-step',
    name: 'Shadow Step',
    tier: 3,
    description: 'Teleporting through shadows and becoming one with darkness.',
    roles: ['scout']
  },
  {
    id: 'archmage-power',
    name: 'Archmage Power',
    tier: 3,
    description: 'Access to reality-altering magic and forbidden knowledge.',
    roles: ['scholar']
  },
  {
    id: 'divine-avatar',
    name: 'Divine Avatar',
    tier: 3,
    description: 'Becoming a vessel for divine power and transcendent abilities.',
    roles: ['mystic']
  }
];