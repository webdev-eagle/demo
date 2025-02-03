export const Canines = {
    AAAAAAAA: { name: 'Bulldog Encryptor' },
    BBBBBBBB: { name: 'Shepherd Prototype' },
    CCCCCCCC: { name: 'Shiba Machina' },
    DDDDDDDD: { name: 'Chihuahua Cyclotron' },
    EEEEEEEE: { name: 'Beaglebyte Prime' },
    WWWWHWTF: { name: 'HWEEN Canine 2024', unique: true },
    A: ['Bu', 'll', 'dog', ' ', 'En', 'cr', 'yp', 'tor'],
    B: ['Sh', 'ep', 'he', 'rd', ' ', 'Pro', 'to', 'type'],
    C: ['S', 'hi', 'ba', ' ', 'Ma', 'c', 'hi', 'na'],
    D: ['Chi', 'hua', 'hua', ' ', 'Cy', 'clo', 'tr', 'on'],
    E: ['Be', 'a', 'gle', 'by', 'te', ' ', 'Pri', 'me'],
};

export const genesisCanines = {
    A: {
        languageTag: 'marketplace.has_genes.bulldog',
    },
    B: {
        languageTag: 'marketplace.has_genes.shepherd',
    },
    C: {
        languageTag: 'marketplace.has_genes.shiba',
    },
    D: {
        languageTag: 'marketplace.has_genes.chihuahua',
    },
    E: {
        languageTag: 'marketplace.has_genes.beaglebyte',
    },
};

export const CANINE_CURRENT_GENESIS = ['BBBBBBBB', 'CCCCCCCC', 'DDDDDDDD', 'EEEEEEEE'];

export const CANINE_COLORS = {
    A: 'd76660',
    B: 'a955eb',
    C: '319851',
    D: '52c5ff',
    U: 'E6D4EF',
};

export const CanineColorNames = {
    B: 'Blue',
    R: 'Red',
    Y: 'Yellow',
    G: 'Green',
    J: 'Jackpot',
    U: 'Purple',
};

const CANINE_GENERATIONS = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

export const CANINE_GENERATION_NAMES: Record<
    (typeof CANINE_GENERATIONS)[number],
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
