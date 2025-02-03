import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type TotalLastCheckInterest = ContractIntegerData<'total_lastCheckInterest'>;
export type TotalFarmingPower = ContractIntegerData<'total_farmingPower'>;
//export type TotalLastCheckInterestHeight = ContractIntegerData<'total_lastCheckInterestHeight'>;

export type Owner = ContractStringData<`asset_${animalId}_owner`, addressId>;

export type FarmingPower = ContractIntegerData<`address_${addressId}_asset_${animalId}_farmingPower`>;
export type LastCheckFarmedAmount = ContractIntegerData<`address_${addressId}_asset_${animalId}_lastCheckFarmedAmount`>;
export type LastCheckInterest = ContractIntegerData<`address_${addressId}_asset_${animalId}_lastCheckInterest`>;
export type WithdrawnAmount = ContractIntegerData<`address_${addressId}_asset_${animalId}_withdrawnAmount`>;
export type WithoutPerch = ContractBooleanData<`address_${addressId}_asset_${animalId}_without_perch`>;
export type PerchColor = ContractStringData<`address_${addressId}_asset_${animalId}_perchColor`>;
//export type Claimed = ContractIntegerData<`${addressId}_asset_${duckId}_claimed`>;

export type FarmingEntries =
    | FarmingPower
    | LastCheckFarmedAmount
    | LastCheckInterest
    | WithdrawnAmount
    | PerchColor
    | WithoutPerch;
export type FarmingGlobals = TotalLastCheckInterest | TotalFarmingPower;
