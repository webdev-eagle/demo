import type { NftName } from '../assets';

export interface Amount {
    assetId: string | null;
    amount: string;
}

export type InvokeArgument = boolean | number | string | Buffer | Uint8Array;

export interface AssetDetails {
    assetId: string;
    nft: boolean;
    name: NftName;
    decimals: number;
    description: string;
    issuer: string;
    lastUpdatedHeight: number;
    volume: number;
}

export interface AssetStateUpdate {
    after: AssetDetails | null;
    before: AssetDetails | null;
}

export interface BalanceUpdate {
    address: string;
    assetId: string;
    after: number;
    before: number;
}

export interface DataEntryUpdate {
    address: string;
    key: string;
    value: string | Buffer | null;
    oldValue: string | Buffer | null;
}

export interface SubCall {
    functionName: string;
    dApp: string;
    args: InvokeArgument[];
    payments: Amount[];
}

export interface InvokeDetails {
    dApp: string;
    functionName: string;
    args: InvokeArgument[];
    payments: Amount[];
    subCalls: SubCall[];
}

export interface TransactionStatus {
    txId: txId;
    status: 'successful' | 'unavailable';
}

export interface Transaction {
    txId: string;
    type: string;
    sender: string;
    invoke?: InvokeDetails;
    assetUpdates: AssetStateUpdate[];
    balanceUpdates: BalanceUpdate[];
    dataEntryUpdates: DataEntryUpdate[];
    timestamp: Date;
    height: number;
}
