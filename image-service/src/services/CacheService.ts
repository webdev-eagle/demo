import axios from 'axios';

import { log } from '$shared/services/log';
import type { CacheApi, UrlParams } from '$shared/types';
import { isDevEnv, isDevOnlyEnv, singleton, urlString } from '$shared/utils';

import { isPortTaken } from '../utils';

class CacheService {
    protected MAIN_CACHE_READER_URL =
        process.env.CACHE_READER_URL || (isDevEnv() ? `http://localhost:8005` : 'http://cache-reader:8005');

    protected STAGING_CACHE_READER_URL = 'https://cache.staging.wavesducks.com';

    protected isCacheServiceRunning = singleton(async (): Promise<boolean> => {
        if (!isDevOnlyEnv()) {
            return true;
        }
        const isRunning: boolean = await isPortTaken(8005);

        if (!isRunning) {
            log('Local cache reader not running, use staging one');
        }

        return isRunning;
    });

    protected getBaseUrl = (): Promise<string> =>
        this.isCacheServiceRunning().then((isRunning) =>
            isRunning ? this.MAIN_CACHE_READER_URL : this.STAGING_CACHE_READER_URL,
        );

    protected get = async <T>(path: `/${string}`, params?: UrlParams): Promise<T | null> => {
        const baseUrl = await this.getBaseUrl();

        const { data: { entity } = {} } = await axios.get<{ entity: T }>(urlString(`${baseUrl}/api${path}`, params));

        return entity;
    };

    fetchDuck = async (duckId: duckId): Promise<CacheApi.Duck> => this.get<CacheApi.Duck>(`/v1/ducks/${duckId}`);

    fetchTurtle = async (turtleId: turtleId): Promise<CacheApi.Turtle> =>
        this.get<CacheApi.Turtle>(`/v1/turtles/${turtleId}`);

    fetchCanines = async (canineId: animalId): Promise<CacheApi.Duck> =>
        this.get<CacheApi.Duck>(`/v1/canines/${canineId}`);

    fetchFelines = async (felinesId: animalId): Promise<CacheApi.Duck> =>
        this.get<CacheApi.Duck>(`/v1/felines/${felinesId}`);

    fetchDuckling = async (ducklingId: ducklingId): Promise<CacheApi.Duckling> =>
        this.get<CacheApi.Duckling>(`/v1/ducklings/${ducklingId}`);

    fetchMutant = async (mutantId: string): Promise<CacheApi.Mutant> =>
        this.get<CacheApi.Mutant>(`/v1/mutants/${mutantId}`);

    fetchItem = async (itemId: string): Promise<CacheApi.Nft> => this.get<CacheApi.Item>(`/v1/items/nft/${itemId}`);
}

const cacheService = new CacheService();

export default cacheService;
