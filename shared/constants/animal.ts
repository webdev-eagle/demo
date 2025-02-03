import { CANINE_COLORS } from './canines';
import { DUCK_COLORS } from './ducks';
import { FELINE_COLORS } from './felines';
import { MUTANT_COLORS } from './mutants';
import { TURTLE_COLORS } from './turtles';

const ANIMAL_GENERATIONS = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

export const ANIMAL_GENERATION_NAMES: Record<
    (typeof ANIMAL_GENERATIONS)[number],
    { name: string; number: number; color: string }
> = {
    H: {
        name: 'Hero',
        number: 2,
        color: 'bg-pink',
    },
    I: {
        name: 'Ideal',
        number: 3,
        color: 'bg-info',
    },
    J: {
        name: 'Jackpot',
        number: 0,
        color: 'bg-green',
    },
    K: {
        name: 'Knight',
        number: 4,
        color: 'bg-purple',
    },
    L: {
        name: 'Lord',
        number: 5,
        color: 'bg-primary',
    },
    M: {
        name: 'Magical',
        number: 6,
        color: 'bg-green',
    },
    N: {
        name: 'Natural',
        number: 7,
        color: 'bg-pink',
    },
    O: {
        name: 'Obstinate',
        number: 8,
        color: 'bg-purple',
    },
    G: {
        name: 'Genesis',
        number: 1,
        color: 'bg-inverse',
    },
} as const;

// animalType should have the same value that AnimalType enum from types/animals.
export const ANIMAL_PROPERTIES = [
    {
        colors: DUCK_COLORS,
        stakingItem: 'perches',
        animalType: 'DUCK',
    },
    {
        colors: TURTLE_COLORS,
        stakingItem: 'beaches',
        animalType: 'TURTLE',
    },
    {
        colors: CANINE_COLORS,
        stakingItem: 'dockings',
        animalType: 'CANINE',
    },
    {
        colors: FELINE_COLORS,
        stakingItem: 'battlegrounds',
        animalType: 'FELINE',
    },
    {
        colors: MUTANT_COLORS,
        stakingItem: 'mutarium',
        animalType: 'MUTANT',
    },
];
