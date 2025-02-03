import { getAddress } from '$shared/domain/constants';
import { getKeyPart } from '$shared/domain/contract-data';
import { ShakesItProps } from '$shared/types/shakesIt';
import { maybe, split } from '$shared/utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import { AssetId, RebirthTxParams } from '../rebirth/data-types';
import { ShakeItTxParams } from './data-types';

const LOOT_BOXES_DAPP = getAddress('LOOT_BOXES_DAPP');

abstract class CommonShakeItService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = LOOT_BOXES_DAPP;

    getShakes = async (address: string): Promise<ShakesItProps[]> => {
        try {
            const shakes: Record<txId, any> = {};
            const shakesKeys = await this.fetchDataMatch<RebirthTxParams>(`address_${address}_initTx_.*?`);

            shakesKeys.forEach(({ key, value }) => {
                const [, , , initTx, prop] = split(key, '_');
                if (!shakes[initTx]) {
                    shakes[initTx] = {
                        initTx,
                    };
                }
                shakes[initTx][prop] = value;
            });
            return Object.values(shakes);
        } catch (e) {
            return [];
        }
    };

    getShakeItByAssetOnAddress = async (address: addressId, assetId: assetId): Promise<ShakesItProps | undefined> => {
        const entries = await this.fetchDataMatch<AssetId>(`address_${address}_initTx_.*?_assetId`);

        return maybe(entries.find(({ value }) => value === assetId))
            .map(async ({ key }) => {
                const txId = getKeyPart(key, 3);

                const txParams = await this.fetchDataByKeys<ShakeItTxParams>([
                    `address_${address}_initTx_${txId}_finishBlock`,
                    `address_${address}_initTx_${txId}_result`,
                    `address_${address}_initTx_${txId}_status`,
                    `address_${address}_initTx_${txId}_win0`,
                    `address_${address}_initTx_${txId}_win1`,
                    `address_${address}_initTx_${txId}_win2`,
                    `address_${address}_initTx_${txId}_win3`,
                    `address_${address}_initTx_${txId}_win4`,
                    `address_${address}_initTx_${txId}_win5`,
                ]);

                const params: ShakesItProps = txParams.reduce((result: any, { key, value }) => {
                    result[getKeyPart(key, 4)] = value;

                    return result;
                }, {} as ShakesItProps);

                params.initTx = txId;
                params.assetId = assetId;

                return params;
            })
            .get();
    };
}

export default CommonShakeItService;
