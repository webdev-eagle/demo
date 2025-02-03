export interface Richlist {
    address: string;
    excluded: boolean;
}

export interface AssetRichlist {
    address: string;
    quantity: number;
}

export interface EggsRichlist {
    circulating: number;
    totalSupply: number;
    maxSupply: number;
}
