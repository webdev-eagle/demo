import type { Worlds } from '../enums';

export type NftName =
    | `DUCK-${string}-${string}`
    | `BABY-${string}-${string}`
    | `ART-${string}`
    | 'DUCK-MANTLE-0'
    | 'ACCESS-RACE'
    | 'ACCESS-HUNT';

export interface Nft {
    assetId: string;
    issueHeight: number;
    issuer: string;
    name: NftName;
    originTransactionId: string;
}

export type AssetDetails = {
    owner: string;
    assetId: assetId;
    decimals: number;
    description: string;
    issueHeight: number;
    issueTimestamp: timestamp;
    issuer: addressId;
    issuerPublicKey: publicKey;
    name: string;
    originTransactionId: txId;
    quantity: number;
    reissuable: boolean;
    scripted: boolean;
};

/**
 * @deprecated
 */
export interface IAsset {
    assetId: string;
    name: string;
    description: string;
    decimals: number;
    issuer: string;
    issueTimestamp: number;
    achievements?: {
        a: string[];
        n: null | number;
    };

    hunt?: {
        dailyLimit: number;
        totalCapacity: number;
        laidEggs: number;
        maxRadius: number;
        initialTotalCapacity: number;
        canBeUnstakenAt: null | number;
    };
    eggProduction?: any;
    onFarming?: any;
    onSale?: any;
    inWars?: any;
    lockedInGame?: any;
    world?: Worlds;
    toClaim?: number;
    rarity?: any;
    huntPower?: any;
    inHunt?: any;
}

export interface INft {
    assetId: string;
    decimals: number;
    description: string;
    issueHeight: number;
    issueTimestamp: number;
    issuer: string;
    issuerPublicKey: string;
    minSponsoredAssetFee: any;
    name: string;
    originTransactionId: string;
    quantity: number;
    reissuable: boolean;
    scripted: boolean;
    ducksWithSameGenes: any;
    rarity: number;
    globalFarmingPower: number;
    eggProduction: string;
    achievements?: any;
}

export interface IAssetBalances {
    assetId: string;
    balance: number;
    reissuable: boolean;
    minSponsoredAssetFee: number;
    sponsorBalance: number;
    quantity: number;
    issueTransaction: {
        assetId: string;
        name: string;
        quantity: number;
        reissuable: boolean;
        decimals: number;
        description: string;
        script: string;
    };
}
