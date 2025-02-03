import { ANIMAL_PREFIXES } from '$shared/enums';
import type { ContractIntegerData, ContractStringData } from '../../types';

export type GenotypeAmount<T extends ANIMAL_PREFIXES> = ContractIntegerData<`stats_${T}-${string}-${string}_amount`>;
export type BreedingAnimal<T extends ANIMAL_PREFIXES> = ContractStringData<`${addressId}_${txId}_${T}`, string>;
export type Children = ContractIntegerData<`asset_${string}_children`>;
