import type { DuckConnectionType } from '$shared/types';

export interface Nft {
    assetId: assetId;
    issueHeight: integer;
    issuer: addressId;
    createdAt: string;
    name: string;
    originTransactionId: txId;
    type: string;
}

export interface CommonNft extends Nft {
    owner: addressId;
}

export interface Lock {
    assetId: assetId;
    dApp: addressId;
    lockedTill?: timestamp | null;
    unlockedTill?: timestamp | null;
}

export interface Connection {
    duckId: duckId;
    assetId: assetId;
    type: DuckConnectionType;
    item: Nft;
}
