// Dofus Retro items — levels are original Dofus level / 4
// Sprite URLs: https://dofusretro.cdn.ankama.com/item/preview/{dofusId}.png
// dofusId values marked with * need verification against actual Dofus Retro data

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type Slot = 'WEAPON' | 'HAT' | 'CAPE' | 'BOOTS' | 'BELT' | 'RING';

export interface ItemDef {
  id: string;
  name: string;
  slot: Slot;
  rarity: Rarity;
  levelMin: number;   // level in LaBrute (= dofusLevel / 4)
  dofusLevel: number; // original Dofus Retro level
  dofusId: number;    // Dofus Retro item ID for sprite CDN
  stats: {
    HP?: [number, number];
    FORCE?: [number, number];
    AGILITE?: [number, number];
    INTELLIGENCE?: [number, number];
    CHANCE?: [number, number];
  };
  effect?: string;
  effectDesc?: string;
}

export function getSpriteUrl(item: ItemDef): string {
  return `https://dofusretro.cdn.ankama.com/item/preview/${item.dofusId}.png`;
}

// ─── COIFFES (30) ────────────────────────────────────────────────────────────
const HATS: ItemDef[] = [
  // Level 1-30 (Common / Uncommon / Rare)
  { id:'coiffe-tofu',          name:'Coiffe de Tofu',              slot:'HAT', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:6526,  stats:{ HP:[5,8] } },
  { id:'chapeau-acolyte',      name:"Chapeau d'Acolyte",           slot:'HAT', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:436,   stats:{ HP:[4,7], INTELLIGENCE:[1,1] } },
  { id:'chapeau-bandit',       name:'Chapeau de Bandit',           slot:'HAT', rarity:'COMMON',   levelMin:2,  dofusLevel:6,   dofusId:437,   stats:{ HP:[6,10], FORCE:[1,2] } },
  { id:'chapeau-bwork',        name:'Chapeau du Bwork',            slot:'HAT', rarity:'COMMON',   levelMin:2,  dofusLevel:8,   dofusId:1702,  stats:{ HP:[7,11] } },
  { id:'chapeau-bucheron',     name:'Chapeau de Bûcheron',         slot:'HAT', rarity:'COMMON',   levelMin:3,  dofusLevel:12,  dofusId:2436,  stats:{ HP:[8,13], FORCE:[1,2] } },
  { id:'coiffe-bouftou',       name:'Coiffe du Bouftou',           slot:'HAT', rarity:'COMMON',   levelMin:5,  dofusLevel:18,  dofusId:169,   stats:{ HP:[10,16], FORCE:[1,3] } },
  { id:'chapeau-gobball',      name:'Chapeau du Gobball',          slot:'HAT', rarity:'COMMON',   levelMin:7,  dofusLevel:26,  dofusId:1703,  stats:{ HP:[13,20], FORCE:[2,4] } },
  { id:'chapeau-mineur',       name:'Chapeau de Mineur',           slot:'HAT', rarity:'UNCOMMON', levelMin:8,  dofusLevel:28,  dofusId:1704,  stats:{ HP:[14,22], FORCE:[2,4] } },
  { id:'coiffe-bworks',        name:'Coiffe des Bworks',           slot:'HAT', rarity:'UNCOMMON', levelMin:8,  dofusLevel:30,  dofusId:1705,  stats:{ INTELLIGENCE:[3,5], HP:[10,16] } },
  { id:'chapeau-forgeron',     name:'Chapeau de Forgeron',         slot:'HAT', rarity:'UNCOMMON', levelMin:9,  dofusLevel:33,  dofusId:1706,  stats:{ HP:[15,24], FORCE:[3,5] } },
  { id:'coiffe-ermite',        name:"Coiffe de l'Ermite",          slot:'HAT', rarity:'UNCOMMON', levelMin:10, dofusLevel:38,  dofusId:1707,  stats:{ HP:[16,25], INTELLIGENCE:[3,5] } },
  { id:'chapeau-mercenaire',   name:'Chapeau du Mercenaire',       slot:'HAT', rarity:'UNCOMMON', levelMin:11, dofusLevel:44,  dofusId:1708,  stats:{ FORCE:[4,7], CHANCE:[2,3] } },
  { id:'coiffe-croc-dur',      name:'Coiffe du Croc-Dur',          slot:'HAT', rarity:'UNCOMMON', levelMin:12, dofusLevel:47,  dofusId:1709,  stats:{ HP:[18,28], AGILITE:[2,4] } },
  { id:'coiffe-hgrenouille',   name:"Coiffe de l'Homme Grenouille",slot:'HAT', rarity:'UNCOMMON', levelMin:14, dofusLevel:55,  dofusId:1710,  stats:{ INTELLIGENCE:[4,7], HP:[14,22] } },
  { id:'chapeau-tronqueur',    name:'Chapeau du Tronqueur',        slot:'HAT', rarity:'RARE',     levelMin:16, dofusLevel:63,  dofusId:1711,  stats:{ FORCE:[5,9], HP:[16,26] } },
  { id:'coiffe-fossoyeur',     name:'Coiffe du Fossoyeur',         slot:'HAT', rarity:'RARE',     levelMin:17, dofusLevel:68,  dofusId:1712,  stats:{ INTELLIGENCE:[5,9], FORCE:[3,6] } },
  { id:'chapeau-tenebres',     name:'Chapeau des Ténèbres',        slot:'HAT', rarity:'RARE',     levelMin:19, dofusLevel:75,  dofusId:1713,  stats:{ HP:[22,34], INTELLIGENCE:[4,7] } },
  { id:'coiffe-milirat',       name:'Coiffe du Milirat',           slot:'HAT', rarity:'RARE',     levelMin:21, dofusLevel:82,  dofusId:1714,  stats:{ AGILITE:[5,9], CHANCE:[3,5] } },
  { id:'coiffe-minotoror',     name:'Coiffe du Minotoror',         slot:'HAT', rarity:'RARE',     levelMin:27, dofusLevel:107, dofusId:2723,  stats:{ HP:[28,42], FORCE:[6,10] } },
  { id:'chapeau-ours',         name:"Chapeau de l'Ours",           slot:'HAT', rarity:'RARE',     levelMin:28, dofusLevel:112, dofusId:1715,  stats:{ HP:[30,45], FORCE:[6,10] } },
  // Level 30-40 (Uncommon / Rare / Epic)
  { id:'coiffe-dragoune',      name:'Coiffe du Dragoune',          slot:'HAT', rarity:'UNCOMMON', levelMin:31, dofusLevel:123, dofusId:1716,  stats:{ HP:[32,48], AGILITE:[4,7] } },
  { id:'chapeau-ouginak',      name:"Chapeau de l'Ouginak",        slot:'HAT', rarity:'RARE',     levelMin:34, dofusLevel:133, dofusId:1717,  stats:{ FORCE:[8,13], INTELLIGENCE:[5,8] } },
  { id:'coiffe-ternaire',      name:'Coiffe du Ternaire',          slot:'HAT', rarity:'RARE',     levelMin:35, dofusLevel:140, dofusId:1718,  stats:{ HP:[36,55], FORCE:[7,12], CHANCE:[4,6] } },
  { id:'chapeau-hivernage',    name:"Chapeau de l'Hivernage",      slot:'HAT', rarity:'EPIC',     levelMin:37, dofusLevel:149, dofusId:1719,  stats:{ INTELLIGENCE:[10,16], HP:[30,45] } },
  { id:'coiffe-mastogobe',     name:'Coiffe du Mastogobe',         slot:'HAT', rarity:'EPIC',     levelMin:40, dofusLevel:158, dofusId:1720,  stats:{ HP:[40,60], AGILITE:[7,12] } },
  // Level 40-50 (Rare / Epic / Legendary)
  { id:'coiffe-sacrieur',      name:'Coiffe du Sacrieur',          slot:'HAT', rarity:'RARE',     levelMin:41, dofusLevel:162, dofusId:1721,  stats:{ FORCE:[10,16], HP:[35,52] } },
  { id:'chapeau-goultard',     name:'Chapeau de Goultard',         slot:'HAT', rarity:'EPIC',     levelMin:44, dofusLevel:173, dofusId:1722,  stats:{ FORCE:[13,20], CHANCE:[7,11] } },
  { id:'coiffe-eniripsa',      name:'Coiffe Eniripsa',             slot:'HAT', rarity:'EPIC',     levelMin:46, dofusLevel:181, dofusId:1723,  stats:{ INTELLIGENCE:[14,22], HP:[40,60] } },
  { id:'coiffe-grande-duchesse',name:'Coiffe de la Grande Duchesse',slot:'HAT', rarity:'LEGENDARY',levelMin:47, dofusLevel:188, dofusId:1724,  stats:{ HP:[55,80], FORCE:[12,18], INTELLIGENCE:[10,15] } },
  { id:'chapeau-iop',          name:'Chapeau du Iop',              slot:'HAT', rarity:'LEGENDARY',levelMin:49, dofusLevel:196, dofusId:1725,  stats:{ FORCE:[18,28], CHANCE:[12,18], HP:[40,60] } },
];

// ─── CAPES (30) ──────────────────────────────────────────────────────────────
const CAPES: ItemDef[] = [
  { id:'cape-toile',           name:'Cape en Toile',               slot:'CAPE', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:2101,  stats:{ HP:[4,7] } },
  { id:'cape-cuir',            name:'Cape de Cuir',                slot:'CAPE', rarity:'COMMON',   levelMin:2,  dofusLevel:5,   dofusId:2102,  stats:{ INTELLIGENCE:[1,2] } },
  { id:'cape-novice',          name:'Cape du Novice',              slot:'CAPE', rarity:'COMMON',   levelMin:2,  dofusLevel:8,   dofusId:2103,  stats:{ AGILITE:[1,2] } },
  { id:'cape-bwork',           name:'Cape du Bwork',               slot:'CAPE', rarity:'COMMON',   levelMin:3,  dofusLevel:11,  dofusId:2104,  stats:{ HP:[8,12], INTELLIGENCE:[1,2] } },
  { id:'cape-pouchkine',       name:'Cape du Pouchkine',           slot:'CAPE', rarity:'COMMON',   levelMin:5,  dofusLevel:17,  dofusId:2105,  stats:{ CHANCE:[2,3], HP:[7,11] } },
  { id:'cape-bouftou',         name:'Cape du Bouftou',             slot:'CAPE', rarity:'COMMON',   levelMin:6,  dofusLevel:22,  dofusId:2106,  stats:{ INTELLIGENCE:[2,4], HP:[8,13] } },
  { id:'cape-gobball',         name:'Cape du Gobball',             slot:'CAPE', rarity:'UNCOMMON', levelMin:7,  dofusLevel:26,  dofusId:2107,  stats:{ INTELLIGENCE:[3,5], AGILITE:[2,4] } },
  { id:'cape-sombre',          name:'Cape Sombre',                 slot:'CAPE', rarity:'UNCOMMON', levelMin:8,  dofusLevel:30,  dofusId:2108,  stats:{ INTELLIGENCE:[4,6] } },
  { id:'cape-tronqueur',       name:'Cape du Tronqueur',           slot:'CAPE', rarity:'UNCOMMON', levelMin:10, dofusLevel:37,  dofusId:2109,  stats:{ HP:[14,22], INTELLIGENCE:[3,5] } },
  { id:'cape-mercenaire',      name:'Cape du Mercenaire',          slot:'CAPE', rarity:'UNCOMMON', levelMin:11, dofusLevel:42,  dofusId:2110,  stats:{ AGILITE:[4,6], INTELLIGENCE:[3,5] } },
  { id:'cape-hgrenouille',     name:"Cape de l'Homme Grenouille",  slot:'CAPE', rarity:'UNCOMMON', levelMin:13, dofusLevel:50,  dofusId:2111,  stats:{ INTELLIGENCE:[4,7], CHANCE:[3,5] } },
  { id:'cape-corbac',          name:'Cape du Corbac',              slot:'CAPE', rarity:'UNCOMMON', levelMin:15, dofusLevel:57,  dofusId:2112,  stats:{ INTELLIGENCE:[5,8], AGILITE:[3,5] }, effect:'SHADOW5', effectDesc:'5% de chance que l\'ennemi rate son attaque' },
  { id:'cape-fossoyeur',       name:'Cape du Fossoyeur',           slot:'CAPE', rarity:'RARE',     levelMin:16, dofusLevel:61,  dofusId:2113,  stats:{ INTELLIGENCE:[5,9], HP:[14,22] } },
  { id:'cape-minotoror',       name:'Cape du Minotoror',           slot:'CAPE', rarity:'RARE',     levelMin:17, dofusLevel:68,  dofusId:2114,  stats:{ HP:[22,34], FORCE:[4,7] } },
  { id:'cape-chevalier-noir',  name:'Cape du Chevalier Noir',      slot:'CAPE', rarity:'RARE',     levelMin:19, dofusLevel:74,  dofusId:2115,  stats:{ INTELLIGENCE:[6,10], FORCE:[4,7] } },
  { id:'cape-toady',           name:'Cape du Toady',               slot:'CAPE', rarity:'RARE',     levelMin:20, dofusLevel:79,  dofusId:2116,  stats:{ INTELLIGENCE:[6,10] } },
  { id:'cape-singe',           name:'Cape du Singe',               slot:'CAPE', rarity:'RARE',     levelMin:21, dofusLevel:84,  dofusId:2117,  stats:{ AGILITE:[6,10], CHANCE:[4,6] } },
  { id:'cape-chef-bwork',      name:'Cape du Chef Bwork',          slot:'CAPE', rarity:'RARE',     levelMin:23, dofusLevel:90,  dofusId:2118,  stats:{ HP:[24,36], INTELLIGENCE:[5,9] } },
  { id:'cape-rastapopoil',     name:'Cape de Rastapopoil',         slot:'CAPE', rarity:'RARE',     levelMin:25, dofusLevel:98,  dofusId:2119,  stats:{ AGILITE:[7,12], INTELLIGENCE:[5,8] } },
  { id:'cape-ogrest',          name:"Cape d'Ogrest",               slot:'CAPE', rarity:'RARE',     levelMin:29, dofusLevel:115, dofusId:2120,  stats:{ HP:[28,42], FORCE:[6,10], INTELLIGENCE:[4,7] } },
  // Level 30-40
  { id:'cape-sombrio',         name:'Cape de Sombrio',             slot:'CAPE', rarity:'UNCOMMON', levelMin:30, dofusLevel:120, dofusId:2121,  stats:{ INTELLIGENCE:[7,11], AGILITE:[4,7] } },
  { id:'cape-grande-menace',   name:'Cape de la Grande Menace',    slot:'CAPE', rarity:'RARE',     levelMin:32, dofusLevel:128, dofusId:2122,  stats:{ FORCE:[8,13], INTELLIGENCE:[6,10] } },
  { id:'cape-dragoune',        name:'Cape du Dragoune',            slot:'CAPE', rarity:'EPIC',     levelMin:34, dofusLevel:135, dofusId:2123,  stats:{ HP:[38,58], AGILITE:[8,13] } },
  { id:'cape-ouginak',         name:"Cape de l'Ouginak",           slot:'CAPE', rarity:'EPIC',     levelMin:36, dofusLevel:143, dofusId:2124,  stats:{ INTELLIGENCE:[12,18], FORCE:[7,12] } },
  { id:'cape-roi-voleurs',     name:'Cape du Roi des Voleurs',     slot:'CAPE', rarity:'EPIC',     levelMin:39, dofusLevel:153, dofusId:2125,  stats:{ AGILITE:[10,16], INTELLIGENCE:[8,13], CHANCE:[5,8] } },
  // Level 40-50
  { id:'cape-sacrieur',        name:'Cape du Sacrieur',            slot:'CAPE', rarity:'RARE',     levelMin:41, dofusLevel:162, dofusId:2126,  stats:{ FORCE:[10,16], HP:[35,52] } },
  { id:'cape-goultard',        name:'Cape de Goultard',            slot:'CAPE', rarity:'EPIC',     levelMin:44, dofusLevel:173, dofusId:2127,  stats:{ FORCE:[12,18], INTELLIGENCE:[9,14] } },
  { id:'cape-eniripsa',        name:"Cape d'Eniripsa",             slot:'CAPE', rarity:'EPIC',     levelMin:45, dofusLevel:178, dofusId:2128,  stats:{ INTELLIGENCE:[14,22], HP:[40,60] } },
  { id:'voile-encre',          name:"Voile d'Encre",               slot:'CAPE', rarity:'LEGENDARY',levelMin:48, dofusLevel:191, dofusId:7816,  stats:{ AGILITE:[18,28], INTELLIGENCE:[14,22] }, effect:'SHADOW8', effectDesc:'8% de chance que l\'ennemi rate son attaque' },
  { id:'cape-finale',          name:'Grande Cape Finale',          slot:'CAPE', rarity:'LEGENDARY',levelMin:50, dofusLevel:198, dofusId:2130,  stats:{ FORCE:[16,24], INTELLIGENCE:[16,24], HP:[50,75] } },
];

// ─── ANNEAUX (60) ────────────────────────────────────────────────────────────
const RINGS: ItemDef[] = [
  // Level 1-30
  { id:'anneau-bois',          name:'Anneau de Bois',              slot:'RING', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:3001,  stats:{ HP:[2,4] } },
  { id:'anneau-novice',        name:'Anneau du Novice',            slot:'RING', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:3002,  stats:{ CHANCE:[1,2] } },
  { id:'anneau-tofu',          name:'Anneau de Tofu',              slot:'RING', rarity:'COMMON',   levelMin:1,  dofusLevel:3,   dofusId:3003,  stats:{ AGILITE:[1,2] } },
  { id:'anneau-cuivre',        name:'Anneau de Cuivre',            slot:'RING', rarity:'COMMON',   levelMin:2,  dofusLevel:5,   dofusId:3004,  stats:{ HP:[3,6] } },
  { id:'anneau-bandit',        name:'Anneau du Bandit',            slot:'RING', rarity:'COMMON',   levelMin:2,  dofusLevel:7,   dofusId:3005,  stats:{ CHANCE:[1,2], HP:[2,4] } },
  { id:'anneau-bwork',         name:'Anneau du Bwork',             slot:'RING', rarity:'COMMON',   levelMin:3,  dofusLevel:9,   dofusId:3006,  stats:{ HP:[4,7] } },
  { id:'anneau-bouftou',       name:'Anneau du Bouftou',           slot:'RING', rarity:'COMMON',   levelMin:4,  dofusLevel:15,  dofusId:125,   stats:{ HP:[5,9], FORCE:[1,2] } },
  { id:'anneau-prespic',       name:'Anneau du Prespic',           slot:'RING', rarity:'COMMON',   levelMin:5,  dofusLevel:18,  dofusId:3008,  stats:{ INTELLIGENCE:[2,3], HP:[4,7] } },
  { id:'anneau-gobball',       name:'Anneau du Gobball',           slot:'RING', rarity:'COMMON',   levelMin:6,  dofusLevel:23,  dofusId:3009,  stats:{ FORCE:[2,4], CHANCE:[1,2] } },
  { id:'anneau-garde-royal',   name:'Anneau du Garde Royal',       slot:'RING', rarity:'COMMON',   levelMin:7,  dofusLevel:27,  dofusId:3010,  stats:{ HP:[6,10], FORCE:[2,3] } },
  { id:'anneau-mercenaire',    name:'Anneau du Mercenaire',        slot:'RING', rarity:'UNCOMMON', levelMin:8,  dofusLevel:31,  dofusId:3011,  stats:{ FORCE:[3,5], HP:[5,9] } },
  { id:'anneau-croc-dur',      name:'Anneau du Croc-Dur',          slot:'RING', rarity:'UNCOMMON', levelMin:9,  dofusLevel:35,  dofusId:3012,  stats:{ FORCE:[3,6], INTELLIGENCE:[2,4] } },
  { id:'anneau-mineur',        name:'Anneau du Mineur',            slot:'RING', rarity:'UNCOMMON', levelMin:10, dofusLevel:38,  dofusId:3013,  stats:{ HP:[8,14], CHANCE:[2,4] } },
  { id:'anneau-ermite',        name:"Anneau de l'Ermite",          slot:'RING', rarity:'UNCOMMON', levelMin:11, dofusLevel:42,  dofusId:3014,  stats:{ INTELLIGENCE:[3,6], HP:[7,12] } },
  { id:'anneau-aventurier',    name:"Anneau de l'Aventurier",      slot:'RING', rarity:'UNCOMMON', levelMin:8,  dofusLevel:29,  dofusId:3015,  stats:{ HP:[6,10], AGILITE:[2,4] } },
  { id:'anneau-hgrenouille',   name:"Anneau de l'Homme Grenouille",slot:'RING', rarity:'UNCOMMON', levelMin:12, dofusLevel:48,  dofusId:3016,  stats:{ INTELLIGENCE:[3,6], CHANCE:[2,4] } },
  { id:'anneau-guerrier',      name:'Anneau du Guerrier',          slot:'RING', rarity:'UNCOMMON', levelMin:13, dofusLevel:52,  dofusId:3017,  stats:{ FORCE:[4,7], AGILITE:[2,4] } },
  { id:'anneau-corsaire',      name:'Anneau du Corsaire',          slot:'RING', rarity:'UNCOMMON', levelMin:14, dofusLevel:56,  dofusId:3018,  stats:{ AGILITE:[4,6], CHANCE:[2,4] } },
  { id:'anneau-fossoyeur',     name:'Anneau du Fossoyeur',         slot:'RING', rarity:'UNCOMMON', levelMin:15, dofusLevel:60,  dofusId:3019,  stats:{ INTELLIGENCE:[4,7], HP:[8,13] } },
  { id:'anneau-ours-blanc',    name:"Anneau de l'Ours Blanc",      slot:'RING', rarity:'UNCOMMON', levelMin:16, dofusLevel:63,  dofusId:3020,  stats:{ HP:[10,16], FORCE:[3,6] } },
  { id:'anneau-tronqueur',     name:'Anneau du Tronqueur',         slot:'RING', rarity:'RARE',     levelMin:17, dofusLevel:67,  dofusId:3021,  stats:{ FORCE:[5,9], HP:[9,15] } },
  { id:'anneau-chevalier-noir',name:'Anneau du Chevalier Noir',    slot:'RING', rarity:'RARE',     levelMin:19, dofusLevel:73,  dofusId:3022,  stats:{ INTELLIGENCE:[5,9], FORCE:[4,7] } },
  { id:'anneau-milirat',       name:'Anneau du Milirat',           slot:'RING', rarity:'RARE',     levelMin:20, dofusLevel:80,  dofusId:3023,  stats:{ AGILITE:[5,9], CHANCE:[3,5] } },
  { id:'anneau-sombrio',       name:'Anneau de Sombrio',           slot:'RING', rarity:'RARE',     levelMin:21, dofusLevel:84,  dofusId:3024,  stats:{ INTELLIGENCE:[5,9], AGILITE:[3,6] } },
  { id:'anneau-ours',          name:"Anneau de l'Ours",            slot:'RING', rarity:'RARE',     levelMin:22, dofusLevel:88,  dofusId:3025,  stats:{ HP:[14,22], FORCE:[4,7] } },
  { id:'anneau-scarafeuille',  name:'Anneau du Scarafeuille',      slot:'RING', rarity:'RARE',     levelMin:23, dofusLevel:91,  dofusId:3026,  stats:{ INTELLIGENCE:[5,9], HP:[10,16] } },
  { id:'anneau-tortue',        name:'Anneau de la Tortue',         slot:'RING', rarity:'RARE',     levelMin:24, dofusLevel:95,  dofusId:3027,  stats:{ HP:[12,19], INTELLIGENCE:[4,8] } },
  { id:'anneau-singe',         name:'Anneau du Singe',             slot:'RING', rarity:'RARE',     levelMin:26, dofusLevel:101, dofusId:3028,  stats:{ AGILITE:[5,9], CHANCE:[4,6] } },
  { id:'anneau-minotoror',     name:'Anneau du Minotoror',         slot:'RING', rarity:'RARE',     levelMin:27, dofusLevel:107, dofusId:3029,  stats:{ HP:[14,22], FORCE:[5,9] } },
  { id:'anneau-roi-bandits',   name:'Anneau du Roi des Bandits',   slot:'RING', rarity:'RARE',     levelMin:28, dofusLevel:112, dofusId:3030,  stats:{ FORCE:[5,9], CHANCE:[4,7] } },
  // Level 30-40
  { id:'anneau-dragoune',      name:'Anneau du Dragoune',          slot:'RING', rarity:'UNCOMMON', levelMin:31, dofusLevel:121, dofusId:3031,  stats:{ AGILITE:[5,9], HP:[12,19] } },
  { id:'anneau-sombrio-noir',  name:'Anneau Sombre de Sombrio',    slot:'RING', rarity:'RARE',     levelMin:32, dofusLevel:125, dofusId:3032,  stats:{ INTELLIGENCE:[7,12], FORCE:[5,9] } },
  { id:'anneau-ouginak',       name:"Anneau de l'Ouginak",         slot:'RING', rarity:'RARE',     levelMin:33, dofusLevel:130, dofusId:3033,  stats:{ FORCE:[7,12], INTELLIGENCE:[5,9] } },
  { id:'anneau-ternaire',      name:'Anneau du Ternaire',          slot:'RING', rarity:'RARE',     levelMin:34, dofusLevel:136, dofusId:3034,  stats:{ HP:[18,28], CHANCE:[5,9] } },
  { id:'anneau-grand-duc',     name:'Anneau du Grand Duc',         slot:'RING', rarity:'EPIC',     levelMin:35, dofusLevel:140, dofusId:3035,  stats:{ INTELLIGENCE:[10,16], AGILITE:[7,11] } },
  { id:'anneau-hivernage',     name:"Anneau de l'Hivernage",       slot:'RING', rarity:'EPIC',     levelMin:36, dofusLevel:144, dofusId:3036,  stats:{ HP:[22,34], INTELLIGENCE:[9,14] } },
  { id:'anneau-mastogobe',     name:'Anneau du Mastogobe',         slot:'RING', rarity:'EPIC',     levelMin:37, dofusLevel:148, dofusId:3037,  stats:{ FORCE:[10,16], HP:[18,28] } },
  { id:'anneau-ogrest',        name:"Anneau d'Ogrest",             slot:'RING', rarity:'EPIC',     levelMin:38, dofusLevel:151, dofusId:3038,  stats:{ HP:[20,32], FORCE:[8,13], CHANCE:[5,9] } },
  { id:'anneau-reine-araignee',name:'Anneau de la Reine des Araignées',slot:'RING', rarity:'EPIC', levelMin:39, dofusLevel:155, dofusId:3039,  stats:{ INTELLIGENCE:[10,16], CHANCE:[7,11] } },
  { id:'anneau-chef-clan',     name:'Anneau du Chef de Clan',      slot:'RING', rarity:'EPIC',     levelMin:40, dofusLevel:158, dofusId:3040,  stats:{ FORCE:[10,16], AGILITE:[7,11] } },
  // Level 40-50
  { id:'anneau-sacrieur',      name:'Anneau du Sacrieur',          slot:'RING', rarity:'RARE',     levelMin:41, dofusLevel:163, dofusId:3041,  stats:{ FORCE:[10,16], HP:[18,28] } },
  { id:'anneau-eniripsa',      name:'Anneau de Eniripsa',          slot:'RING', rarity:'EPIC',     levelMin:43, dofusLevel:170, dofusId:3042,  stats:{ INTELLIGENCE:[12,19], HP:[18,28] } },
  { id:'anneau-sram',          name:'Anneau du Sram',              slot:'RING', rarity:'EPIC',     levelMin:44, dofusLevel:173, dofusId:3043,  stats:{ CHANCE:[9,15], AGILITE:[7,11] } },
  { id:'anneau-xelor',         name:'Anneau du Xelor',             slot:'RING', rarity:'EPIC',     levelMin:44, dofusLevel:176, dofusId:3044,  stats:{ AGILITE:[9,14], INTELLIGENCE:[7,12] } },
  { id:'anneau-cra',           name:'Anneau du Cra',               slot:'RING', rarity:'EPIC',     levelMin:45, dofusLevel:179, dofusId:3045,  stats:{ CHANCE:[10,16], AGILITE:[7,11] } },
  { id:'anneau-iop',           name:'Anneau du Iop',               slot:'RING', rarity:'EPIC',     levelMin:46, dofusLevel:182, dofusId:3046,  stats:{ FORCE:[12,19], CHANCE:[8,13] } },
  { id:'anneau-feca',          name:'Anneau du Feca',              slot:'RING', rarity:'LEGENDARY',levelMin:47, dofusLevel:185, dofusId:3047,  stats:{ INTELLIGENCE:[14,22], HP:[22,34] } },
  { id:'anneau-goultard',      name:'Anneau de Goultard',          slot:'RING', rarity:'LEGENDARY',levelMin:47, dofusLevel:188, dofusId:3048,  stats:{ FORCE:[14,22], HP:[18,28] } },
  { id:'anneau-roi',           name:'Anneau du Roi',               slot:'RING', rarity:'LEGENDARY',levelMin:49, dofusLevel:193, dofusId:3049,  stats:{ FORCE:[12,18], INTELLIGENCE:[12,18], CHANCE:[10,15] } },
  { id:'anneau-dieu-guerrier', name:'Anneau du Dieu Guerrier',     slot:'RING', rarity:'LEGENDARY',levelMin:50, dofusLevel:198, dofusId:3050,  stats:{ FORCE:[16,24], CHANCE:[14,20], HP:[30,45] } },
  // Extra rings to reach 60 total (10 more spread across ranges)
  { id:'anneau-paille',        name:'Anneau de Paille',            slot:'RING', rarity:'COMMON',   levelMin:1,  dofusLevel:2,   dofusId:3051,  stats:{ HP:[2,3] } },
  { id:'anneau-jonquille',     name:'Anneau Jonquille',            slot:'RING', rarity:'COMMON',   levelMin:4,  dofusLevel:13,  dofusId:3052,  stats:{ FORCE:[1,2], HP:[3,5] } },
  { id:'anneau-lame',          name:'Anneau de la Lame',           slot:'RING', rarity:'UNCOMMON', levelMin:10, dofusLevel:39,  dofusId:3053,  stats:{ FORCE:[3,6], CHANCE:[2,3] } },
  { id:'anneau-corsaire-or',   name:"Anneau d'Or du Corsaire",     slot:'RING', rarity:'UNCOMMON', levelMin:13, dofusLevel:51,  dofusId:3054,  stats:{ CHANCE:[3,5], AGILITE:[2,4] } },
  { id:'anneau-ombre',         name:"Anneau de l'Ombre",           slot:'RING', rarity:'RARE',     levelMin:18, dofusLevel:72,  dofusId:3055,  stats:{ INTELLIGENCE:[4,8], CHANCE:[3,5] } },
  { id:'anneau-terre',         name:'Anneau de la Terre',          slot:'RING', rarity:'RARE',     levelMin:25, dofusLevel:100, dofusId:3056,  stats:{ FORCE:[5,9], HP:[8,13] } },
  { id:'anneau-combat',        name:'Anneau de Combat',            slot:'RING', rarity:'UNCOMMON', levelMin:33, dofusLevel:129, dofusId:3057,  stats:{ FORCE:[6,10], HP:[10,16] } },
  { id:'anneau-eclair',        name:"Anneau de l'Éclair",          slot:'RING', rarity:'EPIC',     levelMin:38, dofusLevel:150, dofusId:3058,  stats:{ AGILITE:[8,13], CHANCE:[6,10] } },
  { id:'anneau-vide',          name:'Anneau du Vide',              slot:'RING', rarity:'RARE',     levelMin:42, dofusLevel:165, dofusId:3059,  stats:{ INTELLIGENCE:[9,14], AGILITE:[5,9] } },
  { id:'anneau-eternel',       name:'Anneau Éternel',              slot:'RING', rarity:'LEGENDARY',levelMin:48, dofusLevel:191, dofusId:3060,  stats:{ HP:[25,38], FORCE:[12,18], INTELLIGENCE:[10,15] } },
];

// ─── BOTTES (30) ─────────────────────────────────────────────────────────────
const BOOTS: ItemDef[] = [
  { id:'sandales-plage',       name:'Sandales de Plage',           slot:'BOOTS', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:4001,  stats:{ AGILITE:[1,2] } },
  { id:'bottes-cuir',          name:'Bottes de Cuir',              slot:'BOOTS', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:4002,  stats:{ AGILITE:[1,2], HP:[3,5] } },
  { id:'sandales-tofu',        name:'Sandales de Tofu',            slot:'BOOTS', rarity:'COMMON',   levelMin:2,  dofusLevel:6,   dofusId:4003,  stats:{ AGILITE:[2,3] } },
  { id:'bottes-bwork',         name:'Bottes de Bwork',             slot:'BOOTS', rarity:'COMMON',   levelMin:2,  dofusLevel:8,   dofusId:4004,  stats:{ AGILITE:[2,3], HP:[4,7] } },
  { id:'bottes-novice',        name:'Bottes du Novice',            slot:'BOOTS', rarity:'COMMON',   levelMin:3,  dofusLevel:11,  dofusId:4005,  stats:{ AGILITE:[2,4], INTELLIGENCE:[1,2] } },
  { id:'bottes-bouftou',       name:'Bottes du Bouftou',           slot:'BOOTS', rarity:'COMMON',   levelMin:5,  dofusLevel:17,  dofusId:4006,  stats:{ AGILITE:[3,5], HP:[6,10] } },
  { id:'bottes-gobball',       name:'Bottes du Gobball',           slot:'BOOTS', rarity:'COMMON',   levelMin:7,  dofusLevel:24,  dofusId:4007,  stats:{ AGILITE:[3,6], FORCE:[2,3] } },
  { id:'bottes-mineur',        name:'Bottes du Mineur',            slot:'BOOTS', rarity:'UNCOMMON', levelMin:8,  dofusLevel:28,  dofusId:4008,  stats:{ AGILITE:[4,7], HP:[7,12] } },
  { id:'bottes-aventurier',    name:"Bottes de l'Aventurier",      slot:'BOOTS', rarity:'UNCOMMON', levelMin:8,  dofusLevel:30,  dofusId:4009,  stats:{ AGILITE:[4,7], INTELLIGENCE:[2,4] } },
  { id:'bottes-mercenaire',    name:'Bottes du Mercenaire',        slot:'BOOTS', rarity:'UNCOMMON', levelMin:10, dofusLevel:36,  dofusId:4010,  stats:{ AGILITE:[5,8], CHANCE:[2,4] } },
  { id:'bottes-croc-dur',      name:'Bottes du Croc-Dur',          slot:'BOOTS', rarity:'UNCOMMON', levelMin:10, dofusLevel:40,  dofusId:4011,  stats:{ AGILITE:[5,8], HP:[8,13] } },
  { id:'bottes-corsaire',      name:'Bottes du Corsaire',          slot:'BOOTS', rarity:'UNCOMMON', levelMin:12, dofusLevel:47,  dofusId:4012,  stats:{ AGILITE:[5,9], INTELLIGENCE:[3,5] } },
  { id:'bottes-hgrenouille',   name:"Bottes de l'Homme Grenouille",slot:'BOOTS', rarity:'UNCOMMON', levelMin:13, dofusLevel:52,  dofusId:4013,  stats:{ INTELLIGENCE:[4,7], AGILITE:[4,7] } },
  { id:'bottes-tronqueur',     name:'Bottes du Tronqueur',         slot:'BOOTS', rarity:'RARE',     levelMin:15, dofusLevel:60,  dofusId:4014,  stats:{ AGILITE:[6,10], FORCE:[3,6] } },
  { id:'bottes-flibustier',    name:'Bottes du Flibustier',        slot:'BOOTS', rarity:'RARE',     levelMin:17, dofusLevel:65,  dofusId:4015,  stats:{ AGILITE:[6,10], CHANCE:[4,6] } },
  { id:'bottes-fossoyeur',     name:'Bottes du Fossoyeur',         slot:'BOOTS', rarity:'RARE',     levelMin:18, dofusLevel:70,  dofusId:4016,  stats:{ INTELLIGENCE:[6,10], AGILITE:[4,7] } },
  { id:'bottes-nomade',        name:'Bottes du Nomade',            slot:'BOOTS', rarity:'RARE',     levelMin:20, dofusLevel:78,  dofusId:4017,  stats:{ AGILITE:[8,13] } },
  { id:'bottes-ours',          name:"Bottes de l'Ours",            slot:'BOOTS', rarity:'RARE',     levelMin:22, dofusLevel:86,  dofusId:4018,  stats:{ HP:[16,26], AGILITE:[5,9] } },
  { id:'bottes-minotoror',     name:'Bottes du Minotoror',         slot:'BOOTS', rarity:'RARE',     levelMin:25, dofusLevel:99,  dofusId:4019,  stats:{ AGILITE:[8,13], FORCE:[5,9] } },
  { id:'bottes-roi-bandits',   name:'Bottes du Roi des Bandits',   slot:'BOOTS', rarity:'RARE',     levelMin:28, dofusLevel:110, dofusId:4020,  stats:{ AGILITE:[8,13], CHANCE:[5,8] } },
  // Level 30-40
  { id:'bottes-ouginak',       name:"Bottes de l'Ouginak",         slot:'BOOTS', rarity:'UNCOMMON', levelMin:31, dofusLevel:124, dofusId:4021,  stats:{ AGILITE:[7,12], INTELLIGENCE:[4,7] } },
  { id:'bottes-dragoune',      name:'Bottes du Dragoune',          slot:'BOOTS', rarity:'RARE',     levelMin:33, dofusLevel:132, dofusId:4022,  stats:{ AGILITE:[9,14], HP:[16,26] } },
  { id:'bottes-ternaire',      name:'Bottes du Ternaire',          slot:'BOOTS', rarity:'EPIC',     levelMin:35, dofusLevel:138, dofusId:4023,  stats:{ FORCE:[9,14], AGILITE:[9,14] } },
  { id:'bottes-hivernage',     name:"Bottes de l'Hivernage",       slot:'BOOTS', rarity:'EPIC',     levelMin:37, dofusLevel:145, dofusId:4024,  stats:{ AGILITE:[12,18], INTELLIGENCE:[7,12] } },
  { id:'bottes-mastogobe',     name:'Bottes du Mastogobe',         slot:'BOOTS', rarity:'EPIC',     levelMin:39, dofusLevel:152, dofusId:4025,  stats:{ HP:[24,36], AGILITE:[9,14] } },
  // Level 40-50
  { id:'bottes-sacrieur',      name:'Bottes du Sacrieur',          slot:'BOOTS', rarity:'RARE',     levelMin:41, dofusLevel:162, dofusId:4026,  stats:{ FORCE:[10,16], AGILITE:[8,13] } },
  { id:'bottes-sram',          name:'Bottes du Sram',              slot:'BOOTS', rarity:'EPIC',     levelMin:43, dofusLevel:172, dofusId:4027,  stats:{ AGILITE:[12,19], CHANCE:[7,11] } },
  { id:'bottes-horlogeres',    name:'Bottes Horlogères',           slot:'BOOTS', rarity:'EPIC',     levelMin:45, dofusLevel:180, dofusId:4028,  stats:{ AGILITE:[15,22] }, effect:'FIRST_STRIKE', effectDesc:'Initiative garantie au premier tour' },
  { id:'bottes-eniripsa',      name:"Bottes d'Eniripsa",           slot:'BOOTS', rarity:'LEGENDARY',levelMin:47, dofusLevel:187, dofusId:4029,  stats:{ INTELLIGENCE:[14,22], AGILITE:[12,18] } },
  { id:'bottes-goultard',      name:'Bottes de Goultard',          slot:'BOOTS', rarity:'LEGENDARY',levelMin:49, dofusLevel:195, dofusId:4030,  stats:{ FORCE:[16,24], AGILITE:[14,20] } },
];

// ─── CEINTURES (30) ──────────────────────────────────────────────────────────
const BELTS: ItemDef[] = [
  { id:'ceinture-corde',       name:'Ceinture en Corde',           slot:'BELT', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:5001,  stats:{ HP:[3,5] } },
  { id:'ceinture-toile',       name:'Ceinture en Toile',           slot:'BELT', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:5002,  stats:{ INTELLIGENCE:[1,2] } },
  { id:'ceinture-tofu',        name:'Ceinture de Tofu',            slot:'BELT', rarity:'COMMON',   levelMin:2,  dofusLevel:6,   dofusId:5003,  stats:{ HP:[4,7] } },
  { id:'ceinture-bwork',       name:'Ceinture du Bwork',           slot:'BELT', rarity:'COMMON',   levelMin:2,  dofusLevel:8,   dofusId:5004,  stats:{ HP:[5,8], CHANCE:[1,2] } },
  { id:'ceinture-novice',      name:'Ceinture du Novice',          slot:'BELT', rarity:'COMMON',   levelMin:3,  dofusLevel:11,  dofusId:5005,  stats:{ INTELLIGENCE:[1,3], HP:[4,7] } },
  { id:'ceinture-bouftou',     name:'Ceinture du Bouftou',         slot:'BELT', rarity:'COMMON',   levelMin:5,  dofusLevel:17,  dofusId:5006,  stats:{ HP:[7,11], FORCE:[1,3] } },
  { id:'ceinture-prespic',     name:'Ceinture du Prespic',         slot:'BELT', rarity:'COMMON',   levelMin:6,  dofusLevel:22,  dofusId:5007,  stats:{ INTELLIGENCE:[2,4] }, effect:'THORNS1', effectDesc:'Renvoie 1 dégât fixe par attaque reçue' },
  { id:'ceinture-gobball',     name:'Ceinture du Gobball',         slot:'BELT', rarity:'UNCOMMON', levelMin:7,  dofusLevel:26,  dofusId:5008,  stats:{ FORCE:[2,4], HP:[7,12] } },
  { id:'ceinture-mineur',      name:'Ceinture du Mineur',          slot:'BELT', rarity:'UNCOMMON', levelMin:8,  dofusLevel:30,  dofusId:5009,  stats:{ HP:[8,14], INTELLIGENCE:[2,4] } },
  { id:'ceinture-mercenaire',  name:'Ceinture du Mercenaire',      slot:'BELT', rarity:'UNCOMMON', levelMin:9,  dofusLevel:35,  dofusId:5010,  stats:{ FORCE:[3,6], CHANCE:[2,3] } },
  { id:'ceinture-croc-dur',    name:'Ceinture du Croc-Dur',        slot:'BELT', rarity:'UNCOMMON', levelMin:10, dofusLevel:39,  dofusId:5011,  stats:{ HP:[9,15], FORCE:[3,5] } },
  { id:'ceinture-corsaire',    name:'Ceinture du Corsaire',        slot:'BELT', rarity:'UNCOMMON', levelMin:11, dofusLevel:44,  dofusId:5012,  stats:{ CHANCE:[3,5], AGILITE:[2,4] } },
  { id:'ceinture-hgrenouille', name:"Ceinture de l'Homme Grenouille",slot:'BELT', rarity:'UNCOMMON',levelMin:13,dofusLevel:50,  dofusId:5013,  stats:{ INTELLIGENCE:[3,6], HP:[8,13] } },
  { id:'ceinture-tronqueur',   name:'Ceinture du Tronqueur',       slot:'BELT', rarity:'RARE',     levelMin:15, dofusLevel:58,  dofusId:5014,  stats:{ FORCE:[4,8], HP:[9,15] } },
  { id:'ceinture-tortue',      name:'Ceinture Tortue',             slot:'BELT', rarity:'RARE',     levelMin:16, dofusLevel:64,  dofusId:5015,  stats:{ INTELLIGENCE:[5,9] }, effect:'DMG_REDUCE3', effectDesc:'-3% dégâts reçus' },
  { id:'ceinture-fossoyeur',   name:'Ceinture du Fossoyeur',       slot:'BELT', rarity:'RARE',     levelMin:18, dofusLevel:70,  dofusId:5016,  stats:{ INTELLIGENCE:[5,9], FORCE:[3,6] } },
  { id:'ceinture-nomade',      name:'Ceinture du Nomade',          slot:'BELT', rarity:'RARE',     levelMin:19, dofusLevel:76,  dofusId:5017,  stats:{ AGILITE:[5,9], FORCE:[3,6] } },
  { id:'ceinture-fulgu',       name:'Ceinture Fulgu',              slot:'BELT', rarity:'RARE',     levelMin:21, dofusLevel:82,  dofusId:5018,  stats:{ AGILITE:[5,9], INTELLIGENCE:[4,7] } },
  { id:'ceinture-minotoror',   name:'Ceinture du Minotoror',       slot:'BELT', rarity:'RARE',     levelMin:24, dofusLevel:94,  dofusId:5019,  stats:{ HP:[14,22], FORCE:[5,9] } },
  { id:'ceinture-roi-bandits', name:'Ceinture du Roi des Bandits', slot:'BELT', rarity:'RARE',     levelMin:27, dofusLevel:108, dofusId:5020,  stats:{ FORCE:[5,9], CHANCE:[4,7] } },
  // Level 30-40
  { id:'ceinture-ouginak',     name:"Ceinture de l'Ouginak",       slot:'BELT', rarity:'UNCOMMON', levelMin:30, dofusLevel:120, dofusId:5021,  stats:{ FORCE:[6,10], INTELLIGENCE:[4,7] } },
  { id:'ceinture-dragoune',    name:'Ceinture du Dragoune',        slot:'BELT', rarity:'RARE',     levelMin:32, dofusLevel:128, dofusId:5022,  stats:{ HP:[16,26], AGILITE:[5,9] } },
  { id:'ceinture-ternaire',    name:'Ceinture du Ternaire',        slot:'BELT', rarity:'EPIC',     levelMin:34, dofusLevel:135, dofusId:5023,  stats:{ FORCE:[9,14], HP:[16,26] } },
  { id:'ceinture-hivernage',   name:"Ceinture de l'Hivernage",     slot:'BELT', rarity:'EPIC',     levelMin:36, dofusLevel:144, dofusId:5024,  stats:{ INTELLIGENCE:[10,16], FORCE:[7,12] } },
  { id:'ceinture-mastogobe',   name:'Ceinture du Mastogobe',       slot:'BELT', rarity:'EPIC',     levelMin:38, dofusLevel:150, dofusId:5025,  stats:{ HP:[22,34], FORCE:[8,13], CHANCE:[5,9] } },
  // Level 40-50
  { id:'ceinture-sacrieur',    name:'Ceinture du Sacrieur',        slot:'BELT', rarity:'RARE',     levelMin:41, dofusLevel:161, dofusId:5026,  stats:{ FORCE:[10,16], HP:[16,26] } },
  { id:'ceinture-sram',        name:'Ceinture du Sram',            slot:'BELT', rarity:'EPIC',     levelMin:43, dofusLevel:172, dofusId:5027,  stats:{ CHANCE:[9,15], INTELLIGENCE:[7,11] } },
  { id:'ceinture-goultard',    name:'Ceinture de Goultard',        slot:'BELT', rarity:'EPIC',     levelMin:46, dofusLevel:181, dofusId:5028,  stats:{ FORCE:[12,18], HP:[18,28] }, effect:'BERSERK', effectDesc:'Si PV < 30% : +5 FORCE et +5 AGILITE' },
  { id:'ceinture-eniripsa',    name:"Ceinture d'Eniripsa",         slot:'BELT', rarity:'LEGENDARY',levelMin:47, dofusLevel:188, dofusId:5029,  stats:{ INTELLIGENCE:[14,22], HP:[22,34] } },
  { id:'ceinture-finale',      name:'Ceinture Finale',             slot:'BELT', rarity:'LEGENDARY',levelMin:50, dofusLevel:197, dofusId:5030,  stats:{ FORCE:[16,24], INTELLIGENCE:[14,20], HP:[24,36] } },
];

// ─── WEAPONS (kept minimal — main focus is armor) ─────────────────────────────
const WEAPONS: ItemDef[] = [
  { id:'baton-boisaille',      name:'Bâton de Boisaille',          slot:'WEAPON', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:6001,  stats:{ FORCE:[2,3] } },
  { id:'dague-rouilee',        name:'Dague Rouillée',              slot:'WEAPON', rarity:'COMMON',   levelMin:1,  dofusLevel:1,   dofusId:6002,  stats:{ CHANCE:[1,2] } },
  { id:'arc-bois-vert',        name:'Arc de Bois Vert',            slot:'WEAPON', rarity:'COMMON',   levelMin:2,  dofusLevel:5,   dofusId:6003,  stats:{ CHANCE:[2,3] } },
  { id:'epee-boufton',         name:'Épée du Boufton',             slot:'WEAPON', rarity:'RARE',     levelMin:5,  dofusLevel:18,  dofusId:6004,  stats:{ FORCE:[4,6], HP:[2,3] } },
  { id:'marteau-bouftou',      name:'Marteau du Bouftou',          slot:'WEAPON', rarity:'UNCOMMON', levelMin:7,  dofusLevel:26,  dofusId:6005,  stats:{ FORCE:[5,8] } },
  { id:'griffes-bouftou-royal',name:'Griffes du Bouftou Royal',    slot:'WEAPON', rarity:'RARE',     levelMin:12, dofusLevel:47,  dofusId:6006,  stats:{ FORCE:[7,11], CHANCE:[4,6] } },
  { id:'lance-minotoror',      name:'Lance du Minotoror',          slot:'WEAPON', rarity:'RARE',     levelMin:20, dofusLevel:79,  dofusId:6007,  stats:{ FORCE:[10,16] } },
  { id:'dagues-saigneur',      name:'Dagues du Saigneur',          slot:'WEAPON', rarity:'EPIC',     levelMin:33, dofusLevel:130, dofusId:6008,  stats:{ FORCE:[12,18], CHANCE:[7,11] } },
  { id:'epee-goultard',        name:'Épée de Goultard',            slot:'WEAPON', rarity:'LEGENDARY',levelMin:45, dofusLevel:180, dofusId:6009,  stats:{ FORCE:[20,30] } },
];

export const ALL_ITEMS: ItemDef[] = [
  ...WEAPONS,
  ...HATS,
  ...CAPES,
  ...RINGS,
  ...BOOTS,
  ...BELTS,
];

export function getItemDef(id: string): ItemDef | undefined {
  return ALL_ITEMS.find(i => i.id === id);
}

export function pickItemByRarityForLevel(rarity: Rarity, playerLevel: number): ItemDef {
  const pool = ALL_ITEMS.filter(i => i.rarity === rarity && i.levelMin <= playerLevel);
  if (!pool.length) throw new Error(`No item for rarity=${rarity} level=${playerLevel}`);
  const item = pool[Math.floor(Math.random() * pool.length)];
  if (!item) throw new Error(`No item for rarity=${rarity} level=${playerLevel}`);
  return item;
}

export function pickItemForLevel(playerLevel: number, slot?: Slot): ItemDef {
  const rarityTable: [Rarity, number][] =
    playerLevel >= 40 ? [['LEGENDARY',5],['EPIC',20],['RARE',40],['UNCOMMON',25],['COMMON',10]]
    : playerLevel >= 30 ? [['EPIC',10],['RARE',35],['UNCOMMON',35],['COMMON',20]]
    : [['RARE',15],['UNCOMMON',30],['COMMON',55]];

  const roll = Math.random() * 100;
  let acc = 0;
  let chosen: Rarity = 'COMMON';
  for (const [r, w] of rarityTable) { acc += w; if (roll < acc) { chosen = r; break; } }

  let pool = ALL_ITEMS.filter(i => i.rarity === chosen && i.levelMin <= playerLevel);
  if (slot) pool = pool.filter(i => i.slot === slot);
  if (!pool.length) pool = ALL_ITEMS.filter(i => i.levelMin <= playerLevel && (!slot || i.slot === slot));
  const item = pool[Math.floor(Math.random() * pool.length)];
  if (!item) throw new Error(`No item for level=${playerLevel}`);
  return item;
}

export function rollItemInstance(def: ItemDef, ownerId: string) {
  const rolled: Record<string, number> = {};
  for (const [stat, range] of Object.entries(def.stats) as [string, [number, number]][]) {
    rolled[stat] = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }
  return {
    id: 'inst_' + Date.now() + '_' + Math.random().toString(36).slice(2),
    defId: def.id,
    ownerId,
    rolled,
    createdAt: new Date().toISOString(),
  };
}
