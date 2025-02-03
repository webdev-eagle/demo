import { getAddress } from '$shared/domain/constants';
import { Nft } from './assets';

export type ContractAnimalType = 'duck' | 'turtle' | 'mutant' | 'cani' | 'felines';

export enum AnimalBreedingDataMatch {
    DUCK = 'duckling',
    TURTLE = 'turtle',
    CANINE = 'canine',
    FELINE = 'feline',
}

type AnimalTypeAcronyms = 'DUCK' | 'TRTL' | 'CANI' | 'FELI' | 'MTNT';

export interface HatchingAnimalsParams {
    txId: txId;
    address: addressId;
    animalId: animalId;
    finishHeight: blocksHeight;
    status: 'HATCHING_STARTED' | 'HATCHING_FINISHED';
}

export enum AnimalType {
    DUCKS = 'DUCK',
    TURTLES = 'TURTLE',
    MUTANTS = 'MUTANT',
    CANINES = 'CANINE',
    FELINES = 'FELINE',
}

type AnimalTypeProps = {
    acronym: AnimalTypeAcronyms;
    dapp: string;
    sc_call: ContractAnimalType;
    farmingAsset: string;
};

export interface AnimalProps {
    assetId: animalId;
    rarity: number;
    canBreed: boolean;
    issueNumber: number;
    achievements: string[];
    offspring?: animalId;
    parents?: animalId[];
    grownFrom?: animalId;
}

export const AnimalCalls: Record<AnimalType, AnimalTypeProps> = {
    [AnimalType.DUCKS]: {
        acronym: 'DUCK',
        dapp: getAddress('DUCK_INCUBATOR_DAPP'),
        sc_call: 'duck',
        farmingAsset: 'EGG',
    },
    [AnimalType.TURTLES]: {
        acronym: 'TRTL',
        dapp: getAddress('TURTLES_INCUBATOR_DAPP'),
        sc_call: 'turtle',
        farmingAsset: 'SPICE',
    },
    [AnimalType.MUTANTS]: {
        acronym: 'MTNT',
        dapp: getAddress('MUTANTS_BREEDER_DAPP'),
        sc_call: 'mutant',
        farmingAsset: 'EGG',
    },
    [AnimalType.CANINES]: {
        acronym: 'CANI',
        dapp: getAddress('CANINES_INCUBATOR_DAPP'),
        sc_call: 'cani',
        farmingAsset: 'WAVES',
    },
    [AnimalType.FELINES]: {
        acronym: 'FELI',
        dapp: getAddress('FELINES_INCUBATOR_DAPP'),
        sc_call: 'felines',
        farmingAsset: 'PETE',
    },
};

export interface AnimalConnection {
    animalId: string;
    assetId: string;
    type: string;
    item: Nft;
}

/** @deprecated */
export interface IAnimalDetails {
    assetId: string;
    issueHeight: number;
    issueTimestamp: number;
    createdAt: Date;
    issuer: string;
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
    auction?: AnimalDetailsAuction;
    onFarming?: boolean;
    canBreed?: boolean;
    eggSell?: boolean;
    eggProduction?: string;
    basePower?: number;
    farmingParams?: {
        withdrawnAmount?: number;
        farmingPower?: number;
        lastCheckFarmedAmount?: number;
        globalFarmingPower?: number;
        stakedBefore?: boolean;
        toClaim?: number;
        claimed?: number;
    };
    gameUnlockTime?: number;
    instantPrice?: number;
    perchColor?: string;
    farmingPower: number;
    stakedOnDuckHouse?: assetId;
    startPrice?: number;
    toClaim?: number;
    inRental?: boolean;
    status?: string;
    achievements?: {
        a: string[];
        n: null | number;
    };
    rarity?: number;
    oldRarity?: number;
    issueNumber?: number;
    locks?: [
        {
            assetId: string;
            dApp: string;
        },
    ];
}

export interface IAnimalDetailsV2 {
    assetId: string;
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
    eggProduction?: string;
    basePower?: number;
    veggBasePower?: number; // Maybe ducks never will use this interface so we can remove it.
    farmingPower?: number;
}

export interface IAnimalDetailsLocked extends IAnimalDetailsV2 {
    onFarming?: boolean;
    onSale?: boolean;
    // TODO: check if rental is correct
    inRental?: boolean;
}

export interface IAnimalsParamsFromGenotype {
    genoType: string;
    generation: string;
    color: string;
    animalDetails: {
        image: string;
        name: string;
    };
    fullColor: string;
    generationName: string;
    bgColor: string;
    fullColorName: string;
    generationNumber: string;
}

export interface PossibleAnimal {
    name: string;
    issuer: addressId;
    genotype: string;
    probability: number;
}

export interface AnimalDetailsAuction {
    assetId: string;
    auctionId: string;
    bids: any[];
    currency: string;
    description: string;
    instantPrice: number;
    startPrice: number;
    startedAt: number;
    status: string;
}

export interface AnimalDetailsLock {
    dApp: string;
    assetId: string;
    lockedTill: string | null;
}

export interface AnimalDetailsFarmingParams {
    farmingPower: number;
    globalFarmingPower: number;
    stakedBefore: boolean;
}

export interface AnimalColorsProps {
    animalType: AnimalType;
    colors: {
        [key: string]: string;
    };
}

export interface AnimalConnection {
    animalId: string;
    assetId: string;
    type: string;
    item: Nft;
}
