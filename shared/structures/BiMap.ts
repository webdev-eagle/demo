import { entries } from '$shared/utils';

/**
 * BiMap - Bidirectional Map.
 * Allows getting value by key and key by value with O(1) complexity
 */

class BiMap<K extends string, V> {
    private keyValueMap = new Map<K, V>();
    private valueKeyMap = new Map<V, K>();

    constructor(keyValueObject?: Record<K, V>) {
        if (keyValueObject) {
            entries(keyValueObject).forEach(([key, value]) => {
                this.keyValueMap.set(key, value);
                this.valueKeyMap.set(value, key);
            });
        }
    }

    keys(): K[] {
        return [...this.keyValueMap.keys()];
    }

    values(): V[] {
        return [...this.keyValueMap.values()];
    }

    entries(): Array<[K, V]> {
        return [...this.keyValueMap.entries()];
    }

    set(key: K, value: V): this {
        this.keyValueMap.set(key, value);
        this.valueKeyMap.set(value, key);
        return this;
    }

    getByKey(key: K): V;
    getByKey<T extends string>(key: K extends T ? T : never): V;
    getByKey(key: string): undefined;
    getByKey(key: K): V | undefined {
        return this.keyValueMap.get(key);
    }

    getByValue(value: V): K | undefined {
        return this.valueKeyMap.get(value);
    }

    deleteByKey(key: K): void {
        const value = this.getByKey(key);

        if (value) {
            this.valueKeyMap.delete(value);
            this.keyValueMap.delete(key);
        } else {
            throw new Error(`Cannot delete by key ${key} as its value is not found`);
        }
    }

    deleteByValue(value: V): void {
        const key = this.getByValue(value);

        if (key) {
            this.keyValueMap.delete(key);
            this.valueKeyMap.delete(value);
        } else {
            throw new Error(`Cannot delete by value ${value} as its key is not found`);
        }
    }

    forEach(cb: (value: V, key: K, map: Map<K, V>) => void) {
        this.keyValueMap.forEach(cb);
    }

    clear() {
        this.keyValueMap = new Map();
        this.valueKeyMap = new Map();
    }
}

export default BiMap;
