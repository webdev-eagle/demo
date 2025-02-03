import type { StateChange } from './invoke-scripts';
import type { Amount } from './invoke-scripts/amounts';
import type { Argument } from './invoke-scripts/arguments';

type ICommonTransaction = {
    id: txId;
    sender: addressId;
    fee: integer;
    feeAssetId: assetId | null;
    timestamp: timestamp;
    proofs: string[];
    applicationStatus: 'succeeded' | 'script_execution_failed';
    version: number;
};

export type IInvokeScriptTransaction = ICommonTransaction & {
    type: 16;
    dApp: addressAlias | addressId;
    payment: Amount[];
    call: {
        function: string;
        args: Argument[];
    };
    stateChanges: StateChange;
};

export type IIssueTransaction = ICommonTransaction & {
    type: 3;
    assetId: assetId;
    name: string;
    quantity: integer;
    reissuable: boolean;
    decimals: number;
    description: string;
    script: string;
};

export type IReissueTransaction = ICommonTransaction & {
    type: 5;
    assetId: assetId;
    quantity: integer;
    reissuable: boolean;
};

export type ISetAssetScriptTransaction = ICommonTransaction & {
    type: 15;
    assetId: assetId;
    script: string;
};

export type ISetScriptTransaction = ICommonTransaction & {
    type: 13;
    script: string;
};

export type ISponsorFeeTransaction = ICommonTransaction & {
    type: 14;
    assetId: assetId;
    minSponsoredAssetFee: integer;
};

export type ITransferTransaction = ICommonTransaction & {
    type: 4;
    recipient: addressAlias | addressId;
    minSponsoredAssetFee: integer;
    assetId: assetId | null;
    feeAsset: assetId | null;
    amount: integer;
    attachment: string;
};

export type IUpdateAssetInfoTransaction = ICommonTransaction & {
    type: 17;
    assetId: assetId;
    name: string;
    description: string;
};

export type ITransaction =
    | IInvokeScriptTransaction
    | IIssueTransaction
    | IReissueTransaction
    | ISetAssetScriptTransaction
    | ISetScriptTransaction
    | ISponsorFeeTransaction
    | ITransferTransaction
    | IUpdateAssetInfoTransaction;
