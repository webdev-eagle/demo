import type { ContractIntegerData, ContractStringData } from '../../types';

export type AssetId = ContractStringData<`address_${addressId}_initTx_${txId}_assetId`, assetId>;
export type FinishBlock = ContractIntegerData<`address_${addressId}_initTx_${txId}_finishBlock`>;
export type Result = ContractStringData<`address_${addressId}_initTx_${txId}_result`, '' | assetId>;
export type Status = ContractStringData<`address_${addressId}_initTx_${txId}_status`, 'open' | 'finish'>;
export type Win0 = ContractStringData<`address_${addressId}_initTx_${txId}_win`, '' | string>;
export type Win1 = ContractStringData<`address_${addressId}_initTx_${txId}_win`, '' | string>;
export type Win2 = ContractStringData<`address_${addressId}_initTx_${txId}_win`, '' | string>;
export type Win3 = ContractStringData<`address_${addressId}_initTx_${txId}_win`, '' | string>;
export type Win4 = ContractStringData<`address_${addressId}_initTx_${txId}_win`, '' | string>;
export type Win5 = ContractStringData<`address_${addressId}_initTx_${txId}_win`, '' | string>;

export type ShakeItTxParams = AssetId | FinishBlock | Result | Status | Win0 | Win1 | Win2 | Win3 | Win4 | Win5;
