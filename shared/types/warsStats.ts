export interface OracleName {
    type: string;
    key: string;
    value: string;
}

export interface Lap {
    _id: string;
    startDate: Date;
    endDate: Date;
    base: Number;
    budget: Number;
    coefficient: Number;
    subSum: Number;
    wins: Number;
    farmsStats: Record<string, LapItem>;

    getId: () => string;
}

export interface LapItem {
    players: Number;
    earned: Number;
    games: Number;
    wins: Number;
    ducksCount?: number;
    name?: string;
    shareTokensConverted: Boolean;
    shareTokensDistributed: Boolean;
}

export interface ObjLapItem {
    id: string;
    stats: LapItem;
}

export interface Player {
    address: string;
    farm?: string;
    farmContract: string;
    earned: number;
    calculatedReward: number;
    draws: number;
    wins: number;
    loses: number;
}
