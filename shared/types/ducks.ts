import { IFarmingParamsV3 } from '$shared/types/farms';
import type { ArtefactType } from './artefacts';
import type { IAsset, Nft } from './assets';
import type { AuctionDetails, WithBids } from './auctions';
import type { RopeStatusEnum } from './hunt';
import type { DuckAchievements } from './scan';

export interface WithAchievements {
    achievements: DuckAchievements;
}

export interface IDuckParameters {
    genoType: string;
    generation: string;
    color: string;
    duckDetails: {
        name: string;
        image: string;
    };
    fullColor: string;
    generationName: string;
    bgColor: string;
    fullColorName: string;
    generationNumber: string;
}

export type TArtefacts = {
    mantle?: {
        id: string;
        level: number;
    };
};

export interface DuckConnection {
    duckId: string;
    assetId: string;
    type: string;
    item: Nft;
}

/**
 * @deprecated
 */
export interface IDuckDetails extends IAsset {
    canBreed?: boolean;
    eggSell?: boolean;
    inWars?: boolean;
    lockedInGame?: boolean;
    onFarmingVegg?: boolean;
    onXmasStable?: boolean;
    onSale?: boolean;
    artefacts?: TArtefacts;
    auctionId?: string;
    eggProduction?: string;
    farmingParams?: {
        withdrawnAmount?: number;
        farmingPower?: number;
        lastCheckFarmedAmount?: number;
        globalFarmingPower?: number;
        stakedBefore?: boolean;
        toClaim?: number;
        claimed?: number;
    };
    veggFarmingParams?: {
        farmingPower: number;
        globalFarmingPower: number;
        stakedBefore: boolean;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    };
    gameUnlockTime?: number;
    instantPrice?: number;
    name: string;
    owner?: string;
    perchColor?: string;
    rarity?: number;
    duckHouseType?: ArtefactType;
    stakedOnDuckHouse?: assetId;
    startPrice?: number;
    toClaim?: number;
    inRental?: boolean;
    status?: string;
    achievements?: DuckAchievements;
    oldRarity?: number;
}

/**
 * @deprecated
 */
export interface IDucksDetails {
    assetId: string;
    issueHeight: number;
    issueTimestamp: number;
    issuer: string;
    onFarmingVegg?: boolean;
    onXmasStable?: boolean;
    issuerPublicKey: string;
    name: string;
    description: string;
    decimals: number;
    reissuable: boolean;
    quantity: number;
    scripted: boolean;
    minSponsoredAssetFee: any;
    originTransactionId: string;
    type: string;
    id: string;
    owner: string;
    title: string;
    onSale: boolean;
    isArtefact: boolean;
    toClaim?: number;
    auctionId?: string;
    auction?: AuctionDetails & WithBids;
}

//Used for V2 calls like /v2/address/{address}/ducks
export interface IDuckDetailsV2 {
    assetId: string;
    oldRarity: number;
    rarity: number;
    canBreed: boolean;
    offspring: string | null;
    parents: string[];
    issueNumber: number;
    achievements: string[];
    grownFrom: string | null;
    genotype: string;
    issueHeight: number;
    createdAt: string;
    issuer: string;
    name: string;
    originTransactionId: string;
    type: string;
    owner: string;
    exists: boolean;
    connections: any[];
    locks: any[];
    farmingParams?: {
        withdrawnAmount?: number;
        estimatedFarmingPower?: number;
        lastCheckFarmedAmount?: number;
        globalFarmingPower?: number;
        stakedBefore?: boolean;
        toClaim?: number;
        claimed?: number;
    };
    veggFarmingParams?: {
        globalFarmingPower: number;
        stakedBefore: boolean;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    };
    farmingPower?: number;
    veggFarmingPower?: number;
    eggProduction?: string;
    basePower?: number;
    veggBasePower?: number;
}
export interface IDuckDetailsLocked extends IDuckDetailsV2 {
    onFarming?: boolean;
    onFarmingVegg?: boolean;
    onSale?: boolean;
    // TODO: check if rental is correct
    inRental?: boolean;
    inWars?: boolean;
    // TODO: hunt does not appear to be correct in locks?
    inHunt?: boolean;
}

export interface IDuckMarketplaceDetails {
    assetId: string;
    rarity: number;
    canBreed: boolean;
    offspring: string | null;
    issueNumber: number;
    achievements: string[];
    genotype: string;
    name: string;
    owner: string;
    connections: DuckConnection[];
    farmingParams?: {
        withdrawnAmount?: number;
        estimatedFarmingPower?: number;
        lastCheckFarmedAmount?: number;
        globalFarmingPower?: number;
        stakedBefore?: boolean;
        toClaim?: number;
        claimed?: number;
    };
    farmingPower?: number;
    eggProduction?: string;
    basePower?: number;
}

export interface HatchingDuckParams {
    txId: txId;
    address: addressId;
    duckId: duckId;
    finishHeight: blocksHeight;
    status: 'HATCHING_STARTED' | 'HATCHING_FINISHED';
}

export interface IDuckParamsFromGenotype {
    genoType: string;
    generation: string;
    color: string;
    duckDetails: {
        image: string;
        name: string;
    };
    fullColor: string;
    generationName: string;
    bgColor: string;
    fullColorName: string;
    generationNumber: string;
}

export interface PossibleDuck {
    name: string;
    issuer: addressId;
    genotype: string;
    probability: number;
    assetId: string;
}

export interface WithRarityParams {
    ducksWithSameGenes?: number;
    animalsWithSameGenes?: number;
    rarity: number;
    farmingParams?: IFarmingParamsV3;
    globalFarmingPower?: number;
    eggProduction: string;
}

export interface WithFertility {
    canBreed?: boolean;
}

export interface DuckProps {
    assetId: duckId;
    oldRarity: number;
    rarity: number;
    canBreed: boolean;
    issueNumber: number;
    achievements: string[];
    offspring?: duckId | ducklingId;
    parents?: duckId[];
    grownFrom?: ducklingId;
}

export enum Season {
    SPRING,
    SUMMER,
    AUTUMN,
    WINTER,
}

export interface IBonusses {
    pet?: string;
    duckId?: string;
    additionalCapacity: number;
    additionalLimit: number;
    additionalRangePinguin: number;
    additionalRangeSledge: number;
    additionalRangeBunny: number;
    additionalSteal: number;
    easterEggCatchBonus: number;
    season?: Season;
    seasonBonus?: number;
}

export interface IPets {
    pets: IBonusses[];
    bonusses: IBonusses;
}

export interface IRopeEggPriceWithSignature {
    ropePrice: integer;
    distance: integer;
    signature: string;
    ropeStatus: RopeStatusEnum;
}

export interface IDuckUnstackRequestResponse {
    signature: string;
}

export interface IUnstakeDuckSignature {
    signature: string;
    timestamp: integer;
}
