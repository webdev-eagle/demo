import type { ContractData } from '../types';
import { split } from '../utils';

type DataKeyValue<T extends ContractData> = { [key in T['key']]: Extract<T, ContractData<key>>['value'] };

export const collectContractDataToObject = <T extends ContractData>(list: T[]): DataKeyValue<T> => {
    return list.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {} as DataKeyValue<T>);
};

export const getKeyPart = <T extends string, P extends number>(key: T, part: P): Split<T, '_'>[P] =>
    split<T, '_'>(key, '_')[part];

export const getDataKeyPart =
    <P extends number>(part: P) =>
    <D extends ContractData>({ key }: D): Split<D extends ContractData<infer K> ? K : string, '_'>[P] =>
        getKeyPart(key, part);
