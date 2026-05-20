import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@labrute/prisma';
import {
  CHARACTERS,
  CHARACTER_KEYS,
  computeStatsAtLevel,
  ACHIEVEMENTS,
  checkAchievements,
  pickItemByRarityForLevel,
  rollItemInstance,
  getItemDef,
  simulateCombat,
  Fighter,
} from '@labrute/core';

const prisma = new PrismaClient();

// GET /mdfb/characters — liste des personnages disponibles
export const getCharacters = (req: Request, res: Response) => {
  res.json(Object.values(CHARACTERS));
};

// POST /mdfb/player — créer son personnage
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { userId, characterKey } = req.body;
    if (!CHARACTER_KEYS.includes(characterKey)) {
      return res.status(400).json({ error: 'Personnage invalide' });
    }
    const existing = await prisma.mdfbPlayer.findUnique({ where: { userId } });
    if (existing) {
      return res.status(400).json({ error: 'Tu as déjà un personnage !' });
    }
    const char = CHARACTERS[characterKey];
    const stats = computeStatsAtLevel(char, 1);
    const player = await prisma.mdfbPlayer.create({
      data: {
        userId,
        characterKey,
        statsHP: stats.HP,
        statsSTR: stats.STR,
        statsAGI: stats.AGI,
        statsSPD: stats.SPD,
        statsWIS: stats.WIS,
      },
    });
    res.json(player);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

// GET /mdfb/player/:userId — profil du joueur
export const getPlayer = async (req: Request, res: Response) => {
  try {
    const player = await prisma.mdfbPlayer.findUnique({
      where: { userId: req.params.userId },
      include: {
        itemInstances: true,
        achievements: true,
        chests: { where: { opened: false } },
      },
    });
    if (!player) return res.status(404).json({ error: 'Joueur introuvable' });
    res.json(player);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

// POST /mdfb/fight — lancer un combat
export const launchFight = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const player = await prisma.mdfbPlayer.findUnique({
      where: { userId },
      include: { itemInstances: { where: { equippedSlot: { not: null } } } },
    });
    if (!player) return res.status(404).json({ error: 'Joueur introuvable' });

    // Construire le loadout
    const loadout: Fighter['loadout'] = {};
    for (const inst of player.itemInstances) {
      if (inst.equippedSlot) {
        loadout[inst.equippedSlot] = {
          defId: inst.itemDefId,
          rolled: inst.rolledStats as Record<string, number>,
          effect: getItemDef(inst.itemDefId)?.effect,
        };
      }
    }

    // Attaquant
    const attacker: Fighter = {
      id: player.id,
      name: player.userId,
      characterKey: player.characterKey,
      level: player.level,
      HP: player.statsHP, maxHP: player.statsHP,
      STR: player.statsSTR, AGI: player.statsAGI,
      SPD: player.statsSPD, WIS: player.statsWIS,
      loadout,
    };

    // IA adversaire
    const aiLevel = Math.max(1, player.level + Math.floor(Math.random() * 5) - 2);
    const aiCharKey = CHARACTER_KEYS[Math.floor(Math.random() * CHARACTER_KEYS.length)];
    const aiChar = CHARACTERS[aiCharKey];
    const aiStats = computeStatsAtLevel(aiChar, aiLevel);
    const defender: Fighter = {
      id: 'ai_' + Date.now(),
      name: aiChar.name + ' (IA)',
      characterKey: aiCharKey,
      level: aiLevel,
      HP: aiStats.HP, maxHP: aiStats.HP,
      STR: aiStats.STR, AGI: aiStats.AGI,
      SPD: aiStats.SPD, WIS: aiStats.WIS,
      loadout: {},
      isAI: true,
    };

    // Simuler
    const result = simulateCombat(attacker, defender);
    const won = result.winnerId === player.id;

    // Mettre à jour le joueur
    const newXp = player.xp + result.xpGain;
    const newGold = player.gold + result.goldGain;
    const newStreak = won ? player.winStreak + 1 : 0;
    const newMatches = player.totalMatches + 1;
    const newCrits = player.critsTotal + result.critsThisFight;
    const newQuickWins = player.quickWins + (result.isQuickWin ? 1 : 0);

    // Level up
    let newLevel = player.level;
    let newStats = { HP: player.statsHP, STR: player.statsSTR, AGI: player.statsAGI, SPD: player.statsSPD, WIS: player.statsWIS };
    const char = CHARACTERS[player.characterKey as keyof typeof CHARACTERS];
    const xpForNextLevel = (l: number) => 50 + Math.floor(l * l * 8);
    while (newXp >= xpForNextLevel(newLevel) && newLevel < 50) {
      newLevel++;
      newStats.HP += char.statGainPerLevel.HP;
      newStats.STR += char.statGainPerLevel.STR;
      newStats.AGI += char.statGainPerLevel.AGI;
      newStats.SPD += char.statGainPerLevel.SPD;
      newStats.WIS += char.statGainPerLevel.WIS;
    }

    // Succès
    const unlockedAchievements = await prisma.mdfbAchievement.findMany({ where: { playerId: player.id } });
    const unlockedIds = unlockedAchievements.map(a => a.achievementId);
    const newUnlocked = checkAchievements({
      winStreak: newStreak,
      totalMatches: newMatches,
      critsTotal: newCrits,
      quickWins: newQuickWins,
      characterKey: player.characterKey,
      identityCounters: result.identityCounters,
      unlocked: unlockedIds,
    });

    // Créer coffres
    const chestsCreated = [];
    for (const achId of newUnlocked) {
      const ach = ACHIEVEMENTS.find(a => a.id === achId);
      if (ach) {
        await prisma.mdfbAchievement.create({ data: { playerId: player.id, achievementId: achId } });
        const chest = await prisma.mdfbChest.create({ data: { playerId: player.id, chestType: ach.reward } });
        chestsCreated.push(chest);
      }
    }

    // Sauvegarder
    await prisma.mdfbPlayer.update({
      where: { id: player.id },
      data: {
        xp: newXp, gold: newGold, level: newLevel,
        winStreak: newStreak, totalMatches: newMatches,
        critsTotal: newCrits, quickWins: newQuickWins,
        statsHP: newStats.HP, statsSTR: newStats.STR,
        statsAGI: newStats.AGI, statsSPD: newStats.SPD,
        statsWIS: newStats.WIS,
        identityCounters: result.identityCounters as Prisma.JsonObject,
      },
    });

    // Sauvegarder le combat
    await prisma.mdfbFight.create({
      data: {
        attackerId: player.id,
        winnerId: result.winnerId === player.id ? player.id : defender.id,
        turns: result.turns,
        events: result.events as Prisma.JsonArray,
        xpGain: result.xpGain,
        goldGain: result.goldGain,
        isQuickWin: result.isQuickWin,
      },
    });

    res.json({
      result,
      levelUp: newLevel > player.level,
      newLevel,
      newUnlocked,
      chestsCreated,
      gold: newGold,
      xp: newXp,
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

// POST /mdfb/chest/:chestId/open — ouvrir un coffre
export const openChest = async (req: Request, res: Response) => {
  try {
    const chest = await prisma.mdfbChest.findUnique({ where: { id: req.params.chestId } });
    if (!chest || chest.opened) return res.status(400).json({ error: 'Coffre invalide ou déjà ouvert' });

    const player = await prisma.mdfbPlayer.findUnique({ where: { id: chest.playerId } });
    if (!player) return res.status(404).json({ error: 'Joueur introuvable' });

    const CHEST_TABLES: Record<string, { rarity: string; weight: number }[]> = {
      BRONZE:   [{ rarity:'COMMON', weight:80 }, { rarity:'RARE', weight:20 }],
      SILVER:   [{ rarity:'RARE', weight:60 }, { rarity:'MAGIC', weight:35 }, { rarity:'MAJORRARE', weight:5 }],
      GOLD:     [{ rarity:'MAGIC', weight:60 }, { rarity:'MAJORRARE', weight:30 }, { rarity:'LEGENDARY', weight:10 }],
      PLATINUM: [{ rarity:'LEGENDARY', weight:100 }],
    };
    const PULLS: Record<string, number> = { BRONZE:1, SILVER:1, GOLD:2, PLATINUM:1 };

    const table = CHEST_TABLES[chest.chestType] || CHEST_TABLES.BRONZE;
    const pulls = PULLS[chest.chestType] || 1;
    const items = [];

    for (let i = 0; i < pulls; i++) {
      const total = table.reduce((s, t) => s + t.weight, 0);
      let roll = Math.random() * total;
      let rarity = table[table.length - 1].rarity;
      for (const { rarity: r, weight } of table) {
        roll -= weight;
        if (roll <= 0) { rarity = r; break; }
      }
      const def = pickItemByRarityForLevel(rarity as any, player.level);
      const inst = rollItemInstance(def, player.id);
      const saved = await prisma.mdfbItemInstance.create({
        data: { playerId: player.id, itemDefId: def.id, rolledStats: inst.rolled as Prisma.JsonObject },
      });
      items.push({ ...saved, def });
    }

    await prisma.mdfbChest.update({ where: { id: chest.id }, data: { opened: true, openedAt: new Date() } });
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

// POST /mdfb/equip — équiper un item
export const equipItem = async (req: Request, res: Response) => {
  try {
    const { instanceId, userId } = req.body;
    const player = await prisma.mdfbPlayer.findUnique({ where: { userId } });
    if (!player) return res.status(404).json({ error: 'Joueur introuvable' });

    const inst = await prisma.mdfbItemInstance.findUnique({ where: { id: instanceId } });
    if (!inst || inst.playerId !== player.id) return res.status(403).json({ error: 'Item invalide' });

    const def = getItemDef(inst.itemDefId);
    if (!def) return res.status(400).json({ error: 'Définition item introuvable' });
    if (player.level < def.levelMin) return res.status(400).json({ error: `Niveau ${def.levelMin} requis !` });

    // Déséquiper l'ancien item du même slot
    await prisma.mdfbItemInstance.updateMany({
      where: { playerId: player.id, equippedSlot: def.slot },
      data: { equippedSlot: null },
    });

    // Équiper le nouveau
    await prisma.mdfbItemInstance.update({
      where: { id: instanceId },
      data: { equippedSlot: def.slot },
    });

    res.json({ success: true, slot: def.slot, item: def });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
