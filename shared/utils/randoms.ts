export const shuffle = <T>(array: readonly T[]): T[] => {
    const shuffled = array.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }

    return shuffled;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number): number => {
    const ceilMin = Math.ceil(min);
    const flooredMax = Math.floor(max);
    return Math.floor(Math.random() * (flooredMax - ceilMin + 1)) + ceilMin;
};

export const getRandomElement = <T>(arr: T[]): T => arr[getRandomInt(0, arr.length - 1)];
