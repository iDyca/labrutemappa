/**
 * Mappadofuslabrute - 8 Playable Characters
 */

export enum CharacterClass {
    TIMMY = 'timmy',
    ANTOINE = 'antoine',
    ROBIN = 'robin',
    HUGO = 'hugo',
    MAIKO = 'maiko',
    PIERRE = 'pierre',
    ROMAIN = 'romain',
    PIERRELZ = 'pierrelz',
}

export type CharacterStats = {
    hp: number;
    strength: number;
    agility: number;
    speed: number;
};

export type CharacterDefinition = {
    class: CharacterClass;
    name: string;
    description: string;
    country: string;
    gender: 'male' | 'female';
    baseBody: string; // HEX string for body parts
    baseColors: string; // HEX string for colors
    stats: CharacterStats;
};

export const CHARACTERS: Record<CharacterClass, CharacterDefinition> = {
    [CharacterClass.TIMMY]: {
        class: CharacterClass.TIMMY,
        name: 'Timmy',
        description: 'A Belgian potato enthusiast who throws fries as weapons',
        country: 'Belgium',
        gender: 'male',
        baseBody: '02030304000', // Example body configuration
        baseColors: '0F9F4FFF0000FF0080FF00FFFF00',
        stats: {
            hp: 25,
            strength: 12,
            agility: 8,
            speed: 10,
        },
    },
    [CharacterClass.ANTOINE]: {
        class: CharacterClass.ANTOINE,
        name: 'Antoine',
        description: 'A tech geek with strategic abilities',
        country: 'France',
        gender: 'male',
        baseBody: '01030404000',
        baseColors: '1010FFFF0000FF0080FF00FFFF00',
        stats: {
            hp: 22,
            strength: 9,
            agility: 14,
            speed: 12,
        },
    },
    [CharacterClass.ROBIN]: {
        class: CharacterClass.ROBIN,
        name: 'Robin',
        description: 'An agile fighter with exceptional dexterity',
        country: 'France',
        gender: 'male',
        baseBody: '00020304000',
        baseColors: '2020FFFF0000FF0080FF00FFFF00',
        stats: {
            hp: 20,
            strength: 8,
            agility: 18,
            speed: 16,
        },
    },
    [CharacterClass.HUGO]: {
        class: CharacterClass.HUGO,
        name: 'Hugo',
        description: 'A businessman with leadership skills',
        country: 'Luxembourg',
        gender: 'male',
        baseBody: '03040505000',
        baseColors: '3030FFFF0000FF0080FF00FFFF00',
        stats: {
            hp: 28,
            strength: 15,
            agility: 9,
            speed: 9,
        },
    },
    [CharacterClass.MAIKO]: {
        class: CharacterClass.MAIKO,
        name: 'Maiko',
        description: 'A strategic master of tactics and balance',
        country: 'Japan',
        gender: 'female',
        baseBody: '01020203000',
        baseColors: 'FF00FFFF0000FF0080FF00FFFF00',
        stats: {
            hp: 23,
            strength: 10,
            agility: 12,
            speed: 14,
        },
    },
    [CharacterClass.PIERRE]: {
        class: CharacterClass.PIERRE,
        name: 'Pierre',
        description: 'A strong and sturdy fighter',
        country: 'France',
        gender: 'male',
        baseBody: '04050607000',
        baseColors: '8080FFFF0000FF0080FF00FFFF00',
        stats: {
            hp: 32,
            strength: 18,
            agility: 7,
            speed: 8,
        },
    },
    [CharacterClass.ROMAIN]: {
        class: CharacterClass.ROMAIN,
        name: 'Romain',
        description: 'An opportunist who adapts to any situation',
        country: 'France',
        gender: 'male',
        baseBody: '02030404100',
        baseColors: 'FF8080FF0000FF0080FF00FFFF00',
        stats: {
            hp: 24,
            strength: 11,
            agility: 13,
            speed: 13,
        },
    },
    [CharacterClass.PIERRELZ]: {
        class: CharacterClass.PIERRELZ,
        name: 'PierreLBZ',
        description: 'A stubborn fighter with unwavering determination',
        country: 'France',
        gender: 'male',
        baseBody: '03030505100',
        baseColors: 'FFFF80FF0000FF0080FF00FFFF00',
        stats: {
            hp: 26,
            strength: 14,
            agility: 10,
            speed: 11,
        },
    },
};

export const getCharacterByClass = (characterClass: CharacterClass): CharacterDefinition => {
    const character = CHARACTERS[characterClass];
    if (!character) {
        throw new Error(`Unknown character class: ${characterClass}`);
    }
    return character;
};

export const getAllCharacters = (): CharacterDefinition[] => {
    return Object.values(CHARACTERS);
};
