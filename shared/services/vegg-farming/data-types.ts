import { ContractIntegerData, ContractStringData } from '$shared/types';

export type GlobalStaked = ContractIntegerData<'total_staked'>;
export type GlobalLastCheckInterest = ContractIntegerData<'global_lastCheck_interest'>;

export type Owner = ContractStringData<`${duckId}_owner`, addressId>;
export type FarmingPower = ContractIntegerData<`address_${addressId}_asset_${duckId}_farmingPower`>;
export type LastCheckInterest = ContractIntegerData<`address_${addressId}_asset_${duckId}_lastCheckInterest`>;
export type Claimed = ContractIntegerData<`${addressId}_asset_${duckId}_claimed`>;
export type FarmingGlobals = GlobalStaked | GlobalLastCheckInterest;

export type FarmingEntries = FarmingPower | Claimed;
