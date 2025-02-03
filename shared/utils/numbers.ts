export const toInt = (str: stringed<integer>): integer => parseInt(str, 10) as integer;
export const toFloat = (str: stringed<float>): float => parseFloat(str) as float;

export const roundUp = (num: number): integer => Math.round(num) as integer;
export const stringifyFloat = (num: number, maxPrecision = 12): string =>
    num.toFixed(maxPrecision).replace(/\.?0*$/, '');

export const subtractPercent = (num: number, percent: number) => num - num * (percent / 100);
export const addPercent = (num: number, percent: number) => num + num * (percent / 100);

export const limit = <T extends number>(min: number, max: number, num: T) => Math.min(Math.max(num, min), max);
