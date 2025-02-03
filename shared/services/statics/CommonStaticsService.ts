import { ONE_HOUR } from '../../constants';
import { PATHS } from './constants';

type Paths = typeof PATHS;

abstract class CommonStaticsService {
    protected abstract STATICS_URL;

    protected hash = (Math.round(Date.now() / ONE_HOUR) * ONE_HOUR).toString(36);

    get<K1 extends keyof Paths>(key: K1): Paths[K1];
    get<K1 extends keyof Paths, K2 extends keyof Paths[K1]>(key1: K1, key2: K2): Paths[K1][K2];
    get<K1 extends keyof Paths, K2 extends keyof Paths[K1], K3 extends keyof Paths[K1][K2]>(
        key1: K1,
        key2: K2,
        key3: K3,
    ): Paths[K1][K2][K3];
    get<
        K1 extends keyof Paths,
        K2 extends keyof Paths[K1],
        K3 extends keyof Paths[K1][K2],
        K4 extends keyof Paths[K1][K2][K3],
    >(key1: K1, key2: K2, key3: K3, key4: K4): Paths[K1][K2][K3][K4];
    get<
        K1 extends keyof Paths,
        K2 extends keyof Paths[K1],
        K3 extends keyof Paths[K1][K2],
        K4 extends keyof Paths[K1][K2][K3],
        K5 extends keyof Paths[K1][K2][K3][K4],
    >(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): Paths[K1][K2][K3][K4][K5];
    get<Keys extends [keyof Paths, ...string[]]>(...keys: Keys): string {
        const path = keys.reduce((config: Paths | string, key) => config[key], PATHS as any);

        return `${this.STATICS_URL}${path}?h=${this.hash}`;
    }
}

export default CommonStaticsService;
