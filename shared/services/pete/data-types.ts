import { ContractBooleanData, ContractIntegerData } from '$shared/types';

export type PeteStaked = ContractIntegerData<`${addressId}_userTokenStaked`>;

export type PeteStakedNft = ContractBooleanData<`${addressId}_.*_userNFTStakedId`>;

export type PeteClaimStakedNft = ContractIntegerData<`${addressId}_.*_userNFTStakedId`>;
