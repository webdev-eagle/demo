import { ASSET } from '$shared/constants';
import { ASSETS_BIMAP, getAddress, getAssetID } from '$shared/domain/constants';
import { AssetDetails } from '$shared/types';
import { IDappAddress } from '$shared/types/burnedEggs';
import { getEnv, urlString } from '$shared/utils';
import { BurnedAmmPool } from '../burn/data-types';
import type CommonHelperService from '../helper';
import type CommonPricesAndBalanceService from '../prices-and-balance';
import { TOKEN_INFO } from '../prices-and-balance/CommonPrices&BalanceService';
import { Balance } from './types';

abstract class CommonAMMPoolService {
    protected abstract helperService: CommonHelperService;
    protected abstract pricesAndBalanceService: CommonPricesAndBalanceService;
    protected abstract API_URL: string;

    getAvailableAssets = async (amm: string): Promise<string[]> => {
        const { data: staticTokenIds } = await this.helperService.fetchData(
            urlString(`addresses/data/${amm}`, {
                key: ['static_tokenIds'],
            }),
            false,
        );
        const { value } = staticTokenIds[0];
        return value.split(',');
    };

    getState = async (address): Promise<Array<{ key: string; value: any }>> => {
        const responses = await this.helperService.fetchData(urlString(`addresses/data/${address}`), false);
        return responses.data;
    };

    getBlockchainBalances = async (address): Promise<Array<{ key: string; value: any }>> => {
        const response = await this.helperService.fetchData(urlString(`assets/balance/${address}`), false);
        return response?.data?.balances;
    };

    getEggPrice = async () => {
        const { decimals, price } = await this.pricesAndBalanceService.getAssetPrice('EGG');
        return price / decimals;
    };

    getCalculatePrice = async (
        assetId: string,
        eggWeight: number,
        amountEgg: number,
        shareOtherAsset: number,
        otherAssetAmount: number,
        eggDecimals: number,
        otherAssetDecimals: number,
    ) => {
        //EVERY POOL HAS EGG, SO BASED ON EGG WE CAN CALCULATE THE PRICE OF OTHER ASSET
        const eggPrice = await this.getEggPrice();
        const EGG_ASSET_ID = getAssetID('EGG');
        if (assetId == EGG_ASSET_ID) {
            return eggPrice;
        }
        const calculateEggShare = (amountEgg / Math.pow(10, eggDecimals)) * eggPrice;
        const calculatePrice1Procent = calculateEggShare / eggWeight;
        const calculateValueOtherAsset = calculatePrice1Procent * shareOtherAsset;
        const price = (calculateValueOtherAsset / otherAssetAmount) * Math.pow(10, otherAssetDecimals);
        return price;
    };

    getBalances = async (
        globalBalances,
        tokenWeights: Array<{ key: string; value: any; address?: string }>,
        detailsAssets: AssetDetails[],
    ): Promise<Balance[]> => {
        const EGG_ASSET_ID = getAssetID('EGG');
        const eggBalance = globalBalances.find(({ key }) => key === 'global_' + EGG_ASSET_ID + '_balance').value;
        const eggWeight = tokenWeights.find(({ key }) => key === 'static_' + EGG_ASSET_ID + '_weight')?.value;
        return await Promise.all(
            globalBalances.map(async ({ key, value, address }, index) => {
                const assetId = key.split('_')[1];
                const assetKey = ASSETS_BIMAP.getByValue(assetId)!;
                const weight = tokenWeights.find(({ key }) => key === `static_${assetId}_weight`)?.value;
                const price = await this.getCalculatePrice(assetId, eggWeight, eggBalance, weight, value, 8, 8);
                const decimal = detailsAssets.find((asset) => asset.assetId === assetId)?.decimals ?? 0;

                const decimals = Math.pow(10, decimal);
                return {
                    title: TOKEN_INFO[assetKey].title,
                    cover: TOKEN_INFO[assetKey].cover,
                    weight,
                    balance: value / decimals,
                    value: (value / decimals) * price,
                    price,
                    assetId,
                    assetKey,
                    decimals,
                    tokenValue: value,
                    index: value / globalBalances[0].value,
                    address,
                };
            }),
        );
    };

    getAssetToAssetPrice = async (fromAssetId: string, toAssetId: string, amm: string): Promise<number> => {
        if (fromAssetId === toAssetId) {
            return Promise.resolve(1);
        }

        const { data: globalBalances } = await this.helperService.fetchData(
            urlString(`addresses/data/${amm}`, {
                matches: 'global_.*?_balance',
            }),
            false,
        );

        const { value: fromAssetBalance } = globalBalances.find(
            ({ key }) => key === `global_${fromAssetId}_balance`,
        ) ?? { value: 0 };
        const { value: toAssetBalance } = globalBalances.find(({ key }) => key === `global_${toAssetId}_balance`) ?? {
            value: 0,
        };

        return toAssetBalance / fromAssetBalance;
    };

    getAssetIdToken = (data) => {
        const tokenList: { tokenId: string; value: number }[] = [];
        Object.keys(data).forEach((token) => {
            const tokenId = data[token].key.split('_')[2];
            const volumeValue = data[token].value;
            const volumeDailyToken = {
                tokenId: tokenId,
                value: volumeValue,
            };
            tokenList.push(volumeDailyToken);
        });
        return tokenList;
    };

    getPoolDailyRevenue = async (amm: string, tokenWeights, globalBalances) => {
        const daysPassed = this.helperService.getDaysPassed(await this.getPoolDailyStartTimer(amm));
        const { data } = await this.helperService.fetchData(
            urlString(`addresses/data/${amm}`, { matches: `reveneu_day_.*_${daysPassed}` }),
            false,
        );
        if (data === undefined) {
            return 0;
        }
        const revenueList = this.getAssetIdToken(data);
        const valueAllRevenue = await this.calculateAllAssetsCurrentValue(revenueList, tokenWeights, globalBalances);
        return valueAllRevenue;
    };

    getPoolDailyStartTimer = async (amm: string) => {
        const { data } = await this.helperService.fetchData(
            urlString(`addresses/data/${amm}`, { matches: `static_startTsMs` }),
            false,
        );
        return data[0].value;
    };

    getPoolMonthlyVolume = async (amm: string, tokenWeights, globalBalances) => {
        const monthlyVolumeData: [number, number][] = [];
        const { data } = await this.helperService.fetchData(
            urlString(`addresses/data/${amm}`, { matches: `volume_day_.*_.*` }),
            false,
        );
        const today = this.helperService.getDaysPassed(await this.getPoolDailyStartTimer(amm));
        for (let index = 0; index < 7; index++) {
            const pattern = `volume_day_.*_${today - index}`;
            const matchingItems = data.filter((item: any) => {
                return item.key.match(new RegExp(pattern));
            });
            const day = this.helperService.getConvertedDay(await this.getPoolDailyStartTimer(amm), today - index);
            if (matchingItems.length === 0) {
                monthlyVolumeData.push([day, 0]);
            }
            const dailyVolume = this.getAssetIdToken(matchingItems);
            const valueAllVolume = await this.calculateAllAssetsCurrentValue(dailyVolume, tokenWeights, globalBalances);
            monthlyVolumeData.push([day, parseFloat(valueAllVolume.toFixed(2))]);
        }
        return monthlyVolumeData;
    };

    getPoolDailyVolume = async (amm: string, tokenWeights, globalBalances) => {
        const daysPassed = this.helperService.getDaysPassed(await this.getPoolDailyStartTimer(amm));

        const { data } = await this.helperService.fetchData(
            urlString(`addresses/data/${amm}`, { matches: `volume_day_.*_${daysPassed}` }),
            false,
        );
        if (data === undefined) {
            return 0;
        }
        const volumeList = this.getAssetIdToken(data);
        const valueAllVolume = await this.calculateAllAssetsCurrentValue(volumeList, tokenWeights, globalBalances);

        return valueAllVolume;
    };

    calculateAllAssetsCurrentValue = async (
        assetList: { tokenId: string; value: number }[],
        tokenWeights: Array<{ key: string; value: any; address?: string }>,
        globalBalances,
    ) => {
        const EGG_ASSET_ID = getAssetID('EGG');
        const eggBalance = globalBalances.find(({ key }) => key === 'global_' + EGG_ASSET_ID + '_balance')?.value;
        const eggWeight = tokenWeights.find(({ key }) => key === 'static_' + EGG_ASSET_ID + '_weight')?.value;

        let total = 0;
        const keys = Object.keys(assetList);
        const assetPromises = keys.map(async (token) => {
            const price = await this.getCalculatePrice(
                assetList[token].tokenId,
                eggWeight,
                eggBalance,
                tokenWeights.find(({ key }) => key === `static_${assetList[token].tokenId}_weight`)?.value,
                globalBalances.find(({ key }) => key === 'global_' + assetList[token].tokenId + '_balance')?.value,
                8,
                8,
            );
            return price * (assetList[token].value / Math.pow(10, 8));
        });

        const assetValues = await Promise.all(assetPromises);
        total = assetValues.reduce((acc, value) => acc + value, 0);

        return total;
    };

    fetchAmmPool = async (): Promise<IDappAddress[]> => {
        const contractsData = await this.helperService.fetchContractDataByMatch<BurnedAmmPool>(
            getAddress('CF_AMM_DAPP'),
            `global_.*_burned`,
        );
        const burnedAmmPoolList = contractsData.map((contractData) => {
            const value = Number((contractData.value / 1e8).toFixed(2));
            const key = this.getAssetNameByKey(contractData.key.split('_')[1]);
            return { key, value };
        });

        return burnedAmmPoolList;
    };

    private getAssetNameByKey(key: string): string {
        const envAssets = ASSET[getEnv().toUpperCase()];
        let name = Object.keys(envAssets).find((envAssetKey) => envAssets[envAssetKey] === key);
        if (!name) return key;
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        return name;
    }
}

export default CommonAMMPoolService;
