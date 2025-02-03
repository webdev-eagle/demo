import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type TotalLastCheckInterest = ContractIntegerData<'total_lastCheckInterest'>;
export type TotalFarmingPower = ContractIntegerData<'total_farmingPower'>;
export type TotalLastCheckInterestHeight = ContractIntegerData<'total_lastCheckInterestHeight'>;

export type Owner = ContractStringData<`${duckId}_owner`, addressId>;

export type BasePower = ContractIntegerData<`${duckId}_basePower`>;
export type TotalStaked = ContractIntegerData<`total_staked`>;
export type FarmingPower = ContractIntegerData<`address_${addressId}_asset_${duckId}_farmingPower`>;
export type LastCheckFarmedAmount = ContractIntegerData<`address_${addressId}_asset_${duckId}_lastCheckFarmedAmount`>;
export type LastCheckInterest = ContractIntegerData<`address_${addressId}_asset_${duckId}_lastCheckInterest`>;
export type WithdrawnAmount = ContractIntegerData<`address_${addressId}_asset_${duckId}_withdrawnAmount`>;
export type Claimed = ContractIntegerData<`${addressId}_asset_${duckId}_claimed`>;
export type WithoutPerch = ContractBooleanData<`address_${addressId}_asset_${duckId}_without_perch`>;
export type PerchColor = ContractStringData<`address_${addressId}_asset_${duckId}_perchColor`>;
export type OriginalCaller = ContractStringData<`${duckId}_original_caller`, addressId>;
export type GlobalLastCheckInterest = ContractIntegerData<`global_lastCheck_interest`>;

export type FarmingEntries =
    | FarmingPower
    | LastCheckFarmedAmount
    | LastCheckInterest
    | WithdrawnAmount
    | PerchColor
    | WithoutPerch;
export type FarmingGlobals = TotalLastCheckInterest | TotalFarmingPower | TotalLastCheckInterestHeight | Claimed;

export type FarmingGlobalsV2 = TotalStaked | BasePower | GlobalLastCheckInterest;
