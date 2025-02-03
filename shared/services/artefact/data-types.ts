import type { ArtefactType, ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type ArtefactOwner = ContractStringData<`ART-${string}_${addressId}_owner`, itemId>;
export type LootboxStatus = ContractStringData<`${addressId}_${lootBoxId}_status`, `ART-${string}` | 'started'>;
export type ArtefactId = ContractStringData<`${addressId}_${lootBoxId}_artefactId`, itemId>;
export type FinishHeight = ContractIntegerData<`${addressId}_${lootBoxId}_finishHeight`>;
export type UserBoost = ContractIntegerData<`${addressId}_user_external_boost`>;
export type DuckBoost = ContractIntegerData<`${duckId}_duck_external_boost`>;
export type ArtefactAmount = ContractIntegerData<'global_artAmount'>;

export type CosmeticItemBasePrice = ContractIntegerData<`direct_cosmetic_${ArtefactType}`>;
export type CosmeticItemMaxQuantity = ContractIntegerData<`direct_cosmetic_${ArtefactType}_max_sales`>;
export type CosmeticItemOnSale = ContractBooleanData<`direct_cosmetic_${ArtefactType}_sale`>;
export type CosmeticItemGrowPercentage = ContractIntegerData<`direct_cosmetic_${ArtefactType}_growing_percentage`>;
export type CosmeticItemIsSold = ContractBooleanData<`direct_cosmetic_${ArtefactType}_sold`>;
export type CosmeticItemLastPrice = ContractIntegerData<`direct_cosmetic_${ArtefactType}_last_price`>;
export type CosmeticItemStartTs = ContractIntegerData<`direct_cosmetic_${ArtefactType}_startTs`>;
export type CosmeticItemEndTs = ContractIntegerData<`direct_cosmetic_${ArtefactType}_endTs`>;
export type CosmeticItemData =
    | CosmeticItemBasePrice
    | CosmeticItemMaxQuantity
    | CosmeticItemOnSale
    | CosmeticItemGrowPercentage
    | CosmeticItemIsSold
    | CosmeticItemLastPrice
    | CosmeticItemStartTs
    | CosmeticItemEndTs;
