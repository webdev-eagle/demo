import { ADDRESS } from '$shared/constants';
import { getAddress } from '$shared/domain/constants';
import { getKeyPart } from '$shared/domain/contract-data';
import { Duck, FarmStats } from '$shared/types/cache-api';
import { IDuckDetailsV2 } from '$shared/types/ducks';
import { IFarmingDetailsV2, IFarmingEntriesV2, IFarmingGlobalsV2, IFarmingParamsV2 } from '$shared/types/farms';
import { capitalize, getEnv, int, split } from '$shared/utils';
import Cache from '../../structures/Cache';
import AbstractDataFetcher from '../AbstractDataFetcher';
import {
    Claimed,
    FarmingEntries,
    FarmingGlobals,
    FarmingGlobalsV2,
    FarmingPower,
    LastCheckInterest,
    OriginalCaller,
    Owner,
} from './data-types';

const DUCK_FARMING_DAPP = getAddress('DUCK_FARMING_DAPP');
const DUCK_HOUSE_DAPP = getAddress('DUCK_HOUSE_DAPP');
const MEGA_DUCK_HOUSE_DAPP = getAddress('MEGA_DUCK_HOUSE_DAPP');
const XMAS_STBLE_DAPP = getAddress('XMAS_STBLE_DAPP');
abstract class CommonFarmingService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = DUCK_FARMING_DAPP;
    private farmingGlobalsCache = new Cache<IFarmingGlobalsV2>({ ttl: 5_000 });

    private addEntry = (
        record: IFarmingEntriesV2,
        paramName: keyof IFarmingEntriesV2 | 'without' | undefined | string,
        value: string | integer | boolean | number,
    ) => {
        if (value == null || paramName === 'without') {
            return record;
        }
        if (record === undefined) {
            return null;
        }
        if (paramName === 'perchColor') {
            record[paramName] = typeof value === 'string' ? value : value.toString();
            return record;
        }

        if (typeof value === 'number' && paramName) {
            record[paramName] = value;
        }

        return record;
    };

    fetchDuckOwnerForFarming = async (duckId: duckId) => {
        const owner = await this.fetchDataByKey<Owner>(`${duckId}_owner`);
        return owner?.value;
    };

    getDuckOwnerForFarming = (duck: IDuckDetailsV2 | Duck): string | undefined => {
        let owner: string | undefined = undefined;
        if (duck.locks) {
            for (const lock of duck.locks) {
                if (
                    lock.dApp === XMAS_STBLE_DAPP ||
                    lock.dApp === DUCK_HOUSE_DAPP ||
                    lock.dApp === MEGA_DUCK_HOUSE_DAPP
                ) {
                    owner = lock.dApp;
                    break;
                } else if (lock.dApp === DUCK_FARMING_DAPP) {
                    owner = duck.owner;
                }
            }
        }
        return owner;
    };

    //TODO: we should refactor this and fully use the cache service to determine the ducks, not go to the database itself anymore.
    //TODO: this is not very performant, especially since we have got all the ducks in the database
    fetchDuckByAddress: (address: addressId) => Promise<FarmingEntries[]> = async (address: addressId) => {
        const farmingDucks = await this.fetchDataMatch<OriginalCaller>(`.*_original_caller`);
        const ducks = farmingDucks.filter(({ value }) => value === address).map(({ key }) => key.split('_')[0]);
        let entries: FarmingEntries[] = [];
        for (const duck of ducks) {
            const matches = await this.fetchDataMatch<FarmingEntries>(`address_.*_asset_${duck}.*?`);
            entries = [...entries, ...matches];
        }
        return entries;
    };

    fetchFarmingEntriesOfDucks = async (duckId: duckId, address: addressId) => {
        const farmingPower = await this.fetchDataMatch<FarmingPower>(`address_${address}_asset_${duckId}_farmingPower`);
        const claimed = await this.fetchDataMatch<Claimed>(`${address}_asset_${duckId}_claimed`);
        const lastCheckInterest = await this.fetchDataMatch<LastCheckInterest>(
            `address_${address}_asset_${duckId}_lastCheckInterest`,
        );
        return [farmingPower[0], claimed[0], lastCheckInterest[0]];
    };

    fetchFarmingGlobals = async (): Promise<IFarmingGlobalsV2> => {
        if (this.farmingGlobalsCache.data) {
            return this.farmingGlobalsCache.data;
        }
        const totalResponse = await this.fetchDataByKeys<FarmingGlobals>(['global_lastCheck_interest', 'total_staked']);

        const totalValues = {
            globalStaked: int(0),
            globalLastCheck: int(0),
        };
        totalResponse.forEach(({ key, value }) => {
            totalValues[`global${capitalize(getKeyPart(key, 1))}`] = value;
        });
        this.farmingGlobalsCache.data = totalValues;

        return this.farmingGlobalsCache.data;
    };

    fetchGlobalData = async (): Promise<{ globalStaked: number; globalLastCheck: number }> => {
        let farmingPower: Array<FarmingGlobalsV2>;
        farmingPower = await this.fetchDataByKeys<FarmingGlobalsV2>([`total_staked`, 'global_lastCheck_interest']);
        //Optimialisation; query it 1 time outside the method, and then pass it to the method
        const global = farmingPower.find((entry) => entry.key === 'total_staked')?.value;
        const globalInterest = farmingPower.find((entry) => entry.key === 'global_lastCheck_interest')?.value;
        return {
            globalStaked: global ? Number(global) : 0,
            globalLastCheck: globalInterest ? Number(globalInterest) : 0,
        };
    };

    calcFarmingPower = async (
        name: string,
        basePower: number | undefined,
        farmingPower: number | undefined,
        global: number | undefined,
        globalInterest: number | undefined,
        chainHeight: number | undefined,
        assetInterest: number | undefined,
        claimed: number | undefined,
    ): Promise<{
        production: number;
        stakedBefore: boolean;
        farmingPower?: number | undefined;
        estimatedBasePower?: number;
        global: number;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    }> => {
        if (farmingPower && assetInterest) {
            const toClaim = this.calculateToClaim({
                currentInterest: globalInterest ?? int(0),
                assetLastCheckInterest: assetInterest,
                farmingPower,
            });
            return {
                stakedBefore: true,
                global: global || 0,
                production: 0,
                toClaim: toClaim,
                globalInterest: globalInterest || 0,
                assetInterest: assetInterest || 0,
                farmingPower,
                claimed: claimed || 0,
            };
        }

        const height = chainHeight ? chainHeight : await this.helperService.getBlockchainHeight();
        const multplier = ((height - Number(process.env.FARMING_CALCULATION_VALUE)) * 100) / (60 * 24 * 30 * 3);
        const uniqueGenes = name.slice(-1) == 'U' ? 8 : new Set(name.split('-')[1]).size;
        const estimatedBasePower = basePower || (((Math.pow(1.5, uniqueGenes) * 100 * multplier) / 100) * 99) / 100;
        return {
            estimatedBasePower,
            stakedBefore: false,
            global: global || 0,
            production: 0,
            toClaim: 0,
            globalInterest: globalInterest || 0,
            assetInterest: 0,
            claimed: 0,
        };
    };

    //TODO: enrich this with claimable, stakerewards and other params
    fetchFarmingPower = async (
        animalId: animalId,
        name: string,
        basePower: number | undefined,
        farmingPower: number | undefined,
        owner: string | undefined,
        rarity: number | undefined,
        global: number | undefined,
        globalInterest: number | undefined,
        chainHeight: number | undefined,
    ): Promise<{
        production: number;
        stakedBefore: boolean;
        farmingPower?: number | undefined;
        estimatedBasePower?: number;
        global: number;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    }> => {
        if (farmingPower && owner && rarity) {
            const assetInfo = await this.fetchDataByKeys<LastCheckInterest | Claimed>([
                `address_${owner}_asset_${animalId}_lastCheckInterest`,
                `${owner}_asset_${animalId}_claimed`,
            ]);
            const assetInterest = assetInfo.find(
                (entry) => entry.key === `address_${owner}_asset_${animalId}_lastCheckInterest`,
            )?.value;

            const claimed = assetInfo.find((entry) => entry.key === `${owner}_asset_${animalId}_claimed`)?.value;

            const toClaim = this.calculateToClaim({
                currentInterest: globalInterest ?? int(0),
                assetLastCheckInterest: assetInterest,
                farmingPower,
            });
            return {
                stakedBefore: true,
                global: global || 0,
                production: 0,
                toClaim: toClaim,
                globalInterest: globalInterest || 0,
                assetInterest: assetInterest || 0,
                farmingPower,
                claimed: claimed || 0,
            };
        }

        const height = chainHeight ? chainHeight : await this.helperService.getBlockchainHeight();
        const multplier = ((height - Number(process.env.FARMING_CALCULATION_VALUE)) * 100) / (60 * 24 * 30 * 3);
        const uniqueGenes = name.slice(-1) == 'U' ? 8 : new Set(name.split('-')[1]).size;
        const estimatedBasePower = basePower || (((Math.pow(1.5, uniqueGenes) * 100 * multplier) / 100) * 99) / 100;
        return {
            estimatedBasePower,
            stakedBefore: false,
            global: global || 0,
            production: 0,
            toClaim: 0,
            globalInterest: globalInterest || 0,
            assetInterest: 0,
            claimed: 0,
        };
    };

    fetchFarmingDetails = async (duckId: duckId, owner: addressId): Promise<IFarmingDetailsV2> => {
        const [farmingEntries, totalValues] = await Promise.all([
            this.fetchFarmingEntriesOfDucks(duckId, owner),
            this.fetchFarmingGlobals(),
        ]);

        const farmingEntriesByKeys = farmingEntries.reduce((result: IFarmingEntriesV2 | null, { key, value }) => {
            let nameKey: 'farmingPower' | 'lastCheckInterest' | undefined | string = getKeyPart(key, 4);

            if (nameKey === undefined) {
                nameKey = getKeyPart(key, 3) as 'farmingPower' | 'lastCheckInterest' | undefined | string;
            }

            if (result === null) {
                result = {} as IFarmingEntriesV2;
            }
            return this.addEntry(result, nameKey, value) || result;
        }, {} as IFarmingEntriesV2);
        const { farmingParams, toClaim } = this.calculateFarmingDetails(
            farmingEntriesByKeys as unknown as IFarmingEntriesV2,
            totalValues,
        );

        return {
            owner,
            farmingParams,
            toClaim,
        };
    };

    fetchDucksParamsOnAddress = async (address: addressId): Promise<Record<assetId, IFarmingEntriesV2>> => {
        const entries = await this.fetchDuckByAddress(address);
        const intermediateResult = entries.reduce(
            (result: Record<assetId, IFarmingEntriesV2>, { key, value }) => {
                const [, , , assetId, paramName] = split(key, '_');

                if (!(assetId in result)) {
                    result[assetId] = {} as IFarmingEntriesV2;
                }

                this.addEntry(result[assetId], paramName, value);

                return result;
            },
            {} as Record<assetId, IFarmingEntriesV2>,
        );

        const result = Object.entries(intermediateResult)
            .filter(([, { farmingPower }]) => farmingPower > 0)
            .reduce((res, [duckId, entry]) => ({ ...res, [duckId]: entry }), {});
        return result;
    };

    calculateFarmingDetails = (
        currentBlockchainStateByKeys: IFarmingEntriesV2,
        farmingGlobalsV2: IFarmingGlobalsV2,
    ): { farmingParams: IFarmingParamsV2; toClaim: number } => {
        const farmingParams: IFarmingParamsV2 = {
            lastCheckFarmedAmount: currentBlockchainStateByKeys.claimed,
            assetLastCheckInterest: currentBlockchainStateByKeys.lastCheckInterest,
            farmingPower: currentBlockchainStateByKeys.farmingPower,
            globalFarmingPower: parseInt(`${farmingGlobalsV2.globalStaked}`),
            globalLastCheck: parseInt(`${farmingGlobalsV2.globalLastCheck}`),
        };
        farmingParams.lastCheckFarmedAmount =
            farmingParams.lastCheckFarmedAmount === undefined || Number.isNaN(farmingParams.lastCheckFarmedAmount)
                ? int(0)
                : farmingParams.lastCheckFarmedAmount;
        return {
            farmingParams,
            toClaim: this.calculateToClaim({
                currentInterest: int(farmingParams.globalLastCheck),
                assetLastCheckInterest: farmingParams.assetLastCheckInterest,
                farmingPower: int(farmingParams.farmingPower),
            }),
        };
    };

    calculateToClaim = ({
        currentInterest,
        assetLastCheckInterest,
        farmingPower,
    }: {
        currentInterest: number;
        assetLastCheckInterest?: number;
        farmingPower?: number;
    }) => {
        const result = ((currentInterest - (assetLastCheckInterest ?? 0)) * (farmingPower ?? 0)) / 1e8;
        return result;
    };

    getEmptyPerches = async (address: addressId): Promise<{ B?: number; G?: number; Y?: number; R?: number }> => {
        const emptyPerches = await this.fetchDataMatch(`address_${address}_perchesAvailable_.*?`);
        const result = {};
        const possibleColors = ['B', 'G', 'Y', 'R'];
        emptyPerches.forEach((kv) => {
            const keyParts = kv.key.split('_');
            const color = keyParts[keyParts.length - 1].toUpperCase();
            if (possibleColors.indexOf(color) !== -1) {
                result[color] = kv.value;
            }
        });
        return result;
    };

    fetchFarmStats = async (): Promise<FarmStats[]> => {
        const url = `${this.helperService.API_URL}/v1/collective-farms/stats`;
        const data = await this.helperService.http.get<FarmStats[]>(url);
        const { data: farmStats = [] } = data;
        const updatedFarmStats = farmStats.map((farm) => ({
            ...farm,
            // eslint-disable-next-line no-underscore-dangle
            getId: () => this.getNameAddressByValue(farm._id),
        }));
        return updatedFarmStats;
    };

    private getNameAddressByValue = (value: string): string => {
        const address = ADDRESS[getEnv().toUpperCase()];
        const name = Object.keys(address).find((key) => address[key] === value);
        if (!name) return value;
        let formattedName = name.toLowerCase().split('_').join(' ');
        formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
        return formattedName;
    };
}

export default CommonFarmingService;
