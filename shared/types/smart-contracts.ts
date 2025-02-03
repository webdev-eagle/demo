export interface IContractStateKey {
    key: string;
    type: string;
    value: number | string | null | boolean;
}

export interface IContractStringKey extends IContractStateKey {
    key: string;
    type: 'string';
    value: string;
}

export type ContractStringData<Key extends string = string, Value extends string = string> = {
    key: Key;
    type: 'string';
    value: Value;
};

export type ContractIntegerData<Key extends string = string, Value extends number = integer> = {
    key: Key;
    type: 'integer';
    value: Value;
};

export type ContractBooleanData<Key extends string = string> = {
    key: Key;
    type: 'boolean';
    value: boolean;
};

export type ContractData<Key extends string = string> =
    | ContractStringData<Key>
    | ContractIntegerData<Key>
    | ContractBooleanData<Key>;
