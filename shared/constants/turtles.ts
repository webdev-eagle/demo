export const Turtles = {
    WWWWXMAS: { name: 'XMAS TURTLE 2023', unique: true },
    WWEASTER: { name: 'EASTER TURTLE 2024', unique: true },
    AAAAAAAA: { name: 'Earthshield Protector' },
    BBBBBBBB: { name: 'Aquaflow Sentinel' },
    CCCCCCCC: { name: 'Flameheart Guardian' },
    DDDDDDDD: { name: 'Windwhisper Warden' },
    EEEEEEEE: { name: 'Arbor Shell Defender' },
    FFFFFFFF: { name: 'Aurelian Tortoisescale' },
    GGGGGGGG: { name: 'Glaciradiantus' },
    HHHHHHHH: { name: 'Plutortoise' },
    A: ['Ear', 'ths', 'hie', 'ld', ' ', 'Pro', 'tec', 'tor'],
    B: ['Aq', 'ua', 'fl', 'ow', ' ', 'Sent', 'in', 'el'],
    C: ['Fla', 'me', 'hea', 'rt', ' ', 'Gu', 'ard', 'ian'],
    D: ['Win', 'dwh', 'isp', 'er', ' ', 'War', 'de', 'n'],
    E: ['Ar', 'bor', ' She', 'll', ' ', 'Def', 'en', 'der'],
    F: ['Au', 're', 'li', 'an', ' ', 'Torto', 'ise', 'scale'],
    G: ['Gl', 'a', 'ci', 'ra', 'di', 'an', 't', 'us'],
    H: ['P', 'l', 'ut', 'or', 'to', 'i', 's', 'e'],
};

export const genesisTurtles = {
    A: {
        languageTag: 'marketplace.has_genes.earth',
    },
    B: {
        languageTag: 'marketplace.has_genes.aqua',
    },
    C: {
        languageTag: 'marketplace.has_genes.flame',
    },
    D: {
        languageTag: 'marketplace.has_genes.wind',
    },
    E: {
        languageTag: 'marketplace.has_genes.wood',
    },
    F: {
        languageTag: 'marketplace.has_genes.gold',
    },
    G: {
        languageTag: 'marketplace.has_genes.ice',
    },
    H: {
        languageTag: 'marketplace.has_genes.radiation',
    },
};

export const TURTLE_CURRENT_GENESIS = [
    //'DDDDDDDD',
    'EEEEEEEE',
    'FFFFFFFF',
    'GGGGGGGG',
    'HHHHHHHH',
];

export const TURTLE_COLORS = {
    R: 'b9b9b9',
    G: 'a2d07c',
    D: 'cc7373',
    S: 'e4cd82',
    U: 'E6D4EF',
};

export const TurtleColorNames = {
    B: 'Blue',
    R: 'Red',
    Y: 'Yellow',
    G: 'Green',
    J: 'Jackpot',
    U: 'Purple',
};

const TURTLE_GENERATIONS = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

export const TURTLE_GENERATION_NAMES: Record<
    (typeof TURTLE_GENERATIONS)[number],
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
