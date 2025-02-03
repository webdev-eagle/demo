export interface ICollectiveFarms {
    _id: string;
    __typename: string;
    stakingContract: string;
    title: string;
    description: string;
    threshold: number;
    fee: number;
    contacts?: string;
    contract: string;
    participants: number;
    totalLiquidity: eggint;
    socials: Array<{
        link: string;
        slug: string;
        title: string;
        __typename?: string;
    }>;
    cover: string;
    __v?: number;
    eggBalance: number;
    shareAssetId: string;
    wavesBalance: wavesint;
    user?: any;
    payments?: any;
    ducks?: any;
    active: boolean;
}

export interface ICollectiveFarmReward {
    id: string;
    amount: number;
    collectiveFarm: addressId;
    timestamp: string;
    totalEarned: integer;
    meta: {
        collectiveFarm: addressId;
    };
}

export interface ICollectiveFarmRewardPayment {
    collectiveFarm: addressId;
    amount: integer;
    timestamp: string;
}

export interface ICollectiveFarmTokenPrice {
    weight: number;
    assetId: string;
    pool: string;
    price: number;
}
