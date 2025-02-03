import type { Pagination } from '../api';
import type { CommonNft } from './common';

export interface FaultyDuckling {
    _id: string;
    ducklings: string[];
}
export interface Duckling extends CommonNft {
    name: `BABY-${string}-${string}`;
    type: 'DUCKLING';
    generation: string;
    level: integer;
    growth: number;
    grown: boolean;
    grownInto?: duckId;
    fedSpice?: integer;
    feedNeeded: integer;
    blacklisted: boolean;
    startPercentage?: integer;
    issuedByFeedCall: boolean;
}

export interface UserDucklingsFilters extends Pagination {}
