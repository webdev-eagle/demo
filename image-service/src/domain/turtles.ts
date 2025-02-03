import { getAddress } from '$shared/domain/constants';
import type { CacheApi } from '$shared/types';

import { assetIdAsFloat } from '../utils';

const TURTLES_FARMING_DAPP = getAddress('TURTLES_FARMING_DAPP');

const FARMING_SCS = [TURTLES_FARMING_DAPP];

export const getTurtleParam = (id: string): string => (assetIdAsFloat(id) > 0.5 ? '1' : '2');

export const getTurtleColor = (duck: { name: string }): string => duck.name.split('-')[2].split('')[1];

export const onFarmingTurtles = ({ locks }: { locks: CacheApi.Lock[] }): boolean =>
    locks.some(({ dApp }) => FARMING_SCS.includes(dApp));
