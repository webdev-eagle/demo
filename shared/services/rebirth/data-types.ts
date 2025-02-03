import type { ContractIntegerData, ContractStringData } from '../../types';

export type CurrentPrice = ContractIntegerData<'currentPrice', eggint>;

export type AssetId = ContractStringData<`address_${addressId}_initTx_${txId}_assetId`, assetId>;
export type AssetRarity = ContractIntegerData<`address_${addressId}_initTx_${txId}_assetRarity`>;
export type FinishBlock = ContractIntegerData<`address_${addressId}_initTx_${txId}_finishBlock`>;
export type Result = ContractStringData<`address_${addressId}_initTx_${txId}_result`, '' | assetId>;
export type Result1 = ContractStringData<`address_${addressId}_initTx_${txId}_result1`, '' | assetId>;

export type Status = ContractStringData<`address_${addressId}_initTx_${txId}_status`, 'open' | 'finish'>;
export type Win = ContractStringData<
    `address_${addressId}_initTx_${txId}_win`,
    'gone' | `perch_${'R' | 'G' | 'B' | 'Y'}` | 'phoenix' | 'incubator' | 'duckling'
>;
export type Win1 = ContractStringData<
    `address_${addressId}_initTx_${txId}_win1`,
    'gone' | `perch_${'R' | 'G' | 'B' | 'Y'}` | 'phoenix' | 'incubator' | 'duckling'
>;

export type RebirthTxParams = AssetId | AssetRarity | FinishBlock | Result | Status | Win | Win1;
