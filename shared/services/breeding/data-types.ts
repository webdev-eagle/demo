import type { ContractIntegerData, ContractStringData } from '../../types';

export type GenotypeAmount = ContractIntegerData<`stats_DUCK-${string}-${string}_amount`>;
export type BreedingDuckling = ContractStringData<`${addressId}_${txId}_duckling`, ducklingId>;

export type Children = ContractIntegerData<`asset_${assetId}_children`>;
