-- CreateEnum
CREATE TYPE "CharacterClass" AS ENUM ('timmy', 'antoine', 'robin', 'hugo', 'maiko', 'pierre', 'romain', 'pierrelz');

-- AlterTable
ALTER TABLE "Brute" ADD COLUMN "characterClass" "CharacterClass",
ADD COLUMN "consecutiveVictories" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "bronzeChests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "silverChests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "goldChests" INTEGER NOT NULL DEFAULT 0;

-- Add index for character class lookups
CREATE INDEX "Brute_characterClass_idx" ON "Brute"("characterClass");
