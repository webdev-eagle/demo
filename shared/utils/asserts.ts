import { isDevEnv } from './env';

export const isInt = (num: number): num is integer => num % 1 === 0;

export const int = (num: number): integer => {
    if (!isInt(num)) {
        throw new TypeError(`${num} is not of an integer type`);
    }

    return num;
};

export const assertInt = (num: any, defaultTo: number): integer => {
    if (!isInt(defaultTo)) {
        throw new TypeError(`Default value of ${defaultTo} is not of an integer type`);
    }

    if (num == null) {
        return defaultTo;
    }

    if (typeof num !== 'number' || !isInt(num)) {
        if (isDevEnv()) {
            throw new TypeError(`${num} is not of an integer type`);
        }

        console.error(`${num} is not of an integer type. Defaults to ${defaultTo} value`);

        return defaultTo;
    }

    return num;
};

export const isNotVoid = <T>(val: T | null | undefined | void | never): val is T => val !== null && val !== undefined;

export const isEmptyObject = (val: any): boolean => {
    if (val == null) {
        return true;
    }
    const keys = Object.getOwnPropertyNames(val);
    if (typeof val === 'object') {
        if (keys.length === 0) {
            return true;
        }
        return keys.every((key) => val[key] == null);
    }

    return false;
};

export const isEmpty = <T extends any>(val: T | null | undefined | void | never): val is Exclude<typeof val, T> => {
    if (Array.isArray(val)) {
        return val.length === 0;
    }

    return val == null || (typeof val === 'string' && val === '') || isEmptyObject(val);
};
