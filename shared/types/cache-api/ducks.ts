import type { Pagination } from '../api';
import type { Auction } from './auctions';
import type { CommonNft, Connection, Lock } from './common';

export interface Duck extends CommonNft {
    oldRarity: number;
    rarity: number;
    canBreed: boolean;
    offspring?: duckId;
    grownFrom?: ducklingId;
    name: `DUCK-${string}-${string}`;
    type: 'DUCK';
    issueNumber: number;
    achievements: string[];
    parents: duckId[];
    exists: boolean;
    auction: Auction;
    connections: Connection[];
    locks: Lock[];
    huntPower?: number;
    basePower?: number;
    veggBasePower?: number;
    farmingPower?: number;
    veggFarmingPower?: number;
    genotype?: string;
}

export interface EnrichedDuck extends Duck {
    eggProduction: string;
    farmingPower?: number;
    farmingParams: {
        estimatedFarmingPower?: number;
        globalFarmingPower: number;
        stakedBefore: boolean;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    };
}

export interface veggEnrichedDuck extends EnrichedDuck {
    veggFarmingParams?: {
        globalFarmingPower: number;
        stakedBefore: boolean;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    };
}

export interface DucksFilters extends Pagination {
    canBreed?: boolean;
}

export interface UserDucksFilters extends Pagination {
    on?: addressId | addressId[];
    unlocked?: boolean;
    rentedByMe?: boolean;
}
