import { Request, Response } from 'express';
import { CHARACTERS, CHARACTER_KEYS } from '@labrute/core';

// GET /api/mdfb/characters
export const getCharacters = (_req: Request, res: Response) => {
  res.json(Object.values(CHARACTERS));
};

// POST /api/mdfb/player
export const createPlayer = async (req: Request, res: Response) => {
  res.json({ message: 'createPlayer ok', body: req.body });
};

// GET /api/mdfb/player/:userId
export const getPlayer = async (req: Request, res: Response) => {
  res.json({ message: 'getPlayer ok', userId: req.params.userId });
};

// POST /api/mdfb/fight
export const launchFight = async (req: Request, res: Response) => {
  const aiCharKey = CHARACTER_KEYS[Math.floor(Math.random() * CHARACTER_KEYS.length)];
  const aiChar = CHARACTERS[aiCharKey];
  const won = Math.random() > 0.5;
  res.json({
    won,
    xpGain: won ? 20 : 8,
    goldGain: won ? 15 : 5,
    enemy: aiChar.name,
    message: won ? 'Victoire !' : 'Défaite...',
  });
};

// POST /api/mdfb/chest/:chestId/open
export const openChest = async (req: Request, res: Response) => {
  res.json({ message: 'openChest ok', chestId: req.params.chestId });
};

// POST /api/mdfb/equip
export const equipItem = async (req: Request, res: Response) => {
  res.json({ message: 'equipItem ok', body: req.body });
};
