import { ASSET, Assets } from '../../constants';
import { ASSETS_BIMAP, getAddress, getAssetID } from '../../domain/constants';
import DECIMALS from '../../domain/decimals';
import { isAddress } from '../../domain/guards';
import type { DuxplorerCollectiveStat, IAssetBalances, ICollectiveFarmTokenPrice } from '../../types';
import { int, roundUp, subtractPercent, urlString } from '../../utils';
import type CommonAccountBoosterService from '../account-boosters';
import type CommonArtefactService from '../artefact';
import type CommonCollectiveFarmService from '../collective-farm';
import type CommonCouponsService from '../coupons';
import type CommonHelperService from '../helper';
import type CommonIncubatorService from '../incubator';
import { log } from '../log';
import type { CollectiveFarmBalance, CommonCollectiveFarms, Estimated, TokenBalance, TokenInfo } from './types';
import {
    collectiveFarmMapper,
    getCollectiveFarmBalance,
    getCollectiveFarmDuxplorerInfo,
    getShareAssetPrice,
} from './utils';

const PUZZLE_POOLS = getAddress('PUZZLE_POOLS');

const XTN_ASSET_ID = getAssetID('XTN');
const EGG_ASSET_ID = getAssetID('EGG');
const SPICE_ASSET_ID = getAssetID('SPICE');
const OLD_EGG_ASSET_ID = getAssetID('OLD_EGG');
const BTC_ASSET_ID = getAssetID('BTC');
const USDT_ASSET_ID = getAssetID('USDT');
const ETH_ASSET_ID = getAssetID('ETH');
const PETE_ASSET_ID = getAssetID('PETE');
const STREET_ASSET_ID = getAssetID('STREET');
const FOMO_ASSET_ID = getAssetID('FOMO');
const KOLKHOZ_ASSET_ID = getAssetID('KOLKHOZ');
const TURTLE_ASSET_ID = getAssetID('TURTLE');
const LATAM_ASSET_ID = getAssetID('LATAM');
const EGGPOINT_ASSET_ID = getAssetID('EGGPOINT');
const DUXPLORER_ASSET_ID = getAssetID('DUXPLORER');

export const TOKEN_INFO: Record<keyof Assets, TokenInfo> = {
    WAVES: {
        assetId: null,
        decimals: DECIMALS.WAVES,
        title: 'WAVES',
        cover: '/static/img/token/waves.svg',
    },
    OLD_EGG: {
        assetId: OLD_EGG_ASSET_ID,
        decimals: DECIMALS.OLD_EGG,
        title: 'OLD_EGG',
        cover: '/static/img/token/egg.svg',
    },
    USDT: {
        assetId: USDT_ASSET_ID,
        decimals: DECIMALS.USDT,
        title: 'USDT',
        cover: '/static/img/token/usdt.svg',
    },
    XTN: {
        assetId: XTN_ASSET_ID,
        decimals: DECIMALS.XTN,
        title: 'XTN',
        cover: '/static/img/token/xtn.svg',
    },
    ETH: {
        assetId: ETH_ASSET_ID,
        decimals: DECIMALS.ETH,
        title: 'ETH',
        cover: '/static/img/token/eth.svg',
    },
    BTC: {
        assetId: BTC_ASSET_ID,
        decimals: DECIMALS.BTC,
        title: 'BTC',
        cover: '/static/img/token/btc.svg',
    },
    SPICE: {
        assetId: SPICE_ASSET_ID,
        decimals: DECIMALS.SPICE,
        title: 'SPICE',
        cover: '/static/img/token/spice.svg',
    },
    PETE: {
        assetId: PETE_ASSET_ID,
        decimals: DECIMALS.PETE,
        title: 'PETE',
        cover: '/static/img/token/spice.svg',
    },
    STREET: {
        assetId: STREET_ASSET_ID,
        decimals: DECIMALS.STREET,
        title: 'STREET',
        cover: '/static/img/token/waves.svg',
    },
    FOMO: {
        assetId: FOMO_ASSET_ID,
        decimals: DECIMALS.FOMO,
        title: 'FOMO',
        cover: '/static/img/token/waves.svg',
    },
    KOLKHOZ: {
        assetId: KOLKHOZ_ASSET_ID,
        decimals: DECIMALS.KOLKHOZ,
        title: 'KOLKHOZ',
        cover: '/static/img/token/waves.svg',
    },
    TURTLE: {
        assetId: TURTLE_ASSET_ID,
        decimals: DECIMALS.TURTLE,
        title: 'TURTLE',
        cover: '/static/img/token/waves.svg',
    },
    LATAM: {
        assetId: LATAM_ASSET_ID,
        decimals: DECIMALS.LATAM,
        title: 'LATAM',
        cover: '/static/img/token/waves.svg',
    },
    EGGPOINT: {
        assetId: EGGPOINT_ASSET_ID,
        decimals: DECIMALS.EGGPOINT,
        title: 'EGGPOINT',
        cover: '/static/img/token/waves.svg',
    },
    DUXPLORER: {
        assetId: DUXPLORER_ASSET_ID,
        decimals: DECIMALS.DUXPLORER,
        title: 'DUXPLORER',
        cover: '/static/img/token/waves.svg',
    },
    EGG: {
        assetId: EGG_ASSET_ID,
        decimals: DECIMALS.EGG,
        title: 'EGG',
        cover: '/static/img/token/egg.svg',
    },
};

const createTokenBalance =
    (token) =>
    (balance, price = 0) => ({
        ...TOKEN_INFO[token],
        balance: balance / DECIMALS[token],
        price,
    });

const TOKEN_BALANCE: Record<keyof Assets, (balance: integer, price?: number) => TokenBalance> = {
    WAVES: createTokenBalance('WAVES'),
    EGG: createTokenBalance('EGG'),
    OLD_EGG: createTokenBalance('OLD_EGG'),
    USDT: createTokenBalance('USDT'),
    XTN: createTokenBalance('XTN'),
    ETH: createTokenBalance('ETH'),
    BTC: createTokenBalance('BTC'),
    SPICE: createTokenBalance('SPICE'),
    PETE: createTokenBalance('PETE'),
    STREET: createTokenBalance('STREET'),
    FOMO: createTokenBalance('FOMO'),
    KOLKHOZ: createTokenBalance('KOLKHOZ'),
    TURTLE: createTokenBalance('TURTLE'),
    LATAM: createTokenBalance('LATAM'),
    EGGPOINT: createTokenBalance('EGGPOINT'),
    DUXPLORER: createTokenBalance('DUXPLORER'),
};

abstract class CommonPricesBalanceService {
    protected abstract helperService: CommonHelperService;
    protected abstract collectiveFarmService: CommonCollectiveFarmService;
    protected abstract artefactService: CommonArtefactService;
    protected abstract accountBoosterService: CommonAccountBoosterService;
    protected abstract incubatorService: CommonIncubatorService;
    protected abstract couponsService: CommonCouponsService;
    protected abstract BACKEND_SWOPFI_URL: string;
    protected abstract ROUTING_SWOPFI_URL: string;
    protected abstract DUXPLORER_URL: string;
    protected abstract API_URL: string;

    poolData: any = {};
    data = new Map<any, any>();

    PERCH_PRICE: eggint = int(1e8);
    BEACH_PRICE: eggint = int(2e8);
    MUTARIUM_PRICE: eggint = int(4e8);
    MANTLE_PRICE: eggint = int(1e8);

    getTokenDetail = (asset: keyof Assets) => TOKEN_BALANCE[asset];

    /**
     * Returns the balance of an asset
     * @param {string} address
     * @return Promise<IAssetBalances[]>
     */
    getAssetBalances = async (address: string): Promise<IAssetBalances[]> => {
        const { NODE_URL, http } = this.helperService;
        return http
            .get(`${NODE_URL}/assets/balance/${address}`)
            .then((result) => result.data.balances)
            .catch((error) => {
                console.log('An error occurred in method getAssetBalances:', error.message);
                return 0;
            });
    };

    getPuzzleAssetPrices = async (): Promise<ICollectiveFarmTokenPrice[]> => {
        const { fetchData } = this.helperService;
        let allAssets = [];
        const XTN_PRICE = await this.getAssetToDollarPrice('XTN');
        for (const pool of PUZZLE_POOLS) {
            const { data: staticState } = await fetchData(`addresses/data/${pool}?matches=static_.*?`);
            const balances = await this.getAssetBalances(pool);
            const balancesMap = balances.reduce((acc, asset) => {
                // eslint-disable-next-line no-param-reassign
                acc[asset.assetId] = asset.balance;
                return acc;
            }, Object.create(null));
            const assets = staticState
                .filter((kv) => kv.key.indexOf('static_') !== -1 && kv.key.indexOf('_weight') !== -1)
                .map((kv) => {
                    const assetId = kv.key.split('_')[1];
                    const xtnWeight = staticState.find((kv) => kv.key === `static_${XTN_ASSET_ID}_weight`).value;
                    return {
                        pool,
                        weight: kv.value,
                        assetId,
                        price:
                            ((balancesMap[XTN_ASSET_ID] / xtnWeight / (balancesMap[assetId] / kv.value)) * 100) /
                            XTN_PRICE,
                    };
                });
            allAssets = allAssets.concat(assets);
        }

        return allAssets;
    };

    async getAssetPrice(ofAssetName: keyof Assets, inAssetName?: keyof Assets) {
        let price = 0;
        let decimals = 1;

        try {
            if (inAssetName) {
                ({
                    data: { price, decimals },
                } = await this.helperService.http.get(`${this.API_URL}/v1/prices/${ofAssetName}/${inAssetName}`));
            } else {
                ({
                    data: { price, decimals },
                } = await this.helperService.http.get(`${this.API_URL}/v1/prices/${ofAssetName}`));
            }
        } catch (error: any) {
            log('[ERROR] getAssetPrice', ofAssetName, inAssetName, this.API_URL ?? '', error.message);
        }

        return { price, decimals };
    }

    /**
     * Returns the price of the egg price in dollars
     * @return Promise<number>
     */
    getEggPrice = async () => {
        const { decimals, price } = await this.getAssetPrice('EGG');
        return price / decimals;
    };

    /**
     * Returns the price of the waves price in dollars
     * @return Promise<number>
     */
    getWavesPrice = async () => {
        const { decimals, price } = await this.getAssetPrice('WAVES');
        return price / decimals;
    };

    getAssetToAssetPrice = (amount: number, fromAssetId: string, toAssetId: string): Promise<number> => {
        const { http } = this.helperService;

        if (fromAssetId === toAssetId) {
            return Promise.resolve(1);
        }

        return http
            .get<Estimated>(
                urlString(`${this.ROUTING_SWOPFI_URL}/v1/estimated`, {
                    amount_to: Math.round(amount * DECIMALS.EGG),
                    from: fromAssetId,
                    to: toAssetId,
                    slippage_tolerance: 0.1,
                }),
            )
            .then((result) => {
                if (typeof result.data.fromAmount !== 'number' && result.data.fromAmount.length) {
                    const sortByAmount = result.data.fromAmount.sort((a, b) => a.amount - b.amount);
                    const [cheapest] = sortByAmount;

                    const rate = cheapest.price.find(({ type }) => type === 'to-from')?.amount ?? 0;

                    return rate / DECIMALS[ASSETS_BIMAP.getByValue(fromAssetId) ?? 'WAVES'];
                }

                return 0;
            })
            .catch(() => 0);
    };

    getEggToAssetPrice = (amount: number, fromAssetId: string) =>
        this.getAssetToAssetPrice(amount, fromAssetId, ASSET.PRODUCTION.EGG);
    getAssetToDollarPrice = async (toAsset: keyof Assets) => {
        const { decimals, price } = await this.getAssetPrice('USDT', toAsset);
        return price / decimals;
    };

    getMonthlySalesUsd = async (): Promise<number> => {
        const { http } = this.helperService;
        let {
            data: { auctionData: auctionJson = [] },
        } = await http.get<{
            auctionData: Array<{
                eggSell: boolean;
                amount: number;
                timestamp: number;
            }>;
        }>(`${this.DUXPLORER_URL}/auction/json`);
        // if date in this month
        const dateNow = new Date();
        const time30DaysAgo = dateNow.getTime() - 30 * 24 * 60 * 60 * 1000;
        auctionJson = auctionJson.filter((aj) => aj.timestamp > time30DaysAgo);
        const eggPrice = await this.getEggPrice();
        const wavesPrice = await this.getWavesPrice();

        return auctionJson.reduce((acc, aj) => {
            const amount = aj.eggSell ? (aj.amount / 1e8) * eggPrice : (aj.amount / 1e8) * wavesPrice;
            return acc + amount;
        }, 0);
    };

    /**
     * Returns the balance of an asset
     * @param {string} assetId
     * @param {string} address
     * @return Promise<{ data: { address: string, assetId: string, balance: number } }>
     */
    getAssetBalance = async (assetId: string, address: string): Promise<integer> => {
        if (!isAddress(address)) {
            return int(0);
        }

        if (assetId === 'WAVES') {
            const {
                data: { balance },
            } = await this.helperService.http.get<{
                address: addressId;
                confirmations: integer;
                balance: wavesint;
            }>(`${this.helperService.NODE_URL}/addresses/balance/${address}`);

            return balance;
        }

        const {
            data: { balance },
        } = await this.helperService.http.get<{
            address: addressId;
            assetId: assetId;
            balance: integer;
        }>(`${this.helperService.NODE_URL}/assets/balance/${address}/${assetId}`);

        return balance;
    };

    getAssetBalanceNumber =
        (assetId: assetId) =>
        async (address: addressId): Promise<integer> =>
            this.getAssetBalance(assetId, address);

    getWavesBalance = this.getAssetBalanceNumber('WAVES');

    getEggsBalance = this.getAssetBalanceNumber(EGG_ASSET_ID);

    getSpicesBalance = this.getAssetBalanceNumber(SPICE_ASSET_ID);

    getPeteBalance = this.getAssetBalanceNumber(PETE_ASSET_ID);

    getXTNBalance = this.getAssetBalanceNumber(XTN_ASSET_ID);

    getUSDTBalance = this.getAssetBalanceNumber(USDT_ASSET_ID);

    getDuxplorerCollectiveJsonData = async (): Promise<DuxplorerCollectiveStat[]> =>
        (await this.helperService.http.get(`${this.DUXPLORER_URL}/collective2/json`)).data;

    getStakingContractParameter = async <T>({
        paramName,
        stakingContract,
        defaultValue,
    }: {
        paramName: string | string[];
        stakingContract: string | undefined;
        defaultValue: T;
    }): Promise<T> => {
        const { http, NODE_URL } = this.helperService;

        if (!stakingContract) {
            return defaultValue;
        }

        return http
            .get<Array<{ value: T }>>(urlString(`${NODE_URL}/addresses/data/${stakingContract}`, { key: paramName }))
            .then(({ data }) => data[0]?.value ?? defaultValue)
            .catch(() => defaultValue);
    };

    getUserStakingContractParameter = async <T>({
        paramName,
        stakingContract,
        userAddress,
        defaultValue,
    }: {
        paramName: 'claimed' | 'farm_staked' | 'lastCheck_interest';
        stakingContract: string | undefined;
        userAddress: string;
        defaultValue: T;
    }): Promise<T> => {
        return this.getStakingContractParameter({
            paramName: `${userAddress}_${paramName}`,
            stakingContract,
            defaultValue,
        });
    };

    getUserFarmStaked = (stakingContract: string, userAddress: string): Promise<number> =>
        this.getUserStakingContractParameter({
            paramName: 'farm_staked',
            stakingContract,
            userAddress,
            defaultValue: 0,
        });

    getUserTotalClaimed = (stakingContract: string, userAddress: string): Promise<number> =>
        this.getUserStakingContractParameter({ paramName: 'claimed', stakingContract, userAddress, defaultValue: 0 });

    getUserLastCheckInterest = (stakingContract: string, userAddress: string): Promise<number> =>
        this.getUserStakingContractParameter({
            paramName: 'lastCheck_interest',
            stakingContract,
            userAddress,
            defaultValue: 0,
        });

    getCurrentInterest = (stakingContract: string): Promise<number> =>
        this.getStakingContractParameter({
            paramName: 'global_lastCheck_interest',
            stakingContract,
            defaultValue: 0,
        });

    getTokenBalance = async (asset: keyof Assets, address: addressId): Promise<TokenBalance> => {
        const [balance] = await Promise.all([this.getAssetBalance(getAssetID(asset), address)]);
        return TOKEN_BALANCE[asset](balance, balance / DECIMALS[asset]);
    };

    getTokenInfo = (asset: keyof Assets): TokenInfo => TOKEN_INFO[asset];

    getUserTokensBalance = async (address: string): Promise<TokenBalance[]> => {
        const keys: (keyof Assets)[] = Object.keys(TOKEN_BALANCE) as (keyof Assets)[];
        return Promise.all(
            keys.map((key) => {
                return this.getTokenBalance(key, address);
            }),
        );
    };

    getCommonCollectiveFarms = async (): Promise<CommonCollectiveFarms[]> => {
        const { getActiveCollectiveFarms } = this.collectiveFarmService;
        const [collectiveFarms, duxplorerCollectiveJson] = await Promise.all([
            getActiveCollectiveFarms(),
            this.getDuxplorerCollectiveJsonData(),
        ]);

        return collectiveFarms.map((farm) => {
            const json = duxplorerCollectiveJson.find((json) => json.owner === farm.contract);

            if (json) {
                return {
                    ...farm,
                    ...json,
                };
            }

            return farm;
        }) as CommonCollectiveFarms[];
    };

    getUserCollectiveFarmsBalance = async (userAddress: string): Promise<CollectiveFarmBalance[]> => {
        const { getActiveCollectiveFarms } = this.collectiveFarmService;
        const [collectiveFarms, balances, shareAssetPrices, duxplorerCollectiveJson] = await Promise.all([
            getActiveCollectiveFarms(),
            this.getAssetBalances(userAddress),
            this.getPuzzleAssetPrices(),
            this.getDuxplorerCollectiveJsonData(),
        ]);

        const farmParams: Array<[staked: number, claimed: number, lastCheckInterest: number, currentInterest: number]> =
            await Promise.all(
                collectiveFarms.map(({ stakingContract }) =>
                    Promise.all([
                        this.getUserFarmStaked(stakingContract, userAddress),
                        this.getUserTotalClaimed(stakingContract, userAddress),
                        this.getUserLastCheckInterest(stakingContract, userAddress),
                        this.getCurrentInterest(stakingContract),
                    ]),
                ),
            );

        return collectiveFarms
            .map((collectiveFarm, i) => {
                const [staked, claimed, lastCheckInterest, currentInterest] = farmParams[i];

                return collectiveFarmMapper(collectiveFarm, {
                    collectiveFarmBalance: getCollectiveFarmBalance(balances, collectiveFarm.shareAssetId),
                    shareAssetPrice: getShareAssetPrice(shareAssetPrices, collectiveFarm.shareAssetId),
                    duxplorerCollectiveJson: getCollectiveFarmDuxplorerInfo(
                        duxplorerCollectiveJson,
                        collectiveFarm.contract,
                    ),
                    staked,
                    claimed,
                    lastCheckInterest,
                    currentInterest,
                });
            })
            .sort((a, b) => (a.balance < b.balance ? 1 : -1));
    };

    getUserPageBalance = async (address: string): Promise<Array<TokenBalance | CollectiveFarmBalance>> => {
        const res = await Promise.all([
            this.getUserTokensBalance(address),
            this.getUserCollectiveFarmsBalance(address),
        ]);

        return res.flat();
    };

    getPerchDiscount = async (userAddress: addressId, isAvailable = true): Promise<number> => {
        const isMistletoeStaked = await this.accountBoosterService.isUserStakedItem(userAddress, 'ART-XMISTL');

        return isMistletoeStaked && isAvailable ? 10 : 0;
    };

    getPerchPriceForUser = async (userAddress: addressId, pricePerch, isAvailable?: boolean): Promise<eggint> => {
        const [discount, coupons] = await Promise.all([
            this.getPerchDiscount(userAddress, isAvailable),
            this.couponsService.fetchAvailableCoupons(userAddress),
        ]);

        const discountedPrice = roundUp(subtractPercent(pricePerch, discount));
        const result = this.couponsService.calculateDiscountedPrice(discountedPrice, coupons);
        return result;
    };

    getBeachPriceForUser = async (userAddress: addressId, pricePerch): Promise<eggint> => {
        const [coupons] = await Promise.all([this.couponsService.fetchAvailableCoupons(userAddress)]);
        const discountedPrice = roundUp(subtractPercent(pricePerch, 0));
        const result = this.couponsService.calculateDiscountedPriceTurtles(discountedPrice, coupons);
        return result;
    };

    getMutariumPriceForUser = async (userAddress: addressId, mutariumPrice): Promise<eggint> => {
        const [discount, coupons] = await Promise.all([
            this.getPerchDiscount(userAddress),
            this.couponsService.fetchAvailableCoupons(userAddress),
        ]);
        const discountedPrice = roundUp(subtractPercent(mutariumPrice, discount));
        const result = this.couponsService.calculateDiscountedPrice(discountedPrice, coupons);
        return result;
    };

    calculateDuckHatchPrice = (lastDuckPrice: eggint, availableCoupons: integer): integer => {
        return this.couponsService.calculateDiscountedPrice(int(lastDuckPrice + 2e6), availableCoupons);
    };

    calculatedDuckHatchSpentCoupons = (lastDuckPrice: eggint, availableCoupons: integer): integer => {
        return this.couponsService.calculateSpentCoupons(int(lastDuckPrice + 2e6), availableCoupons);
    };

    calculateTurtleHatchPrice = (lastTurtlePrice: eggint): integer => {
        return this.couponsService.calculateDiscountedPrice(int(lastTurtlePrice), int(0));
    };
    calculateAnimalHatchPrice = (lastanimalPrice: eggint): integer => {
        return this.couponsService.calculateDiscountedPrice(int(lastanimalPrice), int(0));
    };
    calculatedTurtleHatchSpentCoupons = (lastTurtlePrice: eggint, availableCoupons: integer): integer => {
        return this.couponsService.calculateSpentCoupons(int(lastTurtlePrice + 2e6), availableCoupons);
    };

    calculatedCanineHatchSpentCoupons = (lastCaninePrice: eggint, availableCoupons: integer): integer => {
        return this.couponsService.calculateSpentCoupons(int(lastCaninePrice + 2e6), availableCoupons);
    }; //Need to be  changed if the values is different;

    calculatedFelineHatchSpentCoupons = (lastFelinePrice: eggint, availableCoupons: integer): integer => {
        return this.couponsService.calculateSpentCoupons(int(lastFelinePrice + 2e6), availableCoupons);
    };
}

export default CommonPricesBalanceService;
