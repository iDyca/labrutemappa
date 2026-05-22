import { Request, Response } from 'express';
import { PrismaClient } from '@labrute/prisma';
import {
  MDFB_CHARACTERS,
  CHARACTER_KEYS,
  getCharacter,
  computeStatsAtLevel,
  getItemDef,
  MDFB_ACHIEVEMENTS,
  checkAchievements,
  openChestForLevel,
  rollItemInstance,
  simulateCombat,
  MDFB_SPELLS,
  getSpellDef,
  getSpellChoices,
  computeLevelFromXP,
  totalXPForLevel,
} from '@labrute/core';
import type { Fighter, ChestType } from '@labrute/core';

const MAX_PLAYERS_PER_ACCOUNT = 2;
const FIGHTS_PER_DAY = 15;
const OPPONENT_LEVEL_RANGE = 5;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayUTC(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function buildFighter(player: {
  id: string;
  characterKey: string;
  level: number;
  investedFORCE: number;
  investedAGILITE: number;
  investedINTELLIGENCE: number;
  investedCHANCE: number;
  itemInstances: Array<{ itemDefId: string; rolledStats: unknown; equippedSlot: string | null }>;
  equippedSpells: string[];
}): Fighter {
  const charKey = CHARACTER_KEYS.includes(player.characterKey as never)
    ? (player.characterKey as keyof typeof MDFB_CHARACTERS)
    : CHARACTER_KEYS[0]!;
  const char = getCharacter(charKey);
  const stats = computeStatsAtLevel(char, player.level, {
    FORCE: player.investedFORCE,
    AGILITE: player.investedAGILITE,
    INTELLIGENCE: player.investedINTELLIGENCE,
    CHANCE: player.investedCHANCE,
  });

  const loadout: Fighter['loadout'] = {};
  for (const inst of player.itemInstances) {
    if (!inst.equippedSlot) continue;
    const def = getItemDef(inst.itemDefId);
    if (!def) continue;
    loadout[inst.equippedSlot] = {
      defId: inst.itemDefId,
      rolled: inst.rolledStats as Record<string, number>,
      effect: def.effect,
    };
  }

  return {
    id: player.id,
    name: char.name,
    characterKey: charKey,
    level: player.level,
    HP: stats.HP,
    maxHP: stats.maxHP,
    FORCE: stats.FORCE,
    AGILITE: stats.AGILITE,
    INTELLIGENCE: stats.INTELLIGENCE,
    CHANCE: stats.CHANCE,
    loadout,
    equippedSpells: player.equippedSpells,
  };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export const getCharacters = (_req: Request, res: Response) => {
  res.json(Object.values(MDFB_CHARACTERS));
};

export const createPlayer = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { userId, characterKey } = req.body as { userId?: string; characterKey?: string };

  if (!userId || !characterKey) {
    res.status(400).json({ error: 'userId et characterKey requis' });
    return;
  }
  if (!CHARACTER_KEYS.includes(characterKey as never)) {
    res.status(400).json({ error: 'characterKey invalide' });
    return;
  }

  const existing = await prisma.mdfbPlayer.count({ where: { userId } });
  if (existing >= MAX_PLAYERS_PER_ACCOUNT) {
    res.status(409).json({ error: `Maximum ${MAX_PLAYERS_PER_ACCOUNT} personnages par compte` });
    return;
  }

  const player = await prisma.mdfbPlayer.create({
    data: { userId, characterKey, freePoints: 0 },
  });
  res.status(201).json(player);
};

export const getPlayer = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { playerId } = req.params;
  const player = await prisma.mdfbPlayer.findUnique({
    where: { id: playerId },
    include: { itemInstances: true, achievements: true, chests: { where: { opened: false } } },
  });
  if (!player) { res.status(404).json({ error: 'Player not found' }); return; }

  // Auto-reset daily fights at server read time
  const today = todayUTC();
  const lastDate = player.lastFightDate ? new Date(player.lastFightDate) : null;
  const isNewDay = !lastDate || lastDate.toDateString() !== today.toDateString();
  const fightsLeft = isNewDay ? FIGHTS_PER_DAY : player.fightsLeft;

  res.json({ ...player, fightsLeft });
};

export const getPlayersByUser = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { userId } = req.params;
  const players = await prisma.mdfbPlayer.findMany({
    where: { userId },
    include: {
      itemInstances: { where: { equippedSlot: { not: null } } },
      chests: { where: { opened: false } },
    },
  });
  res.json(players);
};

// List real players available to fight (PvP fantôme — aucun bot)
export const getOpponents = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { playerId } = req.params;
  const player = await prisma.mdfbPlayer.findUnique({ where: { id: playerId } });
  if (!player) { res.status(404).json({ error: 'Player not found' }); return; }

  const opponents = await prisma.mdfbPlayer.findMany({
    where: {
      id: { not: playerId },
      userId: { not: player.userId }, // on ne peut pas défier son propre 2e perso
      level: {
        gte: Math.max(1, player.level - OPPONENT_LEVEL_RANGE),
        lte: player.level + OPPONENT_LEVEL_RANGE,
      },
    },
    select: {
      id: true,
      characterKey: true,
      level: true,
      victories: true,
      totalMatches: true,
      winStreak: true,
    },
    take: 10,
  });

  res.json({ opponents, count: opponents.length });
};

export const launchFight = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { attackerId, defenderId } = req.body as { attackerId?: string; defenderId?: string };

  if (!attackerId || !defenderId) {
    res.status(400).json({ error: 'attackerId et defenderId requis' });
    return;
  }

  const [attacker, defender] = await Promise.all([
    prisma.mdfbPlayer.findUnique({
      where: { id: attackerId },
      include: { itemInstances: true, achievements: true },
    }),
    prisma.mdfbPlayer.findUnique({
      where: { id: defenderId },
      include: { itemInstances: true },
    }),
  ]);

  // NOTE: Prisma typings may not include unlockedSpells/equippedSpells yet if migration hasn't run.
  // We cast to any to safely access them.

  if (!attacker || !defender) {
    res.status(404).json({ error: 'Joueur introuvable' });
    return;
  }

  // Check & reset daily fights
  const today = todayUTC();
  const lastDate = attacker.lastFightDate ? new Date(attacker.lastFightDate) : null;
  const isNewDay = !lastDate || lastDate.toDateString() !== today.toDateString();
  const currentFightsLeft = isNewDay ? FIGHTS_PER_DAY : attacker.fightsLeft;

  if (currentFightsLeft <= 0) {
    res.status(429).json({ error: 'Plus de combats disponibles aujourd\'hui', fightsLeft: 0 });
    return;
  }

  // Simulate combat
  const attackerAny = attacker as typeof attacker & { equippedSpells?: string[]; unlockedSpells?: string[] };
  const defenderAny = defender as typeof defender & { equippedSpells?: string[] };
  const result = simulateCombat(
    buildFighter({ ...attacker, equippedSpells: attackerAny.equippedSpells ?? [] }),
    buildFighter({ ...defender, equippedSpells: defenderAny.equippedSpells ?? [] }),
  );
  const won = result.winnerId === attacker.id;
  const newStreak = won ? attacker.winStreak + 1 : 0;
  const newVictories = won ? attacker.victories + 1 : attacker.victories;

  // Merge per-fight identity counters INTO cumulative player counters
  const storedCounters = (attacker.identityCounters ?? {}) as Record<string, number>;
  const cumulativeCounters: Record<string, number> = { ...storedCounters };
  for (const [key, val] of Object.entries(result.identityCounters)) {
    cumulativeCounters[key] = (cumulativeCounters[key] ?? 0) + val;
  }

  const unlockedIds = attacker.achievements.map((a) => a.achievementId);
  const newAchievements = checkAchievements({
    winStreak: newStreak,
    totalMatches: attacker.totalMatches + 1,
    victories: newVictories,
    critsTotal: attacker.critsTotal + result.critsThisFight,
    quickWins: attacker.quickWins + (result.isQuickWin ? 1 : 0),
    characterKey: attacker.characterKey,
    identityCounters: cumulativeCounters,
    unlocked: unlockedIds,
  });

  // Compute level-up
  const newTotalXP = attacker.xp + result.xpGain;
  const newLevel = computeLevelFromXP(newTotalXP);
  const leveledUp = newLevel > attacker.level;
  const gainedLevels = leveledUp
    ? Array.from({ length: newLevel - attacker.level }, (_, i) => attacker.level + i + 1)
    : [];
  const spellMilestone = gainedLevels.find(lv => lv % 5 === 0) ?? null;
  const spellChoicesOnLevelUp = spellMilestone
    ? getSpellChoices(spellMilestone, attackerAny.unlockedSpells ?? [])
    : [];

  await prisma.$transaction(async (tx) => {
    await tx.mdfbPlayer.update({
      where: { id: attackerId },
      data: {
        xp: newTotalXP,
        level: newLevel,
        gold: { increment: result.goldGain },
        victories: newVictories,
        winStreak: newStreak,
        totalMatches: { increment: 1 },
        critsTotal: { increment: result.critsThisFight },
        quickWins: { increment: result.isQuickWin ? 1 : 0 },
        fightsLeft: currentFightsLeft - 1,
        lastFightDate: today,
        identityCounters: cumulativeCounters,
      },
    });

    await tx.mdfbFight.create({
      data: {
        attackerId,
        defenderId,
        winnerId: result.winnerId,
        turns: result.turns,
        events: result.events,
        xpGain: result.xpGain,
        goldGain: result.goldGain,
        isQuickWin: result.isQuickWin,
      },
    });

    for (const achId of newAchievements) {
      await tx.mdfbAchievement.create({
        data: { playerId: attackerId, achievementId: achId },
      });
      const achDef = MDFB_ACHIEVEMENTS.find((a) => a.id === achId);
      if (achDef) {
        await tx.mdfbChest.create({
          data: { playerId: attackerId, chestType: achDef.reward },
        });
      }
    }
  });

  res.json({
    result,
    won,
    fightsLeft: currentFightsLeft - 1,
    newAchievements,
    xpGain: result.xpGain,
    goldGain: result.goldGain,
    leveledUp,
    newLevel,
    spellMilestone,
    spellChoicesOnLevelUp,
  });
};

export const openChest = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { chestId } = req.params;
  const chest = await prisma.mdfbChest.findUnique({
    where: { id: chestId },
    include: { player: true },
  });
  if (!chest || chest.opened) {
    res.status(404).json({ error: 'Coffre introuvable ou déjà ouvert' });
    return;
  }

  const item = openChestForLevel(chest.chestType as ChestType, chest.player.level);
  const instance = rollItemInstance(item, chest.playerId);

  await prisma.$transaction([
    prisma.mdfbChest.update({
      where: { id: chestId },
      data: { opened: true, openedAt: new Date() },
    }),
    prisma.mdfbItemInstance.create({
      data: {
        id: instance.id,
        playerId: chest.playerId,
        itemDefId: instance.defId,
        rolledStats: instance.rolled,
      },
    }),
  ]);

  res.json({ item, instance });
};

export const equipItem = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { playerId, instanceId, slot } = req.body as {
    playerId?: string;
    instanceId?: string;
    slot?: string | null;
  };

  if (!playerId || !instanceId) {
    res.status(400).json({ error: 'playerId et instanceId requis' });
    return;
  }

  const inst = await prisma.mdfbItemInstance.findUnique({ where: { id: instanceId } });
  if (!inst || inst.playerId !== playerId) {
    res.status(404).json({ error: 'Item introuvable' });
    return;
  }

  // Déséquipe l'item déjà dans ce slot si on en équipe un nouveau
  if (slot) {
    await prisma.mdfbItemInstance.updateMany({
      where: { playerId, equippedSlot: slot },
      data: { equippedSlot: null },
    });
  }

  const updated = await prisma.mdfbItemInstance.update({
    where: { id: instanceId },
    data: { equippedSlot: slot ?? null },
  });

  res.json(updated);
};

// ─── Spell handlers ──────────────────────────────────────────────────────────

export const getSpells = (_req: Request, res: Response) => {
  res.json(MDFB_SPELLS);
};

export const getSpellChoicesForPlayer = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { playerId } = req.params;
  const player = await prisma.mdfbPlayer.findUnique({ where: { id: playerId } });
  if (!player) { res.status(404).json({ error: 'Player not found' }); return; }

  const playerAny = player as typeof player & { unlockedSpells?: string[] };
  const unlockedSpells = playerAny.unlockedSpells ?? [];
  const expectedChoices = Math.floor(player.level / 5);
  if (unlockedSpells.length >= expectedChoices) {
    res.json({ hasPendingChoice: false, choices: [] });
    return;
  }

  const milestone = (unlockedSpells.length + 1) * 5;
  const choices = getSpellChoices(milestone, unlockedSpells);
  res.json({ hasPendingChoice: true, milestone, choices });
};

export const chooseSpell = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { playerId } = req.params;
  const { spellId } = req.body as { spellId?: string };
  if (!spellId) { res.status(400).json({ error: 'spellId requis' }); return; }

  const player = await prisma.mdfbPlayer.findUnique({ where: { id: playerId } });
  if (!player) { res.status(404).json({ error: 'Player not found' }); return; }

  const playerAny = player as typeof player & { unlockedSpells?: string[] };
  const unlockedSpells = playerAny.unlockedSpells ?? [];
  const expectedChoices = Math.floor(player.level / 5);
  if (unlockedSpells.length >= expectedChoices) {
    res.status(400).json({ error: 'Pas de choix de sort disponible' }); return;
  }

  const spell = getSpellDef(spellId);
  if (!spell) { res.status(400).json({ error: 'Sort invalide' }); return; }
  if (spell.levelUnlock > player.level) { res.status(400).json({ error: 'Niveau insuffisant' }); return; }
  if (unlockedSpells.includes(spellId)) { res.status(400).json({ error: 'Sort déjà débloqué' }); return; }

  const updated = await (prisma.mdfbPlayer as unknown as { update: Function }).update({
    where: { id: playerId },
    data: { unlockedSpells: { push: spellId } },
  });
  res.json(updated);
};

export const manageEquippedSpell = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { playerId, spellId, action } = req.body as { playerId?: string; spellId?: string; action?: 'equip' | 'unequip' };
  if (!playerId || !spellId || !action) { res.status(400).json({ error: 'playerId, spellId et action requis' }); return; }

  const player = await prisma.mdfbPlayer.findUnique({ where: { id: playerId } });
  if (!player) { res.status(404).json({ error: 'Player not found' }); return; }

  const playerAny = player as typeof player & { unlockedSpells?: string[]; equippedSpells?: string[] };
  const unlockedSpells = playerAny.unlockedSpells ?? [];
  const equippedSpells = playerAny.equippedSpells ?? [];

  if (action === 'equip') {
    if (!unlockedSpells.includes(spellId)) {
      res.status(400).json({ error: 'Sort non débloqué' }); return;
    }
    if (equippedSpells.includes(spellId)) {
      res.status(400).json({ error: 'Sort déjà équipé' }); return;
    }
    if (equippedSpells.length >= 2) {
      res.status(400).json({ error: 'Maximum 2 sorts équipés' }); return;
    }
    const updated = await (prisma.mdfbPlayer as unknown as { update: Function }).update({
      where: { id: playerId },
      data: { equippedSpells: { push: spellId } },
    });
    res.json(updated);
  } else {
    const updated = await (prisma.mdfbPlayer as unknown as { update: Function }).update({
      where: { id: playerId },
      data: { equippedSpells: equippedSpells.filter((s: string) => s !== spellId) },
    });
    res.json(updated);
  }
};
