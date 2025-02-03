export const Felines = {
    AAAAAAAA: { name: 'Caracol Knight' },
    BBBBBBBB: { name: 'Lynx Squire' },
    CCCCCCCC: { name: 'Cat Peasant' },
    DDDDDDDD: { name: 'Tiger Baron' },
    A: ['Ca', 'ra', 'c', 'ol', ' ', 'Kn', 'ig', 'ht'],
    B: ['L', 'y', 'nx', '', 'Sq', 'ui', 'r', 'e'],
    C: ['C', 'a', 't', ' ', 'Pe', 'a', 'sa', 'nt'],
    D: ['T', 'i', 'g', 'er', ' ', 'Ba', 'r', 'on'],
};

export const FELINE_CURRENT_GENESIS = ['AAAAAAAA', 'BBBBBBBB', 'CCCCCCCC', 'DDDDDDDD'];

export const genesisFelines = {
    A: {
        languageTag: 'marketplace.has_genes.caracol',
    },
    B: {
        languageTag: 'marketplace.has_genes.lynx',
    },
    C: {
        languageTag: 'marketplace.has_genes.cat',
    },
    D: {
        languageTag: 'marketplace.has_genes.tiger',
    },
};

export const FELINE_COLORS = {
    A: '0071F7',
    B: '2FEBC4',
    C: 'F5F05C',
    D: 'AAED64',
    U: 'E6D4EF',
};

export const FelineColorNames = {
    B: 'Blue',
    R: 'Red',
    Y: 'Yellow',
    G: 'Green',
    J: 'Jackpot',
    U: 'Purple',
};

const FELINE_GENERATIONS = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

export const FELINE_GENERATION_NAMES: Record<
    (typeof FELINE_GENERATIONS)[number],
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
