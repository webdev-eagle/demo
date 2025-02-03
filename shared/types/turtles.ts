export interface HatchingTurtlesParams {
    txId: txId;
    address: addressId;
    turtleId: turtleId;
    finishHeight: blocksHeight;
    status: 'HATCHING_STARTED' | 'HATCHING_FINISHED';
}

export interface ITurtlesDetails {
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
    type: string;
    id: string;
    owner: string;
    title: string;
    onSale: boolean;
    isArtefact: boolean;
    auctionId?: string;
    onFarming?: boolean;
    canBreed?: boolean;
    eggSell?: boolean;
    eggProduction?: string;
    basePower?: number;
    farmingParams?: {
        withdrawnAmount?: number;
        farmingPower?: number;
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
}

export interface ITurtleDetailsLocked extends ITurtleDetailsV2 {
    onFarming?: boolean;
    onSale?: boolean;
    // TODO: check if rental is correct
    inRental?: boolean;
}

export interface ITurtleParameters {
    genoType: string;
    generation: string;
    color: string;
    turtleDetails: {
        name: string;
        image: string;
    };
    fullColor: string;
    generationName: string;
    bgColor: string;
    fullColorName: string;
    generationNumber: string;
}

export interface ITurtleParamsFromGenotype {
    genoType: string;
    generation: string;
    color: string;
    turtleDetails: {
        image: string;
        name: string;
    };
    fullColor: string;
    generationName: string;
    bgColor: string;
    fullColorName: string;
    generationNumber: string;
}

export interface PossibleTurtle {
    name: string;
    issuer: addressId;
    genotype: string;
    probability: number;
}

export interface WithFarmPowerParams {
    turtlesWithSameGenes: number;
    rarity: number;
    globalFarmingPower: integer;
    farmingPower: number;
}
export interface ITurtleDetailsV2 {
    assetId: string;
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
        lastCheckFarmedAmount?: number; // could have some props that turtles don't use here
        globalFarmingPower?: number;
        stakedBefore?: boolean;
        toClaim?: number;
        claimed?: number;
    };
    eggProduction?: string;
    basePower?: number;
}
