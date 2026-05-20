export type Rarity = 'COMMON' | 'RARE' | 'MAGIC' | 'MAJORRARE' | 'LEGENDARY';
export type Slot = 'WEAPON' | 'HAT' | 'CAPE' | 'BOOTS' | 'BELT' | 'RING';
export interface ItemDef {
  id: string; name: string; emoji: string; slot: Slot; rarity: Rarity;
  levelMin: number; stats: { HP?: [number,number]; STR?: [number,number]; AGI?: [number,number]; SPD?: [number,number]; WIS?: [number,number]; };
  effect?: string; effectDesc?: string; spriteKey: string;
}
export const ALL_ITEMS: ItemDef[] = [
  {id:'baton-boisaille',name:'Bâton de Boisaille',emoji:'🪄',slot:'WEAPON',rarity:'COMMON',levelMin:1,stats:{STR:[2,3]},spriteKey:'weapon_baton'},
  {id:'dague-rouilee',name:'Dague Rouillée',emoji:'🗡️',slot:'WEAPON',rarity:'COMMON',levelMin:1,stats:{AGI:[1,2]},spriteKey:'weapon_dague'},
  {id:'arc-bois-vert',name:'Arc de Bois Vert',emoji:'🏹',slot:'WEAPON',rarity:'COMMON',levelMin:3,stats:{AGI:[2,3]},effect:'PROJECTILE',effectDesc:'Attaque à distance',spriteKey:'weapon_arc'},
  {id:'epee-boufton',name:'Épée du Boufton',emoji:'⚔️',slot:'WEAPON',rarity:'RARE',levelMin:5,stats:{STR:[4,6],HP:[2,2]},spriteKey:'weapon_epee_boufton'},
  {id:'arc-chouques',name:'Arc des Chouques',emoji:'🏹',slot:'WEAPON',rarity:'RARE',levelMin:8,stats:{AGI:[5,7]},effect:'PROJECTILE_SLOW5',effectDesc:'5% de ralentir l ennemi 1 tour',spriteKey:'weapon_arc_chouques'},
  {id:'marteau-bouftou',name:'Marteau Bouftou',emoji:'🔨',slot:'WEAPON',rarity:'MAGIC',levelMin:10,stats:{STR:[6,9]},effect:'CONE_DOUBLE10',effectDesc:'10% de toucher 2 fois',spriteKey:'weapon_marteau_bouftou'},
  {id:'griffes-bouftou-royal',name:'Griffes du Bouftou Royal',emoji:'🐏',slot:'WEAPON',rarity:'MAGIC',levelMin:18,stats:{AGI:[9,13],STR:[6,6]},effect:'DOUBLEHIT',effectDesc:'2 attaques par tour',spriteKey:'weapon_griffes'},
  {id:'arc-kwisatz',name:'Arc du Kwisatz',emoji:'🏹',slot:'WEAPON',rarity:'MAJORRARE',levelMin:20,stats:{AGI:[12,16],WIS:[6,6]},effect:'PIERCE20',effectDesc:'Ignore 20% résistance',spriteKey:'weapon_arc_kwisatz'},
  {id:'dagues-bandit',name:'Dagues du Bandit',emoji:'🗡️',slot:'WEAPON',rarity:'MAJORRARE',levelMin:22,stats:{AGI:[10,15],STR:[6,6]},effect:'DOUBLEHIT_BLEED12',effectDesc:'Double frappe + 12% saignement',spriteKey:'weapon_dagues_bandit'},
  {id:'lance-minotoror',name:'Lance du Minotoror',emoji:'🐂',slot:'WEAPON',rarity:'MAJORRARE',levelMin:28,stats:{STR:[18,24],WIS:[5,5]},effect:'KNOCKBACK20',effectDesc:'20% de repousser l ennemi',spriteKey:'weapon_lance_minotoror'},
  {id:'dagues-saigneur',name:'Dagues du Saigneur',emoji:'💀',slot:'WEAPON',rarity:'LEGENDARY',levelMin:30,stats:{STR:[16,22],AGI:[10,14]},effect:'DOUBLEHIT_BLEED15_CRIT5',effectDesc:'Double frappe + 15% saignement + 5% crit',spriteKey:'weapon_dagues_saigneur'},
  {id:'epee-goultard',name:'Epee de Goultard',emoji:'🗡️',slot:'WEAPON',rarity:'LEGENDARY',levelMin:40,stats:{STR:[24,32],HP:[10,10]},effect:'DMG_X2_ONCE',effectDesc:'1x/combat degats x2',spriteKey:'weapon_epee_goultard'},
  {id:'chapeau-paille',name:'Chapeau de Paille',emoji:'🎩',slot:'HAT',rarity:'COMMON',levelMin:1,stats:{HP:[5,8]},spriteKey:'hat_paille'},
  {id:'bonnet-laine',name:'Bonnet de Laine',emoji:'🧢',slot:'HAT',rarity:'COMMON',levelMin:1,stats:{HP:[4,7],WIS:[1,1]},spriteKey:'hat_bonnet'},
  {id:'coiffe-bouftou',name:'Coiffe du Bouftou',emoji:'🐑',slot:'HAT',rarity:'RARE',levelMin:5,stats:{HP:[10,15],STR:[1,2]},spriteKey:'hat_bouftou'},
  {id:'coiffe-chef-bwork',name:'Coiffe du Chef Bwork',emoji:'👹',slot:'HAT',rarity:'MAGIC',levelMin:10,stats:{HP:[12,16],STR:[4,6]},effect:'DMG_REDUCE5',effectDesc:'5% reduire degats recus',spriteKey:'hat_bwork'},
  {id:'coiffe-meulou',name:'Coiffe du Meulou',emoji:'🦁',slot:'HAT',rarity:'MAJORRARE',levelMin:20,stats:{HP:[20,28],STR:[6,8],SPD:[-1,-1]},spriteKey:'hat_meulou'},
  {id:'coiffe-minotoror',name:'Coiffe du Minotoror',emoji:'🐂',slot:'HAT',rarity:'LEGENDARY',levelMin:30,stats:{HP:[30,40],STR:[8,12]},effect:'MITIGATION5',effectDesc:'+5% mitigation',spriteKey:'hat_minotoror'},
  {id:'coiffe-feca',name:'Coiffe de Feca',emoji:'🛡️',slot:'HAT',rarity:'LEGENDARY',levelMin:40,stats:{HP:[35,45],WIS:[8,8]},effect:'BLOCK_ONCE',effectDesc:'Annule 1 attaque 1x/combat',spriteKey:'hat_feca'},
  {id:'cape-toile',name:'Cape en Toile',emoji:'🧥',slot:'CAPE',rarity:'COMMON',levelMin:1,stats:{HP:[4,7]},spriteKey:'cape_toile'},
  {id:'cape-sombre',name:'Cape Sombre',emoji:'🌑',slot:'CAPE',rarity:'RARE',levelMin:5,stats:{WIS:[4,6]},effect:'CC_DUR_MINUS3',effectDesc:'-3% duree des CC',spriteKey:'cape_sombre'},
  {id:'cape-toady',name:'Cape du Toady',emoji:'🐸',slot:'CAPE',rarity:'MAGIC',levelMin:10,stats:{AGI:[5,7]},effect:'DODGE_PLUS2',effectDesc:'+2% esquive',spriteKey:'cape_toady'},
  {id:'cape-corbac',name:'Cape du Corbac',emoji:'🦅',slot:'CAPE',rarity:'MAJORRARE',levelMin:20,stats:{WIS:[7,10]},effect:'SHADOW5',effectDesc:'5% ennemi rate son attaque',spriteKey:'cape_corbac'},
  {id:'voile-encre',name:'La Voile Encre',emoji:'🌊',slot:'CAPE',rarity:'LEGENDARY',levelMin:30,stats:{AGI:[18,24],SPD:[8,12],WIS:[10,14]},effect:'SHADOW8',effectDesc:'8% ennemi rate chaque attaque',spriteKey:'cape_voile_encre'},
  {id:'cape-eniripsa',name:'Cape de Eniripsa',emoji:'✨',slot:'CAPE',rarity:'LEGENDARY',levelMin:40,stats:{WIS:[18,24],HP:[12,12]},effect:'REGEN5_EOT',effectDesc:'Recupere 5% PV max par tour',spriteKey:'cape_eniripsa'},
  {id:'sandales-plage',name:'Sandales de Plage',emoji:'👡',slot:'BOOTS',rarity:'COMMON',levelMin:1,stats:{SPD:[1,2]},spriteKey:'boots_sandales'},
  {id:'bottes-cuir',name:'Bottes en Cuir',emoji:'👟',slot:'BOOTS',rarity:'COMMON',levelMin:1,stats:{SPD:[2,3]},spriteKey:'boots_cuir'},
  {id:'bottes-flibustier',name:'Bottes du Flibustier',emoji:'🥾',slot:'BOOTS',rarity:'RARE',levelMin:5,stats:{SPD:[3,5],AGI:[2,2]},spriteKey:'boots_flibustier'},
  {id:'bottes-aventurier',name:'Bottes de Aventurier',emoji:'🥿',slot:'BOOTS',rarity:'MAGIC',levelMin:10,stats:{SPD:[6,8],AGI:[3,3]},spriteKey:'boots_aventurier'},
  {id:'bottes-nomade',name:'Bottes du Nomade',emoji:'🌍',slot:'BOOTS',rarity:'MAJORRARE',levelMin:20,stats:{SPD:[10,16],AGI:[4,6]},effect:'RANGE_PLUS2',effectDesc:'+2 portee distance',spriteKey:'boots_nomade'},
  {id:'bottes-horlogeres',name:'Bottes Horlogeres',emoji:'⏱️',slot:'BOOTS',rarity:'LEGENDARY',levelMin:30,stats:{SPD:[14,20]},effect:'INITBOOST10',effectDesc:'Initiative absolue 10%',spriteKey:'boots_horlogeres'},
  {id:'bottes-sacrieur',name:'Bottes du Sacrieur',emoji:'🩸',slot:'BOOTS',rarity:'LEGENDARY',levelMin:36,stats:{SPD:[10,16],STR:[10,14]},effect:'FURY_STACK',effectDesc:'Furie : SPD et STR +3 par PV perdu max +15',spriteKey:'boots_sacrieur'},
  {id:'ceinture-corde',name:'Ceinture en Corde',emoji:'🪢',slot:'BELT',rarity:'COMMON',levelMin:1,stats:{WIS:[1,1]},spriteKey:'belt_corde'},
  {id:'ceinture-prespic',name:'Ceinture du Prespic',emoji:'🦔',slot:'BELT',rarity:'RARE',levelMin:5,stats:{WIS:[2,2]},effect:'THORNS1',effectDesc:'Renvoie 1 degat fixe',spriteKey:'belt_prespic'},
  {id:'ceinture-tortue',name:'Ceinture Tortue',emoji:'🐢',slot:'BELT',rarity:'MAGIC',levelMin:10,stats:{WIS:[6,10]},effect:'DMG_REDUCE3',effectDesc:'-3% degats recus',spriteKey:'belt_tortue'},
  {id:'ceinture-fulgu',name:'Ceinture Fulgu',emoji:'⚡',slot:'BELT',rarity:'MAJORRARE',levelMin:20,stats:{SPD:[8,12],WIS:[4,6]},spriteKey:'belt_fulgu'},
  {id:'ceinture-sacrieur',name:'Ceinture du Sacrieur',emoji:'🩸',slot:'BELT',rarity:'LEGENDARY',levelMin:30,stats:{STR:[10,15],HP:[8,12]},effect:'CRIT_RECEIVED_STR2',effectDesc:'+2 Force par crit recu',spriteKey:'belt_sacrieur'},
  {id:'ceinture-goultard',name:'Ceinture de Goultard',emoji:'⚔️',slot:'BELT',rarity:'LEGENDARY',levelMin:40,stats:{STR:[14,18],HP:[10,10],WIS:[6,6]},effect:'BERSERK_LOW_HP',effectDesc:'PV<30% : Force et Vitesse +5',spriteKey:'belt_goultard'},
  {id:'anneau-bois',name:'Anneau de Bois',emoji:'🌿',slot:'RING',rarity:'COMMON',levelMin:1,stats:{HP:[2,3]},spriteKey:'ring_bois'},
  {id:'anneau-aventurier',name:'Anneau du Jeune Aventurier',emoji:'🌟',slot:'RING',rarity:'RARE',levelMin:5,stats:{HP:[6,10],AGI:[2,3]},spriteKey:'ring_aventurier'},
  {id:'anneau-scarafeuille',name:'Anneau du Scarafeuille',emoji:'🦂',slot:'RING',rarity:'MAJORRARE',levelMin:20,stats:{HP:[10,14],WIS:[4,6]},effect:'DMG_REDUCE2',effectDesc:'-2% degats recus',spriteKey:'ring_scarafeuille'},
  {id:'anneau-goultard',name:'Anneau de Goultard',emoji:'⚔️',slot:'RING',rarity:'LEGENDARY',levelMin:30,stats:{STR:[12,18],HP:[8,8]},effect:'RAGE_STR3_TURN',effectDesc:'+3 Force par tour max +15',spriteKey:'ring_goultard'},
  {id:'anneau-eniripsa',name:'Anneau de Eniripsa',emoji:'✨',slot:'RING',rarity:'LEGENDARY',levelMin:40,stats:{WIS:[10,15],AGI:[8,8]},effect:'HEAL5_AFTER_WIN',effectDesc:'+5 PV apres chaque victoire',spriteKey:'ring_eniripsa'},
];
export function getItemDef(id: string) { return ALL_ITEMS.find(i => i.id === id); }
export function pickItemByRarityForLevel(rarity: Rarity, playerLevel: number) {
  const pool = ALL_ITEMS.filter(i => i.rarity === rarity && i.levelMin <= playerLevel);
  if (!pool.length) throw new Error('No item for rarity=' + rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}
export function rollItemInstance(def: ItemDef, ownerId: string) {
  const rolled: Record<string, number> = {};
  for (const [stat, range] of Object.entries(def.stats) as [string, [number,number]][]) {
    rolled[stat] = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }
  return { id: 'inst_' + Date.now() + '_' + Math.random().toString(36).slice(2), defId: def.id, ownerId, rolled, createdAt: new Date().toISOString() };
}
