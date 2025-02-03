export interface IFarm {
    _id: string;
    __typename: string;
    title: string;
    description: string;
    threshold: number;
    fee: number;
    contacts: string;
    contract: string;
    participants: number;
    totalLiquidity: number;
    socials: Array<{
        link: string;
        slug: string;
        title: string;
        __typename: string;
    }>;
    cover: string;
    __v: number;
    eggBalance: number;
    shareAssetId: string;
    wavesBalance: number;
}

interface Social {
    link: string;
    slug: string;
    title: string;
    __typename: string;
}

export interface IFarmType {
    title: string;
    description: string;
    threshold: number;
    fee: number;
    contacts: string;
    publicKey: string;
    contract: string;
    participants: number;
    totalLiquidity: number;
    socials: Social[];
    cover: string;
    apy?: number;
    __typename: string;
    stakingContract: string;
    active: boolean;
}

export interface IFarmingGlobals {
    globalFarmingPower: integer;
    globalLastCheckInterest: integer;
    globalLastCheckInterestHeight: integer;
}

export type IFarmingEntries = {
    farmingPower: integer;
    lastCheckInterest: integer;
    lastCheckFarmedAmount?: integer;
    withdrawnAmount?: integer;
    perchColor?: string;
};

export interface IFarmingParams {
    lastCheckFarmedAmount?: integer;
    withdrawnAmount?: integer;
    assetLastCheckInterest: integer;
    farmingPower: integer;
    globalFarmingPower: number;
    globalLastCheckInterest: number;
    globalLastCheckInterestHeight: number;
    blockchainHeight: number;
    currentInterest: integer;
}

export interface IFarmingDetails {
    owner: addressId;
    farmingParams: IFarmingParams;
    toClaim: number;
    perchColor?: string;
}

export type IFarmingEntriesMutants = {
    lastCheckInterest: integer;
    claimed: integer;
};

export type IFarmingEntriesV2 = {
    farmingPower: integer;
    lastCheckInterest: integer;
    claimed: integer;
    perchColor?: string;
};
export interface IFarmingGlobalsMutants {
    SPICE: {
        total_staked: integer;
        global_lastCheck_interest: integer;
    };
    EGG: {
        total_staked: integer;
        global_lastCheck_interest: integer;
    };
    VEGG: {
        total_staked: integer;
        global_lastCheck_interest: integer;
    };
    FEED: {
        total_staked: integer;
        global_lastCheck_interest: integer;
    };
}

export interface IClaimedData {
    claimed: number;
    lastCheckInterest: number;
}

export interface IFarmParamsMutant {
    assetId: string;
    typeReward: string;
    claimedData?: IClaimedData;
    farmingParams: IFarmingParamsV2;
    toClaim: number;
    owner: string;
}

export interface IFarmingGlobalsMutant {
    total_staked: integer;
    global_lastCheck_interest: integer;
}

export interface IFarmingGlobalsV2 {
    globalStaked: integer;
    globalLastCheck: integer;
}

export interface IFarmingParamsV2 {
    lastCheckFarmedAmount?: integer;
    assetLastCheckInterest: integer;
    farmingPower: integer;
    globalFarmingPower: number;
    globalLastCheck: number;
}
export interface IFarmingParamsV3 {
    farmingPower: number;
    globalFarmingPower: number;
}

export interface IFarmingDetailsV2 {
    owner: addressId;
    farmingParams: IFarmingParamsV2;
    toClaim: number;
    farmingPower?: number;
    perchColor?: string;
}
