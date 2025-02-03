import { getAddress } from '$shared/domain/constants';
import type { CacheApi } from '$shared/types';

import { assetIdAsFloat } from '../utils';

const CANINES_FARMING_DAPP = getAddress('CANINES_FARMING_DAPP');

const FARMING_SCS = [CANINES_FARMING_DAPP];

export const getCanineParam = (id: string): string => (assetIdAsFloat(id) > 0.5 ? '1' : '2');

export const getCanineColor = (canine: { name: string }): string => canine.name.split('-')[2].split('')[1];

export const onFarmingCanines = ({ locks }: { locks: CacheApi.Lock[] }): boolean =>
    locks.some(({ dApp }) => FARMING_SCS.includes(dApp));
