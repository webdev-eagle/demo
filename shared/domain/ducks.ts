import { IDuckDetailsV2 } from '$shared/types/ducks';
import { DucklingAdjectives, DucklingsDescription } from '../constants';
import type { IDuckDetails } from '../types';
import { capitalize } from '../utils';
import { getAddress } from './constants';

const DUCK_BREEDER_DAPP_ADDRESS = getAddress('DUCK_BREEDER_DAPP');
const DUCK_INCUBATOR_DAPP_ADDRESS = getAddress('DUCK_INCUBATOR_DAPP');

export const isGenesis = (duck: { name: string } & Partial<IDuckDetailsV2>): boolean => duck.name[14] === 'G';
export const isJackpot = (duck: { name: string } & Partial<IDuckDetails | IDuckDetailsV2>): boolean =>
    duck.name[14] === 'J';
export const isBreedable = (duck: Partial<IDuckDetailsV2>): boolean => !!duck.canBreed;
export const isFakeDuck = ({ issuer }: { issuer: string }) =>
    issuer !== DUCK_INCUBATOR_DAPP_ADDRESS && issuer !== DUCK_BREEDER_DAPP_ADDRESS;

const getDucklingNameParts = (ducklingId: string) => {
    const indexes = [16, 10, 1, 9, 9, 7];
    const indexes2 = [10, 4, 2, 0, 2, 1];

    const adjNumber = indexes.reduce((acc, index) => acc + ducklingId.charCodeAt(index), 0);

    const nameNumber = indexes2.reduce((acc, index) => acc + ducklingId.charCodeAt(index), 0);

    const adj = DucklingAdjectives[adjNumber % DucklingAdjectives.length];
    const DuckNames = Object.keys(DucklingsDescription);
    const name = DuckNames[nameNumber % DuckNames.length];
    return { adj, name };
};

export const generateDucklingName = (ducklingId: string) => {
    // eslint-disable-next-line prefer-const
    let { adj, name } = getDucklingNameParts(ducklingId);
    // kardan can only be mean
    if (name === 'kardan') {
        adj = 'mean';
    }

    return `${capitalize(adj)} ${capitalize(name)}`;
};

export const getDucklingDescription = (ducklingId: string) => {
    const { name } = getDucklingNameParts(ducklingId);

    return DucklingsDescription[name];
};
