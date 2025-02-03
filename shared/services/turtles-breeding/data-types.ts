import type { ContractIntegerData, ContractStringData } from '../../types';

export type GenotypeAmount = ContractIntegerData<`stats_TRTL-${string}-${string}_amount`>;
export type BreedingTurtle = ContractStringData<`${addressId}_${txId}_TRTL`, ducklingId>; // TODO: TURTLES

export type Children = ContractIntegerData<`asset_${assetId}_children`>;
