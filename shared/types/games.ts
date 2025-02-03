import type { WarsStage } from '../enums';
import type { IFarmType } from './farms';
import type { GameplayPlayerDuck } from './gameplays';

export interface IInGameNumbersData {
    EGGToUsdtRate: string;
    collectiveFarmsInvestors: string;
    monthlySales: string;
    playersCount: string;
    pvpCount: string;
}

export interface IInGameNumbers {
    title: string;
    description: string;
    imgSrc?: string;
    subTitle?: string;
}

export interface IPlayerState {
    ducksCount: number;
    autoSelectFarm: string;
    rentedDuck: IDuckType;
}

export interface IDuckStats {
    draw: number;
    wins: number;
    loses: number;
    games: number;
    earned: number;
    winsFactor?: number;
    selectedFarm?: string;
    calculatedReward?: number;
}

export interface IDuckType extends GameplayPlayerDuck {
    _id?: any;
    isActive: boolean; // in game
    owner: string; // address
    lvl: number;
    rarity: number;
    issueHeight: number;
    farmContract: string; // farm address
    stats: { [key: string]: IDuckStats };
    rentedBy: Array<{ address: string; at: number }>;
    changeFarmAt?: number;
    selectFarmContract?: string;
}

export interface IDuckTypeExtended extends IDuckType {
    backgroundColor?: string;
    backgroundImage?: string;
}

export interface IDucksStatsItem extends IDuckStats {
    _id: string;
    name: string;
    lvl: number;
    assetId: string;
}

export interface WarsFarmsStats {
    players: number;
    wins: number;
    games: number;
    earned: number;
    ducksCount: number;
}

export interface WarsState {
    _id: string;
    ftue: boolean; // First time ux
    slug: string;
    stage: WarsStage;
    error: string;
    server: string;
    playerId: string;
    opponentId: string;
    duck: null | IDuckType;
    text: string;
    caption: string;
    farm: null | IFarmType;
    farms: null | IFarmType[];
    farmsStats: { [key: string]: WarsFarmsStats };
    leaderboard: null | any[];
    endDate: number;
    outcome: null | { isWin: boolean; winner: string; winnerEarned: number };
    gameStats: {
        playersCount: number;
    };
    playersStats: {
        wins: number;
        loses: number;
        draws: number;
        position: number;
        earned: number;
        winsFactor: number;
    };
    base: number;
    coefficient: number;
    subSum: number;
    budget: number;
    wins: number;
    winsFactor: number;
    poolWinsFactor: number;
}

export interface ILapRewards {
    lapId: string;
    startDate: string;
    rewards: number;
    fed?: number;
    number?: number;
    feedActions?: Array<any>;
}

export interface ILapFedData {
    date: Date;
    ts: number;
    fed: number;
    amount: number;
}

export interface IDuckWarsStats {
    _id: string;
    stats: Record<
        string,
        {
            earned: number;
            games: number;
            selectedFarm: string;
            wins: number;
        }
    >;
}

export interface IGameType {
    isActive: boolean;
    slug: string;
    title: string;
    prize: string;
    startDate: string;
    endDate: string;
    text: string;
    caption: string;
    farmsStats: {
        [key: string]: FarmStats;
    };
    wins: number;
    winsFactor: number;
    winsFactors: { [key: number]: number };
    base: number;
    subSum: number;
    budget: number;
    coefficient: number;
}

export interface FarmStats {
    players: number;
    games: number;
    wins: number;
    earned: number;
    ducksCount: number;
    shareTokensConverted: boolean;
    shareTokensDistributed: boolean;
}

export type WarsArtefactLevels = Record<artefactId, { invested: number; level: number }>;

export type WarsArtefactDetails = {
    id: itemId;
    status: 'FREE' | 'OCCUPIED';
    type: 'mantle';
    invested: number;
    level: number;
};
