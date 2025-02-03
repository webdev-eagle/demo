import type { Pagination } from '../api';
import type { Auction } from './auctions';
import type { CommonNft, Connection, Lock } from './common';

export interface Turtle extends CommonNft {
    canBreed: boolean;
    offspring?: turtleId;
    name: `TRTL-${string}-${string}`;
    type: 'TRTL';
    issueNumber: number;
    achievements: string[];
    parents: turtleId[];
    exists: boolean;
    auction: Auction;
    connections: Connection[];
    locks: Lock[];
    basePower?: number;
}

export interface EnrichedTurtle extends Turtle {
    farmingParams: {
        globalFarmingPower: number;
        stakedBefore: boolean;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    };
}

export interface TurtlesFilters extends Pagination {
    canBreed?: boolean;
}

export interface UserTurtlesFilters extends Pagination {
    on?: addressId | addressId[];
    unlocked?: boolean;
    rentedByMe?: boolean;
}
