export const capitalize = <T extends string>(str: T): Capitalize<T> =>
    (str.charAt(0).toUpperCase() + str.slice(1)) as any;

export const split = <S extends string, D extends string>(str: S, delimiter: D): Split<S, D> =>
    str.split(delimiter) as any;

//export const join = <S extends string[], G extends string>(str: S, glue: G): Join<S, G> => str.join(glue) as any;

export const camelCase = <T extends string>(str: T): ToCamelCase<T> =>
    str
        .trim()
        .split(/[-_\s]+/)
        .map((chunk, i, arr) =>
            arr.length === 1 ? chunk.toLowerCase() : i === 0 ? chunk.toLowerCase() : capitalize(chunk.toLowerCase()),
        )
        .join('') as any;

export const singularize = (str: string, withE?: boolean): string =>
    withE && str.endsWith('es') ? str.slice(0, -2) : str.endsWith("'s") || str.endsWith('s') ? str.slice(0, -1) : str;

export const pluralize = (str: string, withquotes: boolean = false): string => {
    const regex = /[!@#$%^&*(),.?":{}|<>]$/;
    let newString = regex.test(str)
        ? withquotes
            ? `${str.slice(0, -1)}'s${str.slice(-1)}`
            : `${str.slice(0, -1)}s${str.slice(-1)}`
        : !str.endsWith('s') && withquotes
          ? `${str}'s`
          : !str.endsWith('s')
            ? `${str}s`
            : str;

    return camelCase(newString);
};
