import { Request, Response } from 'express';
import { MDFB_CHARACTERS, CHARACTER_KEYS, CharacterKey } from '@labrute/core';

export const getCharacters = (_req: Request, res: Response) => {
  res.json(Object.values(MDFB_CHARACTERS));
};

export const createPlayer = async (req: Request, res: Response) => {
  res.json({ message: 'createPlayer ok', body: req.body });
};

export const getPlayer = async (req: Request, res: Response) => {
  res.json({ message: 'getPlayer ok', userId: req.params.userId });
};

export const launchFight = async (_req: Request, res: Response) => {
  const keys: CharacterKey[] = [...CHARACTER_KEYS];
  const aiCharKey = keys[Math.floor(Math.random() * keys.length)];
  const aiChar = MDFB_CHARACTERS[aiCharKey];
  const won = Math.random() > 0.5;
  res.json({
    won,
    xpGain: won ? 20 : 8,
    goldGain: won ? 15 : 5,
    enemy: aiChar.name,
    message: won ? 'Victoire !' : 'Défaite...',
  });
};

export const openChest = async (req: Request, res: Response) => {
  res.json({ message: 'openChest ok', chestId: req.params.chestId });
};

export const equipItem = async (req: Request, res: Response) => {
  res.json({ message: 'equipItem ok', body: req.body });
};
