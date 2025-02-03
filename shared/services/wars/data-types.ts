import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type WarsItemType = 'mantle';

export type UserItemStatus = ContractStringData<
    `address_${addressId}_artefact_${WarsItemType}_artefactId_${itemId}_status`,
    'FREE' | 'OCCUPIED'
>;

export type UserItemLevel =
    ContractIntegerData<`address_${addressId}_artefact_${WarsItemType}_artefactId_${itemId}_level`>;

export type UsersDuckItemWorn =
    ContractBooleanData<`address_${addressId}_duck_${duckId}_artefact_${WarsItemType}_artefactId_${itemId}_status`>;

export type UserDuckOnWars = ContractBooleanData<`address_${addressId}_duck_${duckId}_status`>;

export type ItemLevel = ContractIntegerData<`artefactId_${itemId}_level`>;

export type ItemInvested = ContractIntegerData<`artefact_${WarsItemType}_artefactId_${itemId}_invested`>;

export type ItemType = ContractStringData<`artefactId_${itemId}_type`, WarsItemType>;

export type ItemByDuck = ContractStringData<`artefact_ ${WarsItemType}_duck_${duckId}_artefactId`, itemId>;

export type ItemOwner = ContractStringData<`artefact_ ${WarsItemType}_artefactId_${itemId}_owner`, addressId>;

export type ItemStatus = ContractStringData<
    `artefact_ ${WarsItemType}_artefactId_${itemId}_status`,
    'FREE' | 'OCCUPIED'
>;
