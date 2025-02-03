import type { Pagination } from '../api';
import type { Auction } from './auctions';
import type { CommonNft, Connection, Lock } from './common';

export interface Feline extends CommonNft {
    rarity: number;
    canBreed: boolean;
    offspring?: animalId;
    grownFrom?: animalId;
    name: `FELI-${string}-${string}`;
    type: 'FELI';
    issueNumber: number;
    achievements: string[];
    parents: animalId[];
    exists: boolean;
    auction: Auction;
    connections: Connection[];
    locks: Lock[];
    basePower?: number;
    farmingPower?: number;
}

export interface EnrichedFeline extends Feline {
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

export interface FelinesFilters extends Pagination {
    canBreed?: boolean;
}

export interface UserFelinesFilters extends Pagination {
    on?: addressId | addressId[];
    unlocked?: boolean;
    rentedByMe?: boolean;
}
