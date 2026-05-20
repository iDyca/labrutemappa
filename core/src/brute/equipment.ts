/**
 * Mappadofuslabrute Equipment System
 * Inspired by Dofus 1.29
 */

export enum EquipmentSlot {
    HELM = 'helm',
    CLOAK = 'cloak',
    WEAPON = 'weapon',
    BOOTS = 'boots',
}

export enum EquipmentRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    EPIC = 'epic',
    LEGENDARY = 'legendary',
}

export type EquipmentStats = {
    hpBonus?: number;
    strengthBonus?: number;
    agilityBonus?: number;
    speedBonus?: number;
    accuracyBonus?: number;
    dodgeBonus?: number;
};

export type Equipment = {
    id: string;
    name: string;
    description: string;
    slot: EquipmentSlot;
    rarity: EquipmentRarity;
    requiredLevel: number;
    stats: EquipmentStats;
    spriteId: string; // For rendering on character
};

export const DOFUS_EQUIPMENT_LIBRARY: Equipment[] = [
    // ===== HELMS =====
    {
        id: 'helm_bouftou',
        name: 'Coiffe du Bouftou',
        description: 'A sturdy helm made from Bouftou horns',
        slot: EquipmentSlot.HELM,
        rarity: EquipmentRarity.COMMON,
        requiredLevel: 1,
        stats: { hpBonus: 10, dodgeBonus: 2 },
        spriteId: 'helm_bouftou',
    },
    {
        id: 'helm_arachnee',
        name: 'Chapeau d\'Arachnée',
        description: 'A elegant spider-themed helm',
        slot: EquipmentSlot.HELM,
        rarity: EquipmentRarity.UNCOMMON,
        requiredLevel: 5,
        stats: { hpBonus: 20, agilityBonus: 3 },
        spriteId: 'helm_arachnee',
    },
    {
        id: 'helm_tofu',
        name: 'Couronne du Tofu Royal',
        description: 'A crown fit for tofu royalty',
        slot: EquipmentSlot.HELM,
        rarity: EquipmentRarity.RARE,
        requiredLevel: 15,
        stats: { hpBonus: 35, strengthBonus: 4, dodgeBonus: 5 },
        spriteId: 'helm_tofu',
    },
    {
        id: 'helm_dragon',
        name: 'Tiare du Kouartz',
        description: 'An ancient crown with dragon origins',
        slot: EquipmentSlot.HELM,
        rarity: EquipmentRarity.EPIC,
        requiredLevel: 25,
        stats: { hpBonus: 60, strengthBonus: 8, agilityBonus: 6, speedBonus: 5 },
        spriteId: 'helm_dragon',
    },
    {
        id: 'helm_archlich',
        name: 'Couronne de l\'Archlich',
        description: 'A legendary crown emanating dark power',
        slot: EquipmentSlot.HELM,
        rarity: EquipmentRarity.LEGENDARY,
        requiredLevel: 30,
        stats: { hpBonus: 100, strengthBonus: 15, agilityBonus: 12, speedBonus: 10, accuracyBonus: 8 },
        spriteId: 'helm_archlich',
    },

    // ===== CLOAKS =====
    {
        id: 'cloak_simple',
        name: 'Cape Commune',
        description: 'A simple but effective cloak',
        slot: EquipmentSlot.CLOAK,
        rarity: EquipmentRarity.COMMON,
        requiredLevel: 1,
        stats: { hpBonus: 15, dodgeBonus: 3 },
        spriteId: 'cloak_simple',
    },
    {
        id: 'cloak_dark',
        name: 'Cape Sombre',
        description: 'A mysterious dark cloak',
        slot: EquipmentSlot.CLOAK,
        rarity: EquipmentRarity.UNCOMMON,
        requiredLevel: 5,
        stats: { hpBonus: 25, agilityBonus: 4, dodgeBonus: 6 },
        spriteId: 'cloak_dark',
    },
    {
        id: 'cloak_ink',
        name: 'La Voile d\'Encre',
        description: 'A legendary ink-colored sail cloak',
        slot: EquipmentSlot.CLOAK,
        rarity: EquipmentRarity.LEGENDARY,
        requiredLevel: 30,
        stats: { hpBonus: 80, agilityBonus: 18, dodgeBonus: 15, speedBonus: 12 },
        spriteId: 'cloak_ink',
    },
    {
        id: 'cloak_royal',
        name: 'Cape Royale',
        description: 'A cloak fit for nobility',
        slot: EquipmentSlot.CLOAK,
        rarity: EquipmentRarity.EPIC,
        requiredLevel: 25,
        stats: { hpBonus: 50, strengthBonus: 7, agilityBonus: 10, dodgeBonus: 12 },
        spriteId: 'cloak_royal',
    },

    // ===== WEAPONS (selected types) =====
    {
        id: 'weapon_sword_iron',
        name: 'Épée de Fer',
        description: 'A basic iron sword',
        slot: EquipmentSlot.WEAPON,
        rarity: EquipmentRarity.COMMON,
        requiredLevel: 1,
        stats: { strengthBonus: 8, accuracyBonus: 3 },
        spriteId: 'weapon_sword_iron',
    },
    {
        id: 'weapon_sword_steel',
        name: 'Épée d\'Acier',
        description: 'A sharp steel sword',
        slot: EquipmentSlot.WEAPON,
        rarity: EquipmentRarity.UNCOMMON,
        requiredLevel: 10,
        stats: { strengthBonus: 15, accuracyBonus: 6 },
        spriteId: 'weapon_sword_steel',
    },
    {
        id: 'weapon_bow_elm',
        name: 'Arc d\'Orme',
        description: 'An elegant wooden bow',
        slot: EquipmentSlot.WEAPON,
        rarity: EquipmentRarity.UNCOMMON,
        requiredLevel: 10,
        stats: { agilityBonus: 12, accuracyBonus: 8 },
        spriteId: 'weapon_bow_elm',
    },
    {
        id: 'weapon_staff_fire',
        name: 'Bâton de Feu',
        description: 'A staff infused with fire',
        slot: EquipmentSlot.WEAPON,
        rarity: EquipmentRarity.RARE,
        requiredLevel: 20,
        stats: { strengthBonus: 18, agilityBonus: 10, accuracyBonus: 10 },
        spriteId: 'weapon_staff_fire',
    },

    // ===== BOOTS =====
    {
        id: 'boots_leather',
        name: 'Bottes de Cuir',
        description: 'Durable leather boots',
        slot: EquipmentSlot.BOOTS,
        rarity: EquipmentRarity.COMMON,
        requiredLevel: 1,
        stats: { speedBonus: 5, dodgeBonus: 4 },
        spriteId: 'boots_leather',
    },
    {
        id: 'boots_winged',
        name: 'Bottes Ailées',
        description: 'Boots with enchanted wings',
        slot: EquipmentSlot.BOOTS,
        rarity: EquipmentRarity.UNCOMMON,
        requiredLevel: 10,
        stats: { speedBonus: 12, dodgeBonus: 8, agilityBonus: 5 },
        spriteId: 'boots_winged',
    },
    {
        id: 'boots_dragon',
        name: 'Bottes de Dragon',
        description: 'Dragon scale boots for swift movement',
        slot: EquipmentSlot.BOOTS,
        rarity: EquipmentRarity.EPIC,
        requiredLevel: 25,
        stats: { speedBonus: 20, dodgeBonus: 15, agilityBonus: 10, hpBonus: 30 },
        spriteId: 'boots_dragon',
    },
];

export const getEquipmentById = (id: string): Equipment | undefined => {
    return DOFUS_EQUIPMENT_LIBRARY.find(eq => eq.id === id);
};

export const getEquipmentBySlot = (slot: EquipmentSlot): Equipment[] => {
    return DOFUS_EQUIPMENT_LIBRARY.filter(eq => eq.slot === slot);
};

export const getEquipmentByRarity = (rarity: EquipmentRarity): Equipment[] => {
    return DOFUS_EQUIPMENT_LIBRARY.filter(eq => eq.rarity === rarity);
};

export const getEquipmentByLevel = (maxLevel: number): Equipment[] => {
    return DOFUS_EQUIPMENT_LIBRARY.filter(eq => eq.requiredLevel <= maxLevel);
};
