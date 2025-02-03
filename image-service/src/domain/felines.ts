import { getAddress } from '$shared/domain/constants';
import type { CacheApi } from '$shared/types';

import { assetIdAsFloat } from '../utils';

const FELINES_FARMING_DAPP = getAddress('FELINES_FARMING_DAPP');

const FARMING_SCS = [FELINES_FARMING_DAPP];

export const getFelineParam = (id: string): string => (assetIdAsFloat(id) > 0.5 ? '1' : '2');

export const getFelineColor = (duck: { name: string }): string => duck.name.split('-')[2].split('')[1];

export const onFarmingFelines = ({ locks }: { locks: CacheApi.Lock[] }): boolean =>
    locks.some(({ dApp }) => FARMING_SCS.includes(dApp));
