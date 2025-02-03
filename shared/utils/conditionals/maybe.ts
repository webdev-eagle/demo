type Void = null | undefined;

export interface Maybe<T> {
    tap(fn: (val: T) => void): Maybe<T>;
    assure<U extends T>(assuranceFn: (val: T) => val is U): Maybe<U>;
    map<U>(fn: (val: T) => U): Maybe<U>;
    flatMap<U>(fn: (val: T) => Maybe<U>): Maybe<U>;
    get(): T | undefined;
    or(defaultValue: T | (() => T)): T;
}

const isVoid = (val: unknown): val is Void => val === null || val === undefined;

const none = {
    tap: () => none,
    assure: () => none,
    map: () => none,
    flatMap: () => none,
    get: () => undefined,
    or: (defaultValue: any | (() => any)) => (typeof defaultValue === 'function' ? defaultValue() : defaultValue),
};

export const maybe = <T>(val: T | Void): Maybe<T> => {
    if (isVoid(val)) {
        return none;
    }
    const ops: Maybe<T> = {
        tap: (fn: (val: T) => void) => {
            fn(val);
            return ops;
        },
        assure: <U extends T>(assuranceFn: (val: T) => val is U) => (assuranceFn(val) ? maybe(val) : none),
        map: <U>(fn: (val: T) => U) => maybe(fn(val)),
        flatMap: <U>(fn: (val: T) => Maybe<U>) => fn(val),
        get: () => val,
        or: () => val,
    };

    return ops;
};
