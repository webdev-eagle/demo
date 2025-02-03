import { ONE_SECOND } from '../constants';
import CacheMap from '../structures/CacheMap';
import type { AddressAssetBalance, AddressWavesBalance, ContractData } from '../types';
import { urlString } from '../utils';
import type CommonHelperService from './helper';
import { ReferralRanking, UserReference } from './referrals/data-types';

type DataMap<Data extends ContractData> = { [T in Data as T['key']]: T['value'] };

abstract class AbstractDataFetcher<AllData extends ContractData = ContractData> {
    protected abstract helperService: CommonHelperService;
    protected abstract DAPP_ADDRESS: addressId;
    protected staticCache = new CacheMap<string, Promise<any>>({ ttl: 30 * ONE_SECOND });

    protected createStaticGetter = <Statics extends Record<string, string>>(statics: Statics) => {
        return <K extends keyof Statics, StaticKey extends Statics[K]>(
            key: K,
        ): Promise<DataMap<AllData>[StaticKey]> => {
            const staticKey = statics[key];

            return this.staticCache.getOr(staticKey, async () => {
                const entry = await this.fetchDataByKey(staticKey);

                return entry?.value;
            });
        };
    };

    fetchAllData = async <D extends ContractData = AllData>(options: { avoidCache?: boolean } = {}): Promise<D[]> => {
        try {
            return this.helperService.fetchAllContractData<D>(this.DAPP_ADDRESS, options);
        } catch (e) {
            return [];
        }
    };

    fetchDataByKey = async <D extends ContractData>(
        key: string,
        options: { avoidCache?: boolean } = {},
    ): Promise<D | undefined> => {
        try {
            const data = await this.helperService.fetchContractDataByKeys<D>(this.DAPP_ADDRESS, [key], options);

            return data[0];
        } catch (e: any) {
            console.error(`[fetchDataByKey][${key}]`, e.message, e);
            return;
        }
    };

    fetchDataByKeys = async <D extends ContractData>(
        keys: string[],
        options: { avoidCache?: boolean; sequentially?: boolean; useCache?: boolean } = {},
    ): Promise<D[]> => {
        try {
            return this.helperService.fetchContractDataByKeys<D>(this.DAPP_ADDRESS, keys, options);
        } catch (e: any) {
            console.error('[fetchDataByKeys]', e.message, e, keys);
            return [];
        }
    };

    fetchDataMatch = async <D extends ContractData>(
        pattern: string,
        options: { avoidCache?: boolean } = {},
    ): Promise<D[]> => {
        try {
            return this.helperService.fetchContractDataByMatch<D>(this.DAPP_ADDRESS, pattern, options);
        } catch (e: any) {
            console.error(`[fetchDataMatch][${pattern}]`, e.message, e);
            return [];
        }
    };

    fetchAssetBalance = async (assetId: string | null): Promise<integer> => {
        const { http, NODE_URL } = this.helperService;

        if (assetId === 'WAVES' || assetId === null) {
            const { data } = await http.get<AddressWavesBalance>(
                urlString(`${NODE_URL}/addresses/balance`, {
                    address: this.DAPP_ADDRESS,
                }),
            );

            return data.balance;
        }

        const { data } = await http.get<AddressAssetBalance>(
            `${NODE_URL}/assets/balance/${this.DAPP_ADDRESS}/${assetId}`,
        );

        return data.balance;
    };

    fetchReferrals = async (address: string) /* : Promise<Array<UserReference>> */ => {
        const { http, API_URL } = this.helperService;
        const { data } = await http.get<Array<UserReference>>(`${API_URL}/v1/referrer/${address}`);
        return data;
    };

    fetchReferralsRanking = async () /* : Promise<Array<UserReference>> */ => {
        const { http, API_URL } = this.helperService;
        const { data } = await http.get<Array<ReferralRanking>>(`${API_URL}/v1/referrer/ranking`);
        return data;
    };
}

export default AbstractDataFetcher;
