import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type IsCollectiveFarm = ContractBooleanData<`farm_${addressId}`>;
export type CollectiveFarmFeeAmount = ContractStringData<`f_${addressId}_fee`>;
export type CollectiveFarmPublicKey = ContractStringData<`f_${addressId}_pk`, publicKey>;
export type CollectiveFarmStakeAddress = ContractStringData<`f_${addressId}_stake_address`, addressId>;

export type AllowedContracts = ContractStringData<'allowed_contracts', Join<addressId[], ';'>>;
//export type LiquidityThreshold = ContractIntegerData<'LIQUIDITY_THRESHOLD'>;
export type MarketPrice = ContractIntegerData<`r-${number}-b-${number}`>;
