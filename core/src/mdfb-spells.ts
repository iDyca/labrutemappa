// ─── MDFB Spell System ────────────────────────────────────────────────────────

export type SpellEffectType =
  | 'DAMAGE'
  | 'HEAL'
  | 'SHIELD'
  | 'LIFESTEAL'
  | 'SKIP_ATTACK'
  | 'DEBUFF_DAMAGE'
  | 'MULTI_HIT'
  | 'SURVIVE'
  | 'DOUBLE_STRIKE';

export interface SpellEffect {
  type: SpellEffectType;
  minVal?: number;
  maxVal?: number;
  /** For LIFESTEAL: ratio of damage healed (0.5 = 50%, 1.0 = 100%) */
  healRatio?: number;
  /** For DEBUFF_DAMAGE: reduction ratio applied to target outgoing dmg */
  debuffRatio?: number;
  /** For MULTI_HIT: number of hits */
  hits?: number;
}

export interface SpellDef {
  id: string;
  name: string;
  levelUnlock: number;
  baseTriggerChance: number;
  dofusClass: string;
  description: string;
  effect: SpellEffect;
}

export const MDFB_SPELLS: SpellDef[] = [
  {
    id: 'amplification',
    name: 'Amplification',
    levelUnlock: 1,
    baseTriggerChance: 5,
    dofusClass: 'Iop',
    description: 'Inflige 4 à 10 dégâts bonus à l\'ennemi.',
    effect: { type: 'DAMAGE', minVal: 4, maxVal: 10 },
  },
  {
    id: 'soin_rapide',
    name: 'Soin Rapide',
    levelUnlock: 1,
    baseTriggerChance: 5,
    dofusClass: 'Eniripsa',
    description: 'Restaure 10 à 18% des PV maximum du lanceur.',
    effect: { type: 'HEAL', minVal: 10, maxVal: 18 },
  },
  {
    id: 'fleche_perforante',
    name: 'Flèche Perforante',
    levelUnlock: 5,
    baseTriggerChance: 4,
    dofusClass: 'Cra',
    description: 'Inflige 12 à 22 dégâts, ignorant l\'esquive ennemie.',
    effect: { type: 'DAMAGE', minVal: 12, maxVal: 22 },
  },
  {
    id: 'deceleration',
    name: 'Décélération',
    levelUnlock: 5,
    baseTriggerChance: 4,
    dofusClass: 'Xelor',
    description: 'L\'ennemi rate sa contre-attaque ce tour.',
    effect: { type: 'SKIP_ATTACK' },
  },
  {
    id: 'bouclier_feca',
    name: 'Bouclier de Féca',
    levelUnlock: 10,
    baseTriggerChance: 4,
    dofusClass: 'Féca',
    description: 'Génère un bouclier qui absorbe 20 à 35 dégâts.',
    effect: { type: 'SHIELD', minVal: 20, maxVal: 35 },
  },
  {
    id: 'chatiment',
    name: 'Châtiment',
    levelUnlock: 10,
    baseTriggerChance: 3,
    dofusClass: 'Sacrieur',
    description: 'Inflige 20 à 35 dégâts et soigne 50% des dégâts infligés.',
    effect: { type: 'LIFESTEAL', minVal: 20, maxVal: 35, healRatio: 0.5 },
  },
  {
    id: 'ebranlement',
    name: 'Ébranlement',
    levelUnlock: 15,
    baseTriggerChance: 3,
    dofusClass: 'Iop',
    description: 'Inflige 25 à 40 dégâts à l\'ennemi.',
    effect: { type: 'DAMAGE', minVal: 25, maxVal: 40 },
  },
  {
    id: 'grace_divine',
    name: 'Grâce Divine',
    levelUnlock: 15,
    baseTriggerChance: 3,
    dofusClass: 'Eniripsa',
    description: 'Restaure 20 à 30% des PV maximum du lanceur.',
    effect: { type: 'HEAL', minVal: 20, maxVal: 30 },
  },
  {
    id: 'double_frappe',
    name: 'Double Frappe',
    levelUnlock: 20,
    baseTriggerChance: 2.5,
    dofusClass: 'Sram',
    description: 'Frappe l\'ennemi 2 fois pour 15 à 25 dégâts chacune.',
    effect: { type: 'MULTI_HIT', minVal: 15, maxVal: 25, hits: 2 },
  },
  {
    id: 'epines_sram',
    name: 'Épines du Sram',
    levelUnlock: 20,
    baseTriggerChance: 2.5,
    dofusClass: 'Sram',
    description: 'Inflige 15 à 25 dégâts et réduit les dégâts ennemis de 15%.',
    effect: { type: 'DEBUFF_DAMAGE', minVal: 15, maxVal: 25, debuffRatio: 0.15 },
  },
  {
    id: 'tromperie',
    name: 'Tromperie',
    levelUnlock: 25,
    baseTriggerChance: 2.5,
    dofusClass: 'Sram',
    description: 'Réduit les dégâts ennemis de 20% sans bonus de dégâts.',
    effect: { type: 'DEBUFF_DAMAGE', debuffRatio: 0.20 },
  },
  {
    id: 'rafale',
    name: 'Rafale',
    levelUnlock: 25,
    baseTriggerChance: 2,
    dofusClass: 'Cra',
    description: 'Frappe l\'ennemi 3 fois pour 12 à 20 dégâts chacune.',
    effect: { type: 'MULTI_HIT', minVal: 12, maxVal: 20, hits: 3 },
  },
  {
    id: 'mot_prevention',
    name: 'Mot de Prévention',
    levelUnlock: 30,
    baseTriggerChance: 2,
    dofusClass: 'Eniripsa',
    description: 'Le lanceur survit une fois avec 1 PV au lieu de mourir.',
    effect: { type: 'SURVIVE' },
  },
  {
    id: 'coup_poing_iop',
    name: 'Coup de Poing du Iop',
    levelUnlock: 30,
    baseTriggerChance: 2,
    dofusClass: 'Iop',
    description: 'Inflige 45 à 70 dégâts à l\'ennemi.',
    effect: { type: 'DAMAGE', minVal: 45, maxVal: 70 },
  },
  {
    id: 'absorption',
    name: 'Absorption',
    levelUnlock: 35,
    baseTriggerChance: 1.5,
    dofusClass: 'Sacrieur',
    description: 'Inflige 40 à 65 dégâts et soigne 100% des dégâts infligés.',
    effect: { type: 'LIFESTEAL', minVal: 40, maxVal: 65, healRatio: 1.0 },
  },
  {
    id: 'mur_feca',
    name: 'Mur de Féca',
    levelUnlock: 35,
    baseTriggerChance: 1.5,
    dofusClass: 'Féca',
    description: 'Génère un bouclier qui absorbe 55 à 80 dégâts.',
    effect: { type: 'SHIELD', minVal: 55, maxVal: 80 },
  },
  {
    id: 'pluie_fleches',
    name: 'Pluie de Flèches',
    levelUnlock: 40,
    baseTriggerChance: 1,
    dofusClass: 'Cra',
    description: 'Frappe l\'ennemi 4 fois pour 15 à 25 dégâts chacune.',
    effect: { type: 'MULTI_HIT', minVal: 15, maxVal: 25, hits: 4 },
  },
  {
    id: 'transcendance',
    name: 'Transcendance',
    levelUnlock: 40,
    baseTriggerChance: 1,
    dofusClass: 'Sacrieur',
    description: 'Multiplie les dégâts de la prochaine attaque par 2.5.',
    effect: { type: 'DOUBLE_STRIKE', minVal: 2.5 },
  },
  {
    id: 'fureur_divine',
    name: 'Fureur Divine',
    levelUnlock: 45,
    baseTriggerChance: 1,
    dofusClass: 'Iop',
    description: 'Inflige 65 à 100 dégâts, ignorant l\'esquive ennemie.',
    effect: { type: 'DAMAGE', minVal: 65, maxVal: 100 },
  },
  {
    id: 'epee_destin',
    name: 'Épée du Destin',
    levelUnlock: 50,
    baseTriggerChance: 0.5,
    dofusClass: 'Iop',
    description: 'Inflige 90 à 140 dégâts dévastateurs, ignorant l\'esquive ennemie.',
    effect: { type: 'DAMAGE', minVal: 90, maxVal: 140 },
  },
];

/** Returns the SpellDef for a given id, or undefined if not found. */
export function getSpellDef(id: string): SpellDef | undefined {
  return MDFB_SPELLS.find(s => s.id === id);
}

// ─── XP / Level formulas ──────────────────────────────────────────────────────

/** Total XP required to reach level n.
 *  lv1=0, lv2=100, lv3=300, lv4=600, lv5=1000, ...
 */
export function totalXPForLevel(level: number): number {
  return Math.floor(level * (level - 1) / 2) * 100;
}

/** Computes the level corresponding to a total accumulated XP value. */
export function computeLevelFromXP(totalXP: number): number {
  let level = 1;
  while (level < 50 && totalXPForLevel(level + 1) <= totalXP) level++;
  return level;
}

/** Returns up to 3 random spell choices available at the given milestone level
 *  that the player has not yet unlocked.
 */
export function getSpellChoices(milestone: number, unlockedSpells: string[]): SpellDef[] {
  const pool = MDFB_SPELLS.filter(
    s => s.levelUnlock <= milestone && !unlockedSpells.includes(s.id),
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}
