import type { Addresses, Assets, EthereumVars } from '../constants';
import { ADDRESS, ASSET, ETHEREUM_VARS } from '../constants';
import BiMap from '../structures/BiMap';
import { getEnv } from '../utils';

export const getAssetID = (assetName: keyof Assets): string => ASSET[getEnv().toUpperCase()][assetName];

export const getAddress = (addressName: keyof Addresses): string => ADDRESS[getEnv().toUpperCase()][addressName];

export const getEthVariable = <N extends keyof EthereumVars>(name: N): EthereumVars[N] =>
    ETHEREUM_VARS[getEnv().toUpperCase()][name];

export const ASSETS_BIMAP = new BiMap<keyof Assets, string>(ASSET[getEnv().toUpperCase()]);

export const getAssetNameById = (assetId: string): keyof Assets | '' => {
    const assets = Object.entries(ASSET[getEnv().toUpperCase()]);
    const asset = assets.find((asset) => asset[1] === assetId);
    return asset ? (asset[0] as keyof Assets) : '';
};
