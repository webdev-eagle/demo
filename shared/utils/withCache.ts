import Cache from '../structures/Cache';

const withCache = <Args extends any[], R>(fn: (...args: Args) => R, ttl: number): ((...args: Args) => R) => {
    const cache = new Cache({ ttl });

    return (...args: Args) => {
        if (!cache.data) {
            cache.data = fn(...args);
        }

        return cache.data;
    };
};

export default withCache;
