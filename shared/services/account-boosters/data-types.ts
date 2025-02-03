import type { ContractIntegerData, ContractStringData } from '../../types';

export type ArtefactOwner = ContractStringData<`ART-${string}_${addressId}_owner`, assetId>;
export type LastUnstakeHeight = ContractIntegerData<`ART-${string}_${assetId}_unstake_height`>;
