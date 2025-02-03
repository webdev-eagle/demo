import type { AssetDetails } from './assets';

export interface DucklingParams {
    level: number;
    blacklisted: boolean;
}

/**
 * @deprecated
 */
export interface IDuckling extends AssetDetails, DucklingParams {
    id: string;
    owner: string;
    name: string;
    pictureUrl: string;
}

export interface FaultyDuckling {
    _id: string;
    ducklings: string[];
}

export interface IWithLevel {
    level: number;
}

export interface Duckling {
    assetId: assetId;
    issueHeight: integer;
    issuer: addressId;
    createdAt: string;
    originTransactionId: txId;
    name: `BABY-${string}-${string}`;
    type: 'DUCKLING';
    owner: addressId;
    givenName: string;
    description: string;
    generation: string;
    picture: string;
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
