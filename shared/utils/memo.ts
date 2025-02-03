export const singleton = <Args extends any[], R>(func: (...args: Args) => R): ((...args: Args) => R) => {
    const memo: { res: R | null } = { res: null };

    return (...args: Args) => {
        if (memo.res === null) {
            memo.res = func(...args);
        }
        return memo.res;
    };
};
