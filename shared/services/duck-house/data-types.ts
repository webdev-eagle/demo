import type { ContractStringData } from '../../types';

export type ArtefactOwner = ContractStringData<`${assetId}_owner`, addressId>;
export type StakedDuck = ContractStringData<`${duckId}_duck_house`, assetId>;
