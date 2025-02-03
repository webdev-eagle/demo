import type { ContractIntegerData } from '../../types';

export type TotalSpent = ContractIntegerData<`${addressId}_spend`>;
export type Available = ContractIntegerData<`${addressId}_active`>;
