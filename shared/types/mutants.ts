import { AssetDetails } from './assets';
import { AuctionDetails } from './auctions';
import { IFarmParamsMutant } from './farms';
import { MutantAchievements } from './scan';

export interface BreedingMutantParams {
    txId: txId;
    address: addressId;
    animalId: string;
    finishHeight: blocksHeight;
    status: 'BREEDING_STARTED' | 'BREEDING_FINISHED';
}

export interface IMuntantBreedingPrice {
    eggPrice: number;
    spicePrice: number;
}

export interface IWorldStatus {
    inHunt: boolean;
    inWars: boolean;
}

export interface IStatus {
    onFarming: boolean;
    onXmasStable: boolean;
    stakedOnDuckHouse: boolean;
    onSale: boolean;
}

export interface IMarketplaceParams {
    gameUnlockTime?: number;
}

export interface IExchangeStatus {
    inRental: boolean;
    inMarketplace: boolean;
}
export interface IFarmingParams {
    withdrawnAmount?: number;
    farmingPower?: number;
    lastCheckFarmedAmount?: number;
    globalFarmingPower?: number;
    stakedBefore?: boolean;
    toClaim?: number;
    claimed?: number;
}

export interface IMutantDetails {
    assetId: string;
    name: string;
    mutariumColor?: string;
    assetDetails: AssetDetails;
    achievements?: MutantAchievements;
    inWorlds?: IWorldStatus;
    status: IStatus;
    farmingData?: IFarmParamsMutant[];
    exchangeStatus?: IExchangeStatus;
    auction?: AuctionDetails;
    rarity?: number;
    issueNumber?: number;
    farmingPower?: number;
    generation?: string;
    canBreed?: boolean;
    genotype?: string;
    color?: string;
}

export interface IMutantDetailsV2 {
    assetId: string;
    oldRarity: number;
    canBreed: boolean;
    parents: string[];
    issueNumber: number;
    achievements: string[];
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
    basePower?: number;
    farmingPower?: number;
    farmingParams: {
        estimatedFarmingPower?: number;
        stakedBefore: boolean;
        EGG: MutantAssetsFarmingParams;
        VEGG: MutantAssetsFarmingParams;
        SPICE: MutantAssetsFarmingParams;
        FEED: MutantAssetsFarmingParams;
    };
    eggProduction?: string;
}

export interface IMutantDetailsLocked extends IMutantDetailsV2 {
    onFarming?: boolean;
    onSale?: boolean;
}

export interface MutantAssetsFarmingParams {
    globalFarmingPower: number;
    toClaim: number;
    globalInterest: number;
    assetInterest: number;
    claimed: number;
}

export interface IMutantParamsFromGenotype {
    genoType: string;
    generation: string;
    color: string;
    mutantInfo: {
        image: string;
        name: string;
    };
    fullColor: string;
    generationName: string;
    bgColor: string;
    fullColorName: string;
    generationNumber: string;
}

export interface PossibleMutant {
    name: string;
    issuer: addressId;
    genotype: string;
    probability: number;
    rarity?: number;
}

export type TTagsMutantData = {
    assetDetails?: AssetDetails;
    bgColor?: string;
    canBreed?: boolean;
    mutantNumber?: number | null;
    generationName?: string;
    generationNumber?: string;
    name?: string;
    farmingPower?: number;
    farmingColor?: string;
    withoutGeneration?: boolean;
};
