/**
 *
 * @param registry
 * @example { A: ['a','b','c'], B: ['e', 'f'] } -> { a: 'A', b: 'A', c: 'A', e: 'B', f: 'B' }
 */
export const manyToOne = (registry: Record<string, string[]>): Record<string, string> => {
    const invertRelations = ([key, list]: [string, string[]]) => list.map((item): [string, string] => [item, key]);
    const pairs = Object.entries(registry).flatMap(invertRelations);

    return pairs.reduce((result, [key, value]) => Object.assign(result, { [key]: value }), {});
};

export function toRecord<T, K extends keyof any>(list: T[], getKey: (item: T) => K): Record<K, T>;
export function toRecord<T, K extends keyof any, V>(
    list: T[],
    getKey: (item: T) => K,
    getValue: (item: T) => V,
): Record<K, V>;
export function toRecord<T, K extends keyof any, V>(
    list: T[],
    getKey: (item: T) => K,
    getValue?: (item: T) => V,
): Record<K, any> {
    return list.reduce((record, item) => {
        const key = getKey(item);

        record[key] = getValue ? getValue(item) : item;

        return record;
    }, {} as Record<K, any>);
}

export const entries = <O extends Record<any, any>>(obj: O): Entries<O> => Object.entries(obj);

export const keys = <O extends Record<any, any>>(obj: O): Keys<O>[] => Object.keys(obj);
