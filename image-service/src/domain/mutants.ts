import { getAddress } from '$shared/domain/constants';
import { CacheApi } from '$shared/types';

const MUTANT_FARMING_DAPP = getAddress('MUTANT_FARMING_DAPP');

const FARMING_SCS = [MUTANT_FARMING_DAPP];

export const getMutantColor = (mutant: { name: string }): string => mutant.name.split('-')[2].split('')[1];

export const onFarmingMutants = ({ locks }: { locks: CacheApi.Lock[] }): boolean =>
    locks.some(({ dApp }) => FARMING_SCS.includes(dApp));
