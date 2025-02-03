export function chainRun<S, R1, R2, R3, R4, R5, R6, R7, Res>(
    start: S,
    ...funcs: [
        f1: (args: S) => R1,
        f2: (args: R1) => R2,
        f3: (args: R2) => R3,
        f4: (args: R3) => R4,
        f5: (args: R4) => R5,
        f6: (args: R5) => R6,
        f7: (args: R6) => R7,
        ...funcs: Array<(a: any) => any>,
        fnLast: (a: any) => Res,
    ]
): Res;
export function chainRun<S, R1, R2, R3, R4, R5, R6, R7>(
    start: S,
    f1: (args: S) => R1,
    f2: (args: R1) => R2,
    f3: (args: R2) => R3,
    f4: (args: R3) => R4,
    f5: (args: R4) => R5,
    f6: (args: R5) => R6,
    f7: (args: R6) => R7,
): R7;
export function chainRun<S, R1, R2, R3, R4, R5, R6>(
    start: S,
    f1: (args: S) => R1,
    f2: (args: R1) => R2,
    f3: (args: R2) => R3,
    f4: (args: R3) => R4,
    f5: (args: R4) => R5,
    f6: (args: R5) => R6,
): R6;
export function chainRun<S, R1, R2, R3, R4, R5>(
    start: S,
    f1: (args: S) => R1,
    f2: (args: R1) => R2,
    f3: (args: R2) => R3,
    f4: (args: R3) => R4,
    f5: (args: R4) => R5,
): R5;
export function chainRun<S, R1, R2, R3, R4>(
    start: S,
    f1: (args: S) => R1,
    f2: (args: R1) => R2,
    f3: (args: R2) => R3,
    f4: (args: R3) => R4,
): R4;
export function chainRun<S, R1, R2, R3>(start: S, f1: (args: S) => R1, f2: (args: R1) => R2, f3: (args: R2) => R3): R3;
export function chainRun<S, R1, R2>(start: S, f1: (args: S) => R1, f2: (args: R1) => R2): R2;
export function chainRun<S, R1>(start: S, f1: (args: S) => R1): R1;
export function chainRun<S, Args extends Array<(args: any) => any>>(start, ...args) {
    return args.reduce((res, func) => func(res), start);
}
