import type { ContractIntegerData, ContractStringData } from '../../types';

export type GenotypeAmount = ContractIntegerData<`stats_MTNT-${string}-${string}_amount`>;
export type BreedingMutant = ContractStringData<`${addressId}_${txId}_MTNT`, string>;
export type MutantsMinted = ContractIntegerData<`stats_amount`>;
export type Children = ContractIntegerData<`asset_${assetId}_children`>;
export type GeneClass = 'T' | 'D';
export type MutantId = ContractStringData<`${addressId}_${txId}_di`, string>;
export type BreedingFinishHeight = ContractIntegerData<`${addressId}_${txId}_fh`, blocksHeight>;
