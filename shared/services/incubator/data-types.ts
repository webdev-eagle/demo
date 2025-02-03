import type { ContractIntegerData, ContractStringData } from '../../types';

export type LastDucksPrice = ContractIntegerData<'ducks_last_price'>;

export type GenotypeAmount = ContractIntegerData<`stats_DUCK-${string}-${string}_amount`>;

export type DuckId = ContractStringData<`${addressId}_${txId}_di`, duckId>;
export type HatchingStatus = ContractStringData<
    `${addressId}_${txId}_status`,
    'HATCHING_STARTED' | 'HATCHING_FINISHED'
>;
export type HatchingFinishHeight = ContractIntegerData<`${addressId}_${txId}_fh`, blocksHeight>;
