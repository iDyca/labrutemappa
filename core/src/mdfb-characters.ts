export type CharacterKey = 'TIMMY' | 'ANTOINE' | 'ROBIN' | 'HUGO' | 'MAIKO' | 'PIERRE' | 'ROMAIN' | 'PIERRELBZ';

export interface CharacterDef {
  key: CharacterKey;
  name: string;
  emoji: string;
  description: string;
  passiveKey: string;
  passiveDesc: string;
  baseStats: {
    HP: number;
    STR: number;
    AGI: number;
    SPD: number;
    WIS: number;
  };
  statGainPerLevel: {
    HP: number;
    STR: number;
    AGI: number;
    SPD: number;
    WIS: number;
  };
  color: string;
  bgColor: string;
}

export const MDFB_CHARACTERS: Record<CharacterKey, CharacterDef> = {
  TIMMY: {
    key: 'TIMMY',
    name: 'Timmy',
    emoji: '🍟',
    description: 'Le Belge taquin. Lance des frites à la tête de ses ennemis.',
    passiveKey: 'FRITES_VOLANTES',
    passiveDesc: 'Frites volantes : 10% de chance de lancer une frite au début du tour (3-8 dégâts bonus)',
    baseStats: { HP: 100, STR: 10, AGI: 10, SPD: 11, WIS: 9 },
    statGainPerLevel: { HP: 5, STR: 1, AGI: 1, SPD: 1, WIS: 1 },
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
    baseStats: { HP: 100, STR: 9, AGI: 11, SPD: 10, WIS: 10 },
    statGainPerLevel: { HP: 5, STR: 1, AGI: 1, SPD: 1, WIS: 1 },
    color: '#0C447C',
    bgColor: '#B5D4F4',
  },
  ROBIN: {
    key: 'ROBIN',
    name: 'Robin',
    emoji: '⚡',
    description: 'L\'Agile éclair. Trop rapide pour être touché.',
    passiveKey: 'ESQUIVE_ECLAIR',
    passiveDesc: 'Esquive éclair : +4% de chance d\'esquive. Si esquive, 10% de contre-attaquer immédiatement.',
    baseStats: { HP: 95, STR: 10, AGI: 13, SPD: 12, WIS: 10 },
    statGainPerLevel: { HP: 4, STR: 1, AGI: 2, SPD: 1, WIS: 1 },
    color: '#27500A',
    bgColor: '#C0DD97',
  },
  HUGO: {
    key: 'HUGO',
    name: 'Hugo',
    emoji: '💼',
    description: 'Le Businessman. Transforme chaque victoire en opportunité.',
    passiveKey: 'DEAL_GAGNANT',
    passiveDesc: 'Deal gagnant : +10% d\'or gagné après chaque combat. +2% de dégâts par item équipé.',
    baseStats: { HP: 100, STR: 11, AGI: 10, SPD: 10, WIS: 9 },
    statGainPerLevel: { HP: 5, STR: 1, AGI: 1, SPD: 1, WIS: 1 },
    color: '#72243E',
    bgColor: '#F4C0D1',
  },
  MAIKO: {
    key: 'MAIKO',
    name: 'Maiko',
    emoji: '🧠',
    description: 'La Stratège calme. Lit chaque combat avant qu\'il commence.',
    passiveKey: 'LECTURE',
    passiveDesc: 'Lecture : la première fois qu\'elle subit un effet de contrôle, sa durée est réduite de 30%.',
    baseStats: { HP: 100, STR: 9, AGI: 10, SPD: 10, WIS: 11 },
    statGainPerLevel: { HP: 5, STR: 1, AGI: 1, SPD: 1, WIS: 2 },
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
    baseStats: { HP: 108, STR: 12, AGI: 9, SPD: 9, WIS: 10 },
    statGainPerLevel: { HP: 7, STR: 2, AGI: 1, SPD: 1, WIS: 1 },
    color: '#444441',
    bgColor: '#D3D1C7',
  },
  ROMAIN: {
    key: 'ROMAIN',
    name: 'Romain',
    emoji: '🎯',
    description: 'L\'Opportuniste. Frappe toujours au bon moment.',
    passiveKey: 'EXECUTION',
    passiveDesc: 'Exécution : +12% de dégâts si l\'ennemi a moins de 25% de PV.',
    baseStats: { HP: 100, STR: 11, AGI: 10, SPD: 10, WIS: 9 },
    statGainPerLevel: { HP: 5, STR: 2, AGI: 1, SPD: 1, WIS: 1 },
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
    baseStats: { HP: 105, STR: 11, AGI: 9, SPD: 10, WIS: 10 },
    statGainPerLevel: { HP: 6, STR: 1, AGI: 1, SPD: 1, WIS: 1 },
    color: '#085041',
    bgColor: '#9FE1CB',
  },
};

export const CHARACTER_KEYS = Object.keys(MDFB_CHARACTERS) as CharacterKey[];

export function getCharacter(key: CharacterKey): CharacterDef {
  return MDFB_CHARACTERS[key];
}

export function computeStatsAtLevel(char: CharacterDef, level: number) {
  const stats = { ...char.baseStats };
  for (let i = 1; i < level; i++) {
    stats.HP += char.statGainPerLevel.HP;
    stats.STR += char.statGainPerLevel.STR;
    stats.AGI += char.statGainPerLevel.AGI;
    stats.SPD += char.statGainPerLevel.SPD;
    stats.WIS += char.statGainPerLevel.WIS;
  }
  return stats;
}
