export interface Character {
  id: string;
  name: string;
  level: number;
  role: string;
  archetype: string;
  stats: CharacterStats;
  skills: string[];
  ownerId: string; // Firebase UID of the character owner
  createdAt: string;
  updatedAt: string;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Skill {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  description: string;
  roles?: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  primaryStats: (keyof CharacterStats)[];
  recommendedSkills: string[];
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
  roleId: string;
  bonuses: Partial<CharacterStats>;
}

export const STAT_NAMES: Record<keyof CharacterStats, string> = {
  strength: "Strength",
  dexterity: "Dexterity", 
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma"
};

export const STAT_ABBREVIATIONS: Record<keyof CharacterStats, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON", 
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA"
};