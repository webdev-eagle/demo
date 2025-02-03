export enum AnimalPaths {
    DUCK = 'ducks',
    TURTLE = 'turtles',
    CANINE = 'canines',
    FELINE = 'felines',
    MUTANTS = 'mutants',
}

export enum StakingItemName {
    DUCK = 'perches',
    TURTLE = 'beaches',
    CANINE = 'dockings',
    FELINE = 'battlegrounds',
    MUTANTS = 'mutariums',
}

export const AnimalSubPaths: Record<AnimalPaths, { stakingItemPath: `/${AnimalPaths}/${StakingItemName}` }> = {
    [AnimalPaths.DUCK]: {
        stakingItemPath: `/${AnimalPaths.DUCK}/${StakingItemName.DUCK}`,
    },
    [AnimalPaths.TURTLE]: {
        stakingItemPath: `/${AnimalPaths.TURTLE}/${StakingItemName.TURTLE}`,
    },
    [AnimalPaths.CANINE]: {
        stakingItemPath: `/${AnimalPaths.CANINE}/${StakingItemName.CANINE}`,
    },
    [AnimalPaths.FELINE]: {
        stakingItemPath: `/${AnimalPaths.FELINE}/${StakingItemName.FELINE}`,
    },
    [AnimalPaths.MUTANTS]: {
        stakingItemPath: `/${AnimalPaths.MUTANTS}/${StakingItemName.MUTANTS}`,
    },
};

export type FileNames = 'image.svg' | 'back.svg' | 'front.svg' | 'styles.css';
