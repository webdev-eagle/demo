import Cache from './Cache';

class CacheMap<K extends keyof any = string, D = any> {
    private map = new Map<K, Cache<D>>();
    private readonly ttl: number;

    readonly [Symbol.toStringTag] = '[object CacheMap]';

    get size(): number {
        return this.map.size;
    }
    /**
     *
     * @param {object} [options]
     * @property {number} [options.ttl] time to live
     */
    constructor(options: { ttl?: number } = {}) {
        this.ttl = options.ttl || 0;
    }

    has(key: K): boolean {
        return !!this.map.get(key)?.data;
    }

    get(key: K): D | undefined {
        return this.map.get(key)?.data ?? undefined;
    }

    getRecords(keys: K[]): Record<K, D> {
        return keys.reduce(
            (res, key) => {
                if (this.has(key)) {
                    res[key] = this.get(key) as D;
                }
                return res;
            },
            {} as Record<K, D>,
        );
    }

    set(key: K, data: D) {
        this.map.get(key)?.destroy();
        const cache = new Cache<D>({ ttl: this.ttl });
        cache.data = data;
        this.map.set(key, cache);

        return this;
    }

    delete(key: K) {
        const has = this.map.has(key);

        if (has) {
            this.map.get(key)?.destroy();
            this.map.delete(key);
        }

        return has;
    }

    clear() {
        this.map.forEach((_, key) => {
            this.delete(key);
        });
    }

    getOr(key: K, cb: (key: K) => D): D {
        if (this.has(key)) {
            return this.get(key)!;
        }
        const res = cb(key);

        this.set(key, res);

        return res;
    }
}

export default CacheMap;
