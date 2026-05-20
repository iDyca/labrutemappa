/**
 * Mappadofuslabrute Chest & Rewards System
 * Treasure chests awarded for consecutive victories
 */

import { Equipment, EquipmentRarity, DOFUS_EQUIPMENT_LIBRARY } from './equipment.js';

export enum ChestType {
    BRONZE = 'bronze',
    SILVER = 'silver',
    GOLD = 'gold',
}

export type ChestReward = {
    chestType: ChestType;
    equipment: Equipment;
    unlockedAt: Date;
};

export const CHEST_THRESHOLDS = {
    [ChestType.BRONZE]: 3,   // 3 consecutive victories
    [ChestType.SILVER]: 5,   // 5 consecutive victories
    [ChestType.GOLD]: 10,    // 10 consecutive victories
} as const;

export const CHEST_RARITIES: Record<ChestType, EquipmentRarity[]> = {
    [ChestType.BRONZE]: [EquipmentRarity.COMMON, EquipmentRarity.UNCOMMON],
    [ChestType.SILVER]: [EquipmentRarity.UNCOMMON, EquipmentRarity.RARE],
    [ChestType.GOLD]: [EquipmentRarity.RARE, EquipmentRarity.EPIC, EquipmentRarity.LEGENDARY],
};

/**
 * Check if player deserves a new chest based on consecutive victories
 */
export const getChestTypeForVictories = (consecutiveVictories: number): ChestType | null => {
    if (consecutiveVictories >= CHEST_THRESHOLDS[ChestType.GOLD]) {
        return ChestType.GOLD;
    }
    if (consecutiveVictories >= CHEST_THRESHOLDS[ChestType.SILVER]) {
        return ChestType.SILVER;
    }
    if (consecutiveVictories >= CHEST_THRESHOLDS[ChestType.BRONZE]) {
        return ChestType.BRONZE;
    }
    return null;
};

/**
 * Get random equipment from a chest based on its type
 */
export const getRandomEquipmentFromChest = (chestType: ChestType): Equipment => {
    const validRarities = CHEST_RARITIES[chestType];
    const validEquipment = DOFUS_EQUIPMENT_LIBRARY.filter((eq) => {
        const rarities = validRarities as EquipmentRarity[];
        return rarities.includes(eq.rarity);
    });

    if (validEquipment.length === 0) {
        throw new Error(`No valid equipment found for chest type: ${chestType}`);
    }

    return validEquipment[Math.floor(Math.random() * validEquipment.length)] as Equipment;
};

/**
 * Get all equipment available for a specific chest type
 */
export const getEquipmentForChestType = (chestType: ChestType): Equipment[] => {
    const validRarities = CHEST_RARITIES[chestType];
    return DOFUS_EQUIPMENT_LIBRARY.filter((eq) => {
        const rarities = validRarities as EquipmentRarity[];
        return rarities.includes(eq.rarity);
    });
};

/**
 * Calculate how many victories until next chest
 */
export const getVictoriesUntilNextChest = (consecutiveVictories: number): { nextChest: ChestType | null; victoriesNeeded: number } => {
    const thresholds = Object.entries(CHEST_THRESHOLDS)
        .sort((a, b) => b[1] - a[1]); // Sort descending by threshold

    for (const [chestType, threshold] of thresholds) {
        if (consecutiveVictories < threshold) {
            return {
                nextChest: chestType as ChestType,
                victoriesNeeded: threshold - consecutiveVictories,
            };
        }
    }

    // If reached GOLD threshold, next is another GOLD (repeatable)
    return {
        nextChest: ChestType.GOLD,
        victoriesNeeded: CHEST_THRESHOLDS[ChestType.GOLD],
    };
};
