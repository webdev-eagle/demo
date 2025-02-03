import { AnimalConnection } from './animals';
import type { ArtefactType } from './artefacts';
import type { BidStatusType } from './auctions';
import { DuckConnection } from './ducks';

export interface IMarketPrice {
    marketPrice: number;
    lastTrades: Array<{ amount: integer; timestamp: timestamp }>;
}

export interface ICachedMarketplaceBid {
    amount: number;
    author: string;
    status: string;
}

export interface ICachedMarketplaceAuction {
    auctionId: auctionId;
    assetId: string;
    highestBid: integer;
    bids?: Record<bidId, ICachedMarketplaceBid>;
    description: string;
    currency: string;
    instantPrice: integer;
    startPrice: integer;
    startedAt: number;
    status: BidStatusType;
}

export type IMarketPlaceAuctionV2 = Omit<ICachedMarketplaceAuction, 'assetId'>;

export interface IDuckStrategy {
    collection: boolean;
    buyback: number;
    duckWarsCards: string[];
    estBuyback: number;
    estReward: number;
    farming?: {
        userHasCurrentColorPerch: boolean;
        farmingPower: number;
        price: number;
        priceWithPerch: number;
    };
    duckHunt?: {
        eggsPerDay: number;
        total: string;
    };
}

export interface ICachedMarketplaceDuck {
    assetId: string;
    issueHeight: number;
    issueTimestamp: number;
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
    canBreed: boolean;
    ducksWithSameGenes: number;
    rarity: number;
    globalFarmingPower: number;
    farmingPower: number;
    eggProduction: string;
    achievements: {
        a: string[];
        n: number;
    };
    auctionId: string;
    auction: ICachedMarketplaceAuction;
    strategy: IDuckStrategy;
    genotype: string;
    owner: string;
    rewardRatio: number;
    lockDuration: number;
    generation: string;
    status: RentalDuckStatus;
    rentedAt: Date;
    lockedAt: Date;
}

export interface ICachedMarketplaceDuckV2 {
    assetId: string;
    name: string;
    canBreed: boolean;
    oldRarity: number;
    rarity: number;
    farmingPower: number;
    eggProduction: string;
    achievements: string[];
    auction: ICachedMarketplaceAuction;
    strategy: IDuckStrategy;
    genotype: string;
    owner: string;
    issueNumber: number;
    offspring: string;
    rewardRatio: number;
    lockDuration: number;
    generation: string;
    status: RentalDuckStatus;
    rentedAt: Date;
    lockedAt: Date;
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
}

export type ICachedMarketplaceAnimalV2 = Omit<ICachedMarketplaceDuckV2, 'oldRarity'>;

export interface ICachedMarketplaceTurtle {
    assetId: string;
    name: string;
    canBreed: boolean;
    rarity: number;
    globalFarmingPower: number;
    eggProduction: string;
    auctionId: string;
    basePower: number;
    auction: ICachedMarketplaceAuction;
    strategy: IDuckStrategy;
    genotype: string;
    owner: string;
    lockDuration: number;
    generation: string;
    status: RentalDuckStatus;
    lockedAt: Date;
}
export interface ICachedMarketplaceTurtleV2 {
    assetId: string;
    name: string;
    canBreed: boolean;
    basePower: number;
    achievements: string[];
    auction: IMarketPlaceAuctionV2;
    strategy: IDuckStrategy;
    owner: string;
    lockDuration: number;
    generation: string;
    genotype: string;
    status: RentalDuckStatus;
    lockedAt: Date;
    issueNumber: number;
    offspring: string;
    connections: AnimalConnection;
}

export interface ICachedMarketplaceMutant {
    assetId: string;
    issueHeight: number;
    issueTimestamp: number;
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
    canBreed: boolean;
    ducksWithSameGenes: number;
    rarity: number;
    globalFarmingPower: number;
    farmingPower: number;
    eggProduction: string;
    auctionId: string;
    auction: ICachedMarketplaceAuction;
    strategy: IDuckStrategy;
    genotype: string;
    owner: string;
    lockDuration: number;
    generation: string;
    status: RentalDuckStatus;
    lockedAt: Date;
}
export type ICachedMarketplaceAnimal = ICachedMarketplaceTurtle;

export interface ICachedMarketplaceItem {
    assetId: string;
    issueHeight: integer;
    issueTimestamp: number;
    issuer: string;
    issuerPublicKey: string;
    name: ArtefactType;
    description: string;
    decimals: integer;
    reissuable: boolean;
    quantity: integer;
    scripted: boolean;
    minSponsoredAssetFee: any;
    originTransactionId: string;
    type: string;
    id: string;
    owner: string;
    title: string;
    onSale: boolean;
    isArtefact: boolean;
    auctionId: string;
    auction: ICachedMarketplaceAuction;
}

export interface ICachedMarketplace {
    _id: string;
    ducks: ICachedMarketplaceDuckV2[];
    mutants: ICachedMarketplaceAnimalV2[];
    turtles: ICachedMarketplaceTurtleV2[];
    canines: ICachedMarketplaceAnimalV2[];
    felines: ICachedMarketplaceAnimalV2[];
    updatedAt: string;
    __v: number;
    items: ICachedMarketplaceItem[];
    petes: ICachedMarketplaceItem[];
}

export interface ICachedRentalMarketplace {
    ducks: ICachedMarketplaceDuck[];
    pagination: { page: number; pageSize: number; totalSize: number };
}

export interface ICachedRentalMarketplaceResponse {
    data: ICachedMarketplaceDuck[];
    pagination: { page: number; pageSize: number; totalSize: number };
}

export interface ICachedMyRentedDucksResponse {
    data: {
        data: ICachedMarketplaceDuck[];
        pagination: { page: number; pageSize: number; totalSize: number };
    };
}

export enum RentalplaceView {
    OFFERS = 'offers',
    MY_DUCKS = 'my_ducks',
}

export enum RentalDuckStatus {
    RENTED = 'RENTED',
    IDLE = 'IDLE',
}

export type RentalSCStaticKeys = {
    initialRentSlotsCount: number;
    minRewardPercentage: number;
    maxRewardPercentage: number;
    depositSteps: number;
};
