import { ContractAnimalType } from '$shared/types/animals';
import type { ContractIntegerData, ContractStringData } from '../../types';

export type LastAnimalPrice = ContractIntegerData<`${ContractAnimalType}_last_price`>;

export type GenotypeAmount = ContractIntegerData<`stats_TRTL-${string}-${string}_amount`>;

export type AnimalId = ContractStringData<`${addressId}_${txId}_di`, animalId>;
export type HatchingStatus = ContractStringData<
    `${addressId}_${txId}_status`,
    'HATCHING_STARTED' | 'HATCHING_FINISHED'
>;
export type HatchingFinishHeight = ContractIntegerData<`${addressId}_${txId}_fh`, blocksHeight>;
