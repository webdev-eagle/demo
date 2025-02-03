export const unique = (args: any[]) => [...new Set(args)];

export const chunkUpBy = <T>(chunkSize: number, list: T[]): Array<T[]> => {
    const newArray: Array<T[]> = [];

    for (let i = 0; i < list.length; i += chunkSize) {
        newArray.push(list.slice(i, i + chunkSize));
    }

    return newArray;
};

export function dedupe<T extends string | number>(list: T[]): T[];
export function dedupe<T>(list: T[], by: (item: T) => string | number): T[];
export function dedupe<T>(list: any[], by?: (item: T) => string | number): T[] {
    const set = new Set<string | number>();
    const result: T[] = [];

    return list.reduce((res, item) => {
        const id = by ? by(item) : item;

        if (set.has(id)) {
            return res;
        }
        set.add(id);

        return [...res, item];
    }, result);
}

export const divide = <T>(list: T[], predicate: (element: T) => boolean): [trueRes: T[], falseRes: T[]] => {
    return list.reduce(
        ([trueRes, falseRes]: [T[], T[]], element): [T[], T[]] =>
            predicate(element) ? [[...trueRes, element], falseRes] : [trueRes, [...falseRes, element]],
        [[], []],
    );
};
