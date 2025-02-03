import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type AccessItemAssetId = ContractStringData<`static_accessItemAssetId`, assetId>;
export type AccessItemPrice = ContractIntegerData<`static_accessItemPrice`>;
export type MinimumLockDuration = ContractIntegerData<`static_minLockDuration`>;
export type BoosterItemAssetId = ContractStringData<`static_boosterBuyAssetId`, assetId>;

export type BoughtBoosterLevel = ContractIntegerData<`address_${addressId}_boughtBoosterLevel`>;

export type AccessItemOwner = ContractStringData<`accessItem_${assetId}_owner`, addressId>;

export type LockedDuckStatus = ContractBooleanData<`address_${addressId}_lockedDuck_${duckId}_status`>;

export type UserAccessItem = ContractStringData<`address_${addressId}_owning`, assetId>;

export type BoughtItems = ContractIntegerData<`address_${addressId}_spotsBought`>;

export type UsedItems = ContractIntegerData<`address_${addressId}_spotsBusy`>;

export type DuckOwner = ContractStringData<`duck_${duckId}_owner`, addressId>;

export type UnlockTime = ContractIntegerData<`duck_${duckId}_unlockTime`>;

export type AllData =
    | AccessItemAssetId
    | AccessItemPrice
    | MinimumLockDuration
    | BoosterItemAssetId
    | BoughtBoosterLevel
    | AccessItemOwner
    | LockedDuckStatus
    | UserAccessItem
    | BoughtItems
    | UsedItems
    | DuckOwner
    | UnlockTime;
