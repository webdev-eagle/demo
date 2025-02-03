declare type Split<S extends string, D extends string> = string extends S
    ? string[]
    : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
    ? [T, ...Split<U, D>]
    : [S];

declare type Join<S extends string[], D extends string> = S extends [infer T, ...infer R]
    ? R[0] extends string
        ? `${T}${D}${Join<R, D>}`
        : T
    : string;

declare type ToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
    ? `${Lowercase<T>}${Capitalize<U extends `${string}_${string}` ? ToCamelCase<U> : Lowercase<U>>}`
    : S extends `${infer T}-${infer U}`
    ? `${Lowercase<T>}${Capitalize<U extends `${string}-${string}` ? ToCamelCase<U> : Lowercase<U>>}`
    : Lowercase<S>;

declare type KeysToCamelCase<T> = T extends object
    ? {
          [K in keyof T as ToCamelCase<K>]: T[K];
      }
    : T;

declare type KeysToCamelCaseNested<T> = T extends object
    ? {
          [K in keyof T as ToCamelCase<K>]: KeysToCamelCase<T[K]>;
      }
    : T;

declare type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];

declare type Get<S extends any[], O extends Record<any, any>> = S extends [infer T, ...infer R]
    ? R[0] extends string
        ? Get<R, O[T]>
        : O[T]
    : O;

declare type Keys<T> = keyof T;

declare type EnumValues<T> = `${T}`;
