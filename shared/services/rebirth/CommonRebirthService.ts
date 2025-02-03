import { toEggsInt } from '../../domain/amounts';
import { getKeyPart } from '../../domain/contract-data';
import type { RebirthProps } from '../../types';
import { maybe, split } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { AssetId, CurrentPrice, RebirthTxParams } from './data-types';
abstract class CommonRebirthService extends AbstractDataFetcher {
    protected abstract DAPP_ADDRESS: string;

    private rebirthPrice: eggint | undefined;

    abstract priceKey: string;

    getRebirthPrice = async (): Promise<eggint> => {
        if (this.rebirthPrice) {
            return this.rebirthPrice;
        }

        const defaultPrice = toEggsInt(0.5);
        try {
            const response = await this.fetchDataByKey<CurrentPrice>(this.priceKey);

            if (response && response.value > 0) {
                this.rebirthPrice = response.value;
                return response.value;
            }
            return defaultPrice;
        } catch (e) {
            console.error(e);
            return defaultPrice;
        }
    };

    getRebirths = async (address: string): Promise<RebirthProps[]> => {
        try {
            const rebirths: Record<txId, any> = {};
            const rebirthKeys = await this.fetchDataMatch<RebirthTxParams>(`address_${address}_initTx_.*?`);

            rebirthKeys.forEach(({ key, value }) => {
                const [, , , initTx, prop] = split(key, '_');
                if (!rebirths[initTx]) {
                    rebirths[initTx] = {
                        initTx,
                    };
                }
                rebirths[initTx][prop] = value;
            });
            return Object.values(rebirths);
        } catch (e) {
            return [];
        }
    };

    getRebirthByAssetOnAddress = async (address: addressId, assetId: assetId): Promise<RebirthProps | undefined> => {
        const entries = await this.fetchDataMatch<AssetId>(`address_${address}_initTx_.*?_assetId`);

        return maybe(entries.find(({ value }) => value === assetId))
            .map(async ({ key }) => {
                const txId = getKeyPart(key, 3);

                const txParams = await this.fetchDataByKeys<RebirthTxParams>([
                    `address_${address}_initTx_${txId}_assetRarity`,
                    `address_${address}_initTx_${txId}_finishBlock`,
                    `address_${address}_initTx_${txId}_result`,
                    `address_${address}_initTx_${txId}_result1`,
                    `address_${address}_initTx_${txId}_status`,
                    `address_${address}_initTx_${txId}_win`,
                    `address_${address}_initTx_${txId}_win1`,
                ]);
                const params: RebirthProps = txParams.reduce((result: any, { key, value }) => {
                    result[getKeyPart(key, 4)] = value;

                    return result;
                }, {} as RebirthProps);

                params.initTx = txId;
                params.assetId = assetId;
                return params;
            })
            .get();
    };
}

export default CommonRebirthService;
