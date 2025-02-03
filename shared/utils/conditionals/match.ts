type Case<T> = {
    case<U extends T, R>(checker: (val: T) => val is U, res: (val: U) => R): Match<Exclude<T, U>, R>;
    case<U extends T, R>(checker: (val: T) => val is U, res: R): Match<Exclude<U, T>, R>;
    case<U extends T>(checker: (val: T) => val is U): Match<Exclude<T, U>, U>;

    case<R>(checker: (val: T) => boolean, res: (val: T) => R): Match<T, R>;
    case<R>(checker: (val: T) => boolean, res: R): Match<T, R>;
    case(checker: (val: T) => boolean): Match<T, T>;

    case<U extends T, R>(checker: U, res: (val: U) => R): Match<T, R>;
    case<U extends T, R>(checker: U, res: R): Match<T, R>;
    case<U extends T>(checker: U): Match<T, U>;
};

type Match<T, Res> = {
    case<U extends T, R>(checker: (val: T) => val is U, res: (val: U) => R): Match<Exclude<T, U>, Res | R>;
    case<U extends T, R>(checker: (val: T) => val is U, res: R): Match<Exclude<T, U>, Res | R>;
    case<U extends T>(checker: (val: T) => val is U): Match<Exclude<T, U>, Res | U>;

    case<R>(checker: (val: T) => boolean, res: (val: T) => R): Match<T, Res | R>;
    case<R>(checker: (val: T) => boolean, res: R): Match<T, Res | R>;
    case(checker: (val: T) => boolean): Match<T, Res | T>;

    case<U extends T, R>(checker: U, res: (val: U) => R): Match<T, Res | R>;
    case<U extends T, R>(checker: U, res: R): Match<T, Res | R>;
    case<U extends T>(checker: U): Match<T, Res | U>;

    get(): Res | void;
    or<U>(defaultValue: U): Res | U;
};

const get = <T, Res>(val: T, cases: Array<[checker: T | ((val: T) => boolean), result?: (val: any) => Res]> = []) => {
    const [, res = (val) => val] =
        cases.find(([checker]) => (typeof checker === 'function' ? (checker as any)(val) : checker === val)) ?? [];

    return res?.(val);
};

const matchInternal = <T, Res>(
    val: T,
    cases: Array<[checker: T | ((val: T) => boolean), result?: (val: any) => Res]> = [],
) => ({
    case: <U extends T, R>(checker: U | ((val: T) => val is U), res?: (val: U) => R) =>
        matchInternal<T, Res | R>(val, [...cases, [checker, res]]),
    get: () => get(val, cases),
    or: (defaultValue) => get(val, cases) ?? defaultValue,
});

export const match = <T>(val: T): Case<T> => ({
    case: (checker: any, res?: any) => matchInternal(val, [[checker, res]]) as any,
});

match.empty = (val: string | any[]) => val.length === 0;
match.boolean = <R, T extends boolean>(val: R | T): val is T => typeof val === 'boolean';
match.string = <R, T extends string>(val: R | T): val is T => typeof val === 'string';
match.number = <R, T extends number>(val: R | T): val is T => typeof val === 'number';
match.anyObj = <R, T extends object>(val: R | T): val is T => typeof val === 'object' && val !== null;
match.void = <R, T extends null | undefined | void>(val: R | T): val is T => val == null;
match.instanceOf =
    <C extends abstract new (...args: any) => any>(constructor: C) =>
    <R, T>(val: R | T): val is InstanceType<C> =>
        val instanceof constructor;
match.rest = () => true;
match.throw = (error: string | Error) => (): never => {
    throw typeof error === 'string' ? new Error(error) : error;
};

function includes(...items: string[]): (val: string | readonly string[]) => boolean;
function includes<T>(...items: T[]): (val: readonly T[]) => boolean;
function includes<T>(...items: string[] | T[]) {
    return (val: string | readonly T[]) => items.some((item) => val.includes(item));
}
match.includes = includes;
