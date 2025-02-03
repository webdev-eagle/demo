import type { ContractIntegerData, ContractStringData } from '../../types';

export type StakedDuck = ContractStringData<`duck_${duckId}_sduckId`, sduckId>;

export type DuckOwner = ContractStringData<`duck_${duckId}_owner`, addressId>;

export type Duck = ContractStringData<`nft_${sduckId}_duckId`, duckId>;

export type DuckRarity = ContractIntegerData<`address_${addressId}_lockedDuck_${assetId}`>;
