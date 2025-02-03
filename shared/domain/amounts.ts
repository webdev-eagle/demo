import { Assets, EGG_DECIMALS, PETE_DECIMALS, SPICE_DECIMALS, WAVES_DECIMALS } from '../constants';
import { roundUp } from '../utils';
import DECIMALS from './decimals';

export const toEggs = (num: eggint | integer): egg => num / EGG_DECIMALS;
export const toWaves = (num: wavesint | integer): waves => num / WAVES_DECIMALS;
export const toSpice = (num: spiceint | integer): waves => num / SPICE_DECIMALS;
export const toPete = (num: spiceint | integer): waves => num / PETE_DECIMALS;

export const toEggsInt = (num: egg): eggint => Math.round(num * EGG_DECIMALS) as eggint;
export const toWavesInt = (num: waves): wavesint => Math.round(num * WAVES_DECIMALS) as wavesint;

export const unitAmount = (amount: number, assetKey: keyof Assets): integer => roundUp(amount * DECIMALS[assetKey]);

export const roundAmount = (amount: number, assetId: keyof Assets): number =>
    unitAmount(amount, assetId) / DECIMALS[assetId];

export const toAsset = (amount: number | integer, assetKey: keyof Assets): number => amount / DECIMALS[assetKey];
