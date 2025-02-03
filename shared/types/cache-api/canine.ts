import type { Pagination } from '../api';
import type { Auction } from './auctions';
import type { CommonNft, Connection, Lock } from './common';

export interface Canine extends CommonNft {
    rarity: number;
    canBreed: boolean;
    offspring?: animalId;
    grownFrom?: animalId;
    name: `CANI-${string}-${string}`;
    type: 'CANI';
    issueNumber: number;
    achievements: string[];
    parents: animalId[];
    exists: boolean;
    auction: Auction;
    connections: Connection[];
    locks: Lock[];
    basePower?: number;
}

export interface EnrichedCanine extends Canine {
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
export interface CaninesFilters extends Pagination {
    canBreed?: boolean;
}

export interface UserCaninesFilters extends Pagination {
    on?: addressId | addressId[];
    unlocked?: boolean;
    rentedByMe?: boolean;
}
