import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type mutantId = string;

export type TotalLastCheckInterest = ContractIntegerData<'total_lastCheckInterest'>;
export type TotalFarmingPower = ContractIntegerData<'total_farmingPower'>;
export type TotalLastCheckInterestHeight = ContractIntegerData<'total_lastCheckInterestHeight'>;

export type Owner = ContractStringData<`${mutantId}_owner`, addressId>;

export type BasePower = ContractIntegerData<`${mutantId}_basePower`>;
export type FarmingPower = ContractIntegerData<`address_${addressId}_asset_${mutantId}_farmingPower`>;
export type LastCheckFarmedAmount = ContractIntegerData<`address_${addressId}_asset_${mutantId}_lastCheckFarmedAmount`>;
export type LastCheckInterest = ContractIntegerData<`address_${addressId}_asset_${mutantId}_lastCheckInterest_.*`>;
export type WithdrawnAmount = ContractIntegerData<`address_${addressId}_asset_${mutantId}_withdrawnAmount`>;
export type Claimed = ContractIntegerData<`${addressId}_asset_${mutantId}_claimed_.*`>;
export type WithoutPerch = ContractBooleanData<`address_${addressId}_asset_${mutantId}_without_perch`>;
export type PerchColor = ContractStringData<`address_${addressId}_asset_${mutantId}_perchColor`>;
export type OriginalCaller = ContractStringData<`${mutantId}_original_caller`, addressId>;
export type MutantOnFarmingOwner = ContractStringData<`address_${addressId}_asset_.*?_perchColor`>;
export type TotalStaked = ContractIntegerData<`total_staked_.*`>;
export type GlobalLastCheckInterest = ContractIntegerData<`global_lastCheck_interest_.*`>;
export type FarmingEntries =
    | FarmingPower
    | LastCheckFarmedAmount
    | LastCheckInterest
    | WithdrawnAmount
    | PerchColor
    | WithoutPerch;
export type FarmingGlobals = TotalLastCheckInterest | TotalFarmingPower | TotalLastCheckInterestHeight | Claimed;

export type FarmingGlobalsV2 = TotalStaked | BasePower | GlobalLastCheckInterest | TotalStaked;
