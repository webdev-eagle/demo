import { ContractIntegerData } from '$shared/types';

export type BurnedEgg = ContractIntegerData<`BURN_.*`>;
export type BurnedAmmPool = ContractIntegerData<`global_.*_burned`>;
