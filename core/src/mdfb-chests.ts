import { pickItemByRarityForLevel } from './mdfb-items.js';
import type { ItemDef, Rarity } from './mdfb-items.js';
import type { ChestType } from './mdfb-achievements.js';

export type { ChestType };

// ─── Tables de butin ──────────────────────────────────────────────────────────
// Les légendaires sont TRÈS rares : 3% dans un Grand Coffre, 15% dans un Coffre Légendaire.
// Avec seulement 2 Coffres Légendaires accessibles (à 300 et 500 victoires), la probabilité
// d'obtenir au moins 1 item légendaire sur toute une carrière est ~27%.

interface LootWeights {
  COMMON: number;
  UNCOMMON: number;
  RARE: number;
  EPIC: number;
  LEGENDARY: number;
}

export const CHEST_LOOT_TABLES: Record<ChestType, { label: string; emoji: string; loot: LootWeights }> = {
  BRONZE: {
    label: 'Petit Coffre',
    emoji: '📦',
    loot: { COMMON: 60, UNCOMMON: 30, RARE: 10, EPIC: 0, LEGENDARY: 0 },
  },
  SILVER: {
    label: 'Coffre Moyen',
    emoji: '🪙',
    loot: { COMMON: 15, UNCOMMON: 40, RARE: 35, EPIC: 10, LEGENDARY: 0 },
  },
  GOLD: {
    label: 'Grand Coffre',
    emoji: '🏆',
    // 3% légendaire — si un joueur l'ouvre au niveau max il peut tomber sur du légendaire
    loot: { COMMON: 0, UNCOMMON: 15, RARE: 47, EPIC: 35, LEGENDARY: 3 },
  },
  PLATINUM: {
    label: 'Coffre Légendaire',
    emoji: '💎',
    // 15% légendaire — coffre obtenu seulement à 300 et 500 victoires
    loot: { COMMON: 0, UNCOMMON: 0, RARE: 25, EPIC: 60, LEGENDARY: 15 },
  },
};

// ─── Résumé des paliers de victoires ─────────────────────────────────────────
// Jalons définis dans mdfb-achievements.ts (type VICTORIES).
// Ce tableau est utile côté client pour afficher la progression.
export const VICTORY_MILESTONES_SUMMARY = [
  { wins: 5,   chest: 'BRONZE'   as ChestType },
  { wins: 10,  chest: 'BRONZE'   as ChestType },
  { wins: 25,  chest: 'SILVER'   as ChestType },
  { wins: 50,  chest: 'SILVER'   as ChestType },
  { wins: 75,  chest: 'SILVER'   as ChestType },
  { wins: 100, chest: 'GOLD'     as ChestType },
  { wins: 150, chest: 'GOLD'     as ChestType },
  { wins: 200, chest: 'GOLD'     as ChestType },
  { wins: 300, chest: 'PLATINUM' as ChestType },
  { wins: 500, chest: 'PLATINUM' as ChestType },
] as const;

// ─── Ouverture d'un coffre ────────────────────────────────────────────────────
// Tire un item depuis la table de butin du coffre, en respectant le niveau du joueur.
// Si aucun item de la rareté choisie n'est disponible pour ce niveau, descend d'un cran.
export function openChestForLevel(chestType: ChestType, playerLevel: number): ItemDef {
  const { loot } = CHEST_LOOT_TABLES[chestType];
  const order: Rarity[] = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];

  const rollVal = Math.random() * 100;
  let acc = 0;
  let chosen: Rarity = 'COMMON';
  for (const rarity of order) {
    acc += loot[rarity];
    if (rollVal < acc) { chosen = rarity; break; }
  }

  // Try chosen rarity, then fall back down the ladder if no items available at this level
  for (const rarity of order.slice(order.indexOf(chosen))) {
    try {
      return pickItemByRarityForLevel(rarity, playerLevel);
    } catch {
      // No items of this rarity for this level — try next lower
    }
  }

  // Absolute fallback (should never happen at level >= 1)
  return pickItemByRarityForLevel('COMMON', 1);
}

// ─── Prochain palier ─────────────────────────────────────────────────────────
// Retourne le prochain jalon à atteindre et la progression vers celui-ci.
export function nextVictoryMilestone(victories: number): {
  nextWins: number;
  chest: ChestType;
  progress: number;
} | null {
  const next = VICTORY_MILESTONES_SUMMARY.find(m => m.wins > victories);
  if (!next) return null;
  const prev = [...VICTORY_MILESTONES_SUMMARY].reverse().find(m => m.wins <= victories);
  const from = prev?.wins ?? 0;
  return {
    nextWins: next.wins,
    chest: next.chest,
    progress: (victories - from) / (next.wins - from),
  };
}
