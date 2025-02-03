import type { ContractIntegerData, ContractStringData } from '../../types';

export type EarnedRewardAmount = ContractIntegerData<`address_${addressId}_earnedReward`>;
export type AvailableReward = ContractIntegerData<`address_${addressId}_availableReward`>;
export type RefererKey = ContractStringData<`address_${addressId}_refererKey_${string}`>;

export type ReferralKey = ContractStringData<`address_${addressId}_refKey`>;
export type ReferredByKey = ContractStringData<`address_${addressId}_referedBy`, addressId>;
export type ReferralKeyAddress = ContractStringData<`key_${string}_refererAddress`, addressId>;
export type ReferrerFromReferralAmount = ContractIntegerData<`referer_${addressId}_referal_${addressId}_amount`>;
export type ReferrerFromReferralDeliveredReward =
    ContractIntegerData<`referer_${addressId}_referal_${addressId}_deliveredReward`>;
export type UserReference = {
    _id: string;
    address: string;
    referrer: string;
    earnings?: number;
    lastEarnings?: number;
};

export type ReferralRanking = {
    _id: string;
    countEarnings: number;
    countTotal: number;
};
