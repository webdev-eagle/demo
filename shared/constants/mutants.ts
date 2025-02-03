export const MUTANT_COLORS = {
    A: '043710',
    B: '580b3c',
    C: '113c70',
    D: '5a1212',
    G: 'cb860f',
    U: 'E6D4EF',
};

export const MutantColorNames = {
    A: 'Green',
    B: 'Gray',
    C: 'Cyan',
    D: 'Red',
    G: 'Gold',
    Y: 'Yellow',
    J: 'Jackpot',
    U: 'Purple',
};

const MUTANT_GENERATIONS = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

export const MUTANT_GENERATION_NAMES: Record<
    (typeof MUTANT_GENERATIONS)[number],
    { name: string; number: number; color: string }
> = {
    G: {
        name: 'Genesis',
        number: 1,
        color: 'bg-inverse',
    },
} as const;

export const MutariumProb = { A: 26, B: 22, C: 22, D: 20, G: 10 };
