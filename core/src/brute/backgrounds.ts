/**
 * Mappadofuslabrute - Fight Backgrounds
 * Inspired by Dofus universe map environments
 */

export enum MapEnvironment {
    PRAIRIE = 'prairie',
    VILLAGE = 'village',
    FOREST = 'forest',
    CAVERN = 'cavern',
    BEACH = 'beach',
}

export type EnvironmentDefinition = {
    id: MapEnvironment;
    name: string;
    description: string;
    spriteUrl: string;
    ambiance: string; // Audio ambiance key
};

export const ENVIRONMENTS: Record<MapEnvironment, EnvironmentDefinition> = {
    [MapEnvironment.PRAIRIE]: {
        id: MapEnvironment.PRAIRIE,
        name: 'Prairie',
        description: 'A peaceful grassland with gentle rolling hills',
        spriteUrl: '/assets/backgrounds/prairie.png',
        ambiance: 'ambiance_prairie',
    },
    [MapEnvironment.VILLAGE]: {
        id: MapEnvironment.VILLAGE,
        name: 'Village',
        description: 'A quiet village with wooden houses',
        spriteUrl: '/assets/backgrounds/village.png',
        ambiance: 'ambiance_village',
    },
    [MapEnvironment.FOREST]: {
        id: MapEnvironment.FOREST,
        name: 'Forêt',
        description: 'A dense ancient forest full of mystery',
        spriteUrl: '/assets/backgrounds/forest.png',
        ambiance: 'ambiance_forest',
    },
    [MapEnvironment.CAVERN]: {
        id: MapEnvironment.CAVERN,
        name: 'Caverne',
        description: 'A dark underground cavern with crystalline formations',
        spriteUrl: '/assets/backgrounds/cavern.png',
        ambiance: 'ambiance_cavern',
    },
    [MapEnvironment.BEACH]: {
        id: MapEnvironment.BEACH,
        name: 'Plage',
        description: 'A sunny beach with crystal clear waters',
        spriteUrl: '/assets/backgrounds/beach.png',
        ambiance: 'ambiance_beach',
    },
};

export const getRandomEnvironment = (): MapEnvironment => {
    const backgroundList: MapEnvironment[] = [
        MapEnvironment.PRAIRIE,
        MapEnvironment.VILLAGE,
        MapEnvironment.FOREST,
        MapEnvironment.CAVERN,
        MapEnvironment.BEACH,
    ];
    return backgroundList[Math.floor(Math.random() * backgroundList.length)] as MapEnvironment;
};

export const getEnvironmentDefinition = (environment: MapEnvironment): EnvironmentDefinition => {
    return ENVIRONMENTS[environment];
};

export const getAllEnvironments = (): EnvironmentDefinition[] => {
    return Object.values(ENVIRONMENTS);
};
