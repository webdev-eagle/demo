import { getAddress } from '$shared/domain/constants';
import type { CacheApi } from '$shared/types';

import { assetIdAsFloat } from '../utils';

const LEGACY_FARMING_DAPP = getAddress('LEGACY_FARMING_DAPP');
const DUCK_FARMING_DAPP = getAddress('DUCK_FARMING_DAPP');
const DUCK_HOUSE_DAPP = getAddress('DUCK_HOUSE_DAPP');
const MEGA_DUCK_HOUSE_DAPP = getAddress('MEGA_DUCK_HOUSE_DAPP');
const VEGG_FARMING_DAPP = getAddress('VEGG_FARMING_DAPP');

const FARMING_SCS = [DUCK_FARMING_DAPP, LEGACY_FARMING_DAPP, DUCK_HOUSE_DAPP, MEGA_DUCK_HOUSE_DAPP];
const VEGG_FARMING_SCS = [VEGG_FARMING_DAPP];

export const getDruckParam = (id: string): string => (assetIdAsFloat(id) > 0.5 ? '1' : '2');

export const getDuckColor = (duck: { name: string }): string => duck.name.split('-')[2].split('')[1];

export const onFarming = ({ locks }: { locks: CacheApi.Lock[] }): boolean =>
    locks.some(({ dApp }) => FARMING_SCS.includes(dApp));

export const onVeggFarming = ({ locks }: { locks: CacheApi.Lock[] }): boolean =>
    locks.some(({ dApp }) => VEGG_FARMING_SCS.includes(dApp));
