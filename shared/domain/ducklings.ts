import { getUrlToSVGWithTimeStamp } from '$shared/utils';
import { getAddress } from './constants';

const BREEDING_BABY_DUCKS_DAPP_ADDRESS = getAddress('BREEDING_BABY_DUCKS_DAPP');

export const isBredDuckling = ({ issuer }: { issuer: addressId }) => issuer === BREEDING_BABY_DUCKS_DAPP_ADDRESS;

export const getDucklingPicture = (growthLevel: number): string => {
    let fileIndex = Math.trunc(growthLevel / 25);
    fileIndex = fileIndex < 4 ? fileIndex : 3;
    const nameLink = `duckling-${fileIndex}`;
    return `/ducks/ducklings/${getUrlToSVGWithTimeStamp(nameLink)}`;
};
