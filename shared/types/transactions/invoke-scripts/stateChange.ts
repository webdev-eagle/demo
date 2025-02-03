export type BinaryEntry = {
    key: string;
    type: 'binary';
    value: BinaryData;
};
export type BooleanEntry = {
    key: string;
    type: 'boolean';
    value: boolean;
};
export type IntegerEntry = {
    key: string;
    type: 'integer';
    value: integer;
};
export type StringEntry = {
    key: string;
    type: 'string';
    value: string;
};

export type DataEntry = BinaryEntry | BooleanEntry | IntegerEntry | StringEntry;

export type DeleteEntry = {
    key: string;
    value: null;
};

export type DataAction = DataEntry | DeleteEntry;

export type TransferAction = {
    address: addressId;
    asset: assetId | null;
    amount: integer;
};

export type IssueAction = {
    assetId: assetId;
    name: string;
    description: string;
    decimals: number;
    isReissuable: boolean;
    compiledScript: string;
};

export type ReissueAction = {
    assetId: assetId;
    quantity: number;
    isReissuable: boolean;
};

export type LeaseAction = {
    id: string;
    originTransactionId: txId;
    sender: addressId;
    recipient: addressId;
    amount: integer;
    height: number;
    status: 'active' | 'canceled';
    cancelHeight?: boolean;
    cancelTransactionId?: txId;
};

export type InvokeAction = {
    error: {};
    stateChanges: StateChange;
};

export type StateChange = {
    data: DataAction[];
    transfers: TransferAction[];
    issues: IssueAction[];
    reissues: ReissueAction[];
    burns: [];
    sponsorFees: [];
    leases: LeaseAction[];
    leaseCancel: [];
    invokes: InvokeAction[];
};
