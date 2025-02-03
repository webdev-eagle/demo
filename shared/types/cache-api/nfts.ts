export interface NftsEntity {
    assetId: string;
    issuer: string;
    type: string;
    name: string;
}

export interface FarmStats {
    _id: string;
    count: number;

    getId: () => string;
}
