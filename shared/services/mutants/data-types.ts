export type NftDetails = {
    assetId: string;
    name: string;
    canBreed?: boolean;
};

export type ExtendedNftDetails = NftDetails & {
    status: {
        onFarming: boolean;
        onSale: boolean;
        onXmasStable: boolean;
        stakedOnDuckHouse: boolean;
    };
    owner: string;
    toClaim: number;
};
