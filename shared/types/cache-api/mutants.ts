import { Pagination } from '../api';
import { Auction } from './auctions';
import { CommonNft, Connection, Lock } from './common';

export interface Mutant extends CommonNft {
    oldRarity: number;
    rarity: number;
    canBreed: boolean;
    offspring?: string;
    name: `MTNT-${string}`;
    type: 'MTNT';
    description: string;
    issueNumber: number;
    achievements: string[];
    parents: string[];
    exists: boolean;
    auction: Auction;
    connections: Connection[];
    locks: Lock[];
    basePower?: number;
    farmingPower?: number;
}

export interface EnrichedMutant extends Mutant {
    farmingParams: {
        estimatedFarmingPower?: number;
        stakedBefore: boolean;
        EGG: MutantAssetsFarmingParams;
        VEGG: MutantAssetsFarmingParams;
        SPICE: MutantAssetsFarmingParams;
        FEED: MutantAssetsFarmingParams;
    };
}

export interface MutantAssetsFarmingParams {
    globalFarmingPower: number;
    toClaim: number;
    globalInterest: number;
    assetInterest: number;
    claimed: number;
}
export interface UserMutantsFilters extends Pagination {
    on?: addressId | addressId[];
    unlocked?: boolean;
    rentedByMe?: boolean;
}
