export type CharacterKey = 'TIMMY' | 'ANTOINE' | 'ROBIN' | 'HUGO' | 'MAIKO' | 'PIERRE' | 'ROMAIN' | 'PIERRELBZ';

// Dofus-inspired stat system:
// FORCE       → damage dealt
// AGILITE     → speed / initiative
// INTELLIGENCE → dodge chance
// CHANCE      → critical hit chance

export interface CharacterStats {
  HP: number;
  FORCE: number;
  AGILITE: number;
  INTELLIGENCE: number;
  CHANCE: number;
}

export interface CharacterDef {
  key: CharacterKey;
  name: string;
  emoji: string;
  description: string;
  passiveKey: string;
  passiveDesc: string;
  baseStats: CharacterStats;
  // Each level the player gets STAT_POINTS_PER_LEVEL free points to invest
  color: string;
  bgColor: string;
}

export const STAT_POINTS_PER_LEVEL = 5;

export const MDFB_CHARACTERS: Record<CharacterKey, CharacterDef> = {
  TIMMY: {
    key: 'TIMMY',
    name: 'Timmy',
    emoji: '🍟',
    description: 'Le Belge taquin. Lance des frites à la tête de ses ennemis.',
    passiveKey: 'FRITES_VOLANTES',
    passiveDesc: 'Frites volantes : 10% de chance de lancer une frite au début du tour (3-8 dégâts bonus)',
    baseStats: { HP: 100, FORCE: 10, AGILITE: 12, INTELLIGENCE: 9, CHANCE: 9 },
    color: '#633806',
    bgColor: '#FAC775',
  },
  ANTOINE: {
    key: 'ANTOINE',
    name: 'Antoine',
    emoji: '🤓',
    description: 'Le Geek optimisé. Analyse chaque combat comme un algorithme.',
    passiveKey: 'OPTIMISATION',
    passiveDesc: 'Optimisation : +5% de régénération entre les actions. 8% de parer les projectiles adverses.',
    baseStats: { HP: 100, FORCE: 9, AGILITE: 10, INTELLIGENCE: 12, CHANCE: 9 },
    color: '#0C447C',
    bgColor: '#B5D4F4',
  },
  ROBIN: {
    key: 'ROBIN',
    name: 'Robin',
    emoji: '⚡',
    description: "L'Agile éclair. Trop rapide pour être touché.",
    passiveKey: 'ESQUIVE_ECLAIR',
    passiveDesc: "Esquive éclair : +4% de chance d'esquive. Si esquive, 10% de contre-attaquer immédiatement.",
    baseStats: { HP: 95, FORCE: 9, AGILITE: 14, INTELLIGENCE: 11, CHANCE: 9 },
    color: '#27500A',
    bgColor: '#C0DD97',
  },
  HUGO: {
    key: 'HUGO',
    name: 'Hugo',
    emoji: '💼',
    description: 'Le Businessman. Transforme chaque victoire en opportunité.',
    passiveKey: 'DEAL_GAGNANT',
    passiveDesc: "Deal gagnant : +10% d'or gagné après chaque combat. +2% de dégâts par item équipé.",
    baseStats: { HP: 100, FORCE: 12, AGILITE: 10, INTELLIGENCE: 9, CHANCE: 9 },
    color: '#72243E',
    bgColor: '#F4C0D1',
  },
  MAIKO: {
    key: 'MAIKO',
    name: 'Maiko',
    emoji: '🧠',
    description: 'La Stratège calme. Lit chaque combat avant qu\'il commence.',
    passiveKey: 'LECTURE',
    passiveDesc: "Lecture : la première fois qu'elle subit un effet de contrôle, sa durée est réduite de 30%.",
    baseStats: { HP: 100, FORCE: 9, AGILITE: 10, INTELLIGENCE: 13, CHANCE: 8 },
    color: '#3C3489',
    bgColor: '#CECBF6',
  },
  PIERRE: {
    key: 'PIERRE',
    name: 'Pierre',
    emoji: '🪨',
    description: 'Le Costaud. Une montagne de muscles et de détermination.',
    passiveKey: 'ROBUSTESSE',
    passiveDesc: 'Robustesse : +8% de PV maximum. -3% de Vitesse en contrepartie.',
    baseStats: { HP: 115, FORCE: 13, AGILITE: 8, INTELLIGENCE: 9, CHANCE: 8 },
    color: '#444441',
    bgColor: '#D3D1C7',
  },
  ROMAIN: {
    key: 'ROMAIN',
    name: 'Romain',
    emoji: '🎯',
    description: "L'Opportuniste. Frappe toujours au bon moment.",
    passiveKey: 'EXECUTION',
    passiveDesc: "Exécution : +12% de dégâts si l'ennemi a moins de 25% de PV.",
    baseStats: { HP: 100, FORCE: 11, AGILITE: 10, INTELLIGENCE: 9, CHANCE: 10 },
    color: '#993C1D',
    bgColor: '#F5C4B3',
  },
  PIERRELBZ: {
    key: 'PIERRELBZ',
    name: 'PierreLBZ',
    emoji: '💪',
    description: 'Le Têtu. Impossible à mettre KO. Jamais.',
    passiveKey: 'TENACITE',
    passiveDesc: 'Ténacité : si un coup devait le mettre KO, il survit à 1 PV. Une seule fois par combat.',
    baseStats: { HP: 110, FORCE: 11, AGILITE: 10, INTELLIGENCE: 9, CHANCE: 9 },
    color: '#085041',
    bgColor: '#9FE1CB',
  },
};

export const CHARACTER_KEYS = Object.keys(MDFB_CHARACTERS) as CharacterKey[];

export function getCharacter(key: CharacterKey): CharacterDef {
  return MDFB_CHARACTERS[key];
}

// Returns base stats + stat points invested by the player
export function computeStatsAtLevel(
  char: CharacterDef,
  level: number,
  invested: { FORCE?: number; AGILITE?: number; INTELLIGENCE?: number; CHANCE?: number } = {},
): CharacterStats & { maxHP: number } {
  const hpPerLevel = 5;
  const HP = char.baseStats.HP + (level - 1) * hpPerLevel;
  return {
    HP,
    maxHP: HP,
    FORCE: char.baseStats.FORCE + (invested.FORCE ?? 0),
    AGILITE: char.baseStats.AGILITE + (invested.AGILITE ?? 0),
    INTELLIGENCE: char.baseStats.INTELLIGENCE + (invested.INTELLIGENCE ?? 0),
    CHANCE: char.baseStats.CHANCE + (invested.CHANCE ?? 0),
  };
}

// Total points available to invest at a given level
export function totalStatPoints(level: number): number {
  return (level - 1) * STAT_POINTS_PER_LEVEL;
}
