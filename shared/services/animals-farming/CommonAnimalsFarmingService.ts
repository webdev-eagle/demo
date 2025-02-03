import { ContractIntegerData } from '$shared/types';
import { IAnimalDetailsV2 } from '$shared/types/animals';
import { Canine, EnrichedCanine, EnrichedFeline, Feline } from '$shared/types/cache-api';
import { IFarmingEntriesV2, IFarmingGlobalsV2, IFarmingParamsV2 } from '$shared/types/farms';
import { calculateFpWithBasePower } from '$shared/utils/calculateFarmPower';
import { getKeyPart } from '../../domain/contract-data';
import Cache from '../../structures/Cache';
import { capitalize, int } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import {
    Claimed,
    FarmingEntries,
    FarmingGlobals,
    FarmingGlobalsV2,
    FarmingPower,
    LastCheckInterest,
    OriginalCaller,
} from './data-types';

abstract class CommonAnimalsFarmingService extends AbstractDataFetcher {
    protected abstract DAPP_ADDRESS: addressId;
    abstract FARMING_ITEM_NAME: string;
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

    addFarmingProductionAlternate = async <T extends { rarity: number; assetId: string; name: string }>(
        animals: Feline[] | Canine[],
    ): Promise<Array<EnrichedFeline | EnrichedCanine>> => {
        const globalData = await this.fetchGlobalData();
        const keys: string[] = [];

        animals.forEach((animal) => {
            if (animal.farmingPower && animal.owner && animal.rarity) {
                keys.push(`address_${animal.owner}_asset_${animal.assetId}_lastCheckInterest`);
                keys.push(`${animal.owner}_asset_${animal.assetId}_claimed`);

                keys.push(animal.assetId);
            }
        });
        const allKeys = await this.helperService.fetchContractDataByKeys<ContractIntegerData>(this.DAPP_ADDRESS, keys, {
            useCache: true,
        });

        const animalWithEggProduction = animals.map(async (animal) => {
            const assetInterestKey = allKeys.find(
                (item) => item.key === `address_${animal.owner}_asset_${animal.assetId}_lastCheckInterest`,
            )?.value;
            const claimedKey = allKeys.find(
                (items) => items.key === `${animal.owner}_asset_${animal.assetId}_claimed`,
            )?.value;

            const { estimatedBasePower, global, toClaim, globalInterest, claimed } = await this.calcFarmingPower(
                animal.name,
                animal.basePower,
                animal.farmingPower,
                animal.owner,
                animal.rarity,
                globalData.globalStaked,
                globalData.globalLastCheck,
                assetInterestKey,
                claimedKey,
            );

            if (!animal.basePower) {
                const estimatedFarmingPower = calculateFpWithBasePower(estimatedBasePower as number, animal.rarity);
                return {
                    ...animal,
                    farmingParams: {
                        estimatedFarmingPower,
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!animal.basePower,
                        toClaim,
                        claimed,
                    },
                };
            } else {
                const farmingPower = calculateFpWithBasePower(animal.basePower, animal.rarity);
                return {
                    ...animal,
                    farmingPower,
                    farmingParams: {
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!animal.basePower,
                        toClaim,
                        claimed,
                    },
                };
            }
        });
        return Promise.all(animalWithEggProduction);
    };

    addFarmingProduction = async <T extends { rarity: number; assetId: string; name: string }>(
        animal: Feline[] | Canine[],
    ): Promise<Array<EnrichedFeline | EnrichedCanine>> => {
        const globalData = await this.fetchGlobalData();
        const animalWithEggProduction = animal.map(async (animal) => {
            const owner = animal.locks?.some((lock) => lock.dApp === this.DAPP_ADDRESS) ? animal.owner : undefined;
            const { estimatedBasePower, global, toClaim, globalInterest, claimed } = await this.fetchFarmingPower(
                animal.assetId,
                animal.name,
                animal.basePower,
                animal.farmingPower,
                owner,
                animal.rarity,
                globalData.globalStaked,
                globalData.globalLastCheck,
            );

            if (!animal.basePower) {
                const estimatedFarmingPower = calculateFpWithBasePower(estimatedBasePower as number, animal.rarity);
                return {
                    ...animal,
                    farmingParams: {
                        estimatedFarmingPower,
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!animal.basePower,
                        toClaim,
                        claimed,
                    },
                };
            } else {
                const farmingPower = calculateFpWithBasePower(animal.basePower, animal.rarity);
                return {
                    ...animal,
                    farmingPower,
                    farmingParams: {
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!animal.basePower,
                        toClaim,
                        claimed,
                    },
                };
            }
        });
        return Promise.all(animalWithEggProduction);
    };

    addFarmingProductionOne = async <T extends { rarity: number; assetId: string; name: string }>(
        animal: IAnimalDetailsV2,
    ): Promise<IAnimalDetailsV2> => {
        const globalData = await this.fetchGlobalData();
        const owner = animal.locks.some((lock) => lock.dApp === this.DAPP_ADDRESS) ? animal.owner : undefined;
        const { estimatedBasePower, global, toClaim, globalInterest, claimed } = await this.fetchFarmingPower(
            animal.assetId,
            animal.name,
            animal.basePower,
            animal.farmingPower,
            owner,
            animal.rarity,
            globalData.globalStaked,
            globalData.globalLastCheck,
        );
        if (!animal.farmingPower) {
            const estimatedFarmingPower = calculateFpWithBasePower(estimatedBasePower as number, animal.rarity);
            return {
                ...animal,
                farmingParams: {
                    estimatedFarmingPower,
                    lastCheckFarmedAmount: globalInterest,
                    globalFarmingPower: global,
                    stakedBefore: false,
                    toClaim,
                    claimed,
                },
            };
        } else {
            return {
                ...animal,
                farmingParams: {
                    lastCheckFarmedAmount: globalInterest,
                    globalFarmingPower: global,
                    stakedBefore: !!animal.basePower,
                    toClaim,
                    claimed,
                },
            };
        }
    };
    //TODO: we should refactor this and fully use the cache service to determine the ducks, not go to the database itself anymore.
    //TODO: this is not very performant, especially since we have got all the ducks in the database
    fetchAnimalByAddress: (address: addressId) => Promise<FarmingEntries[]> = async (address: addressId) => {
        const farmingAnimals = await this.fetchDataMatch<OriginalCaller>(`.*_original_caller`);
        const animals = farmingAnimals.filter(({ value }) => value === address).map(({ key }) => key.split('_')[0]);
        let entries: FarmingEntries[] = [];
        for (const animal of animals) {
            const matches = await this.fetchDataMatch<FarmingEntries>(`address_.*_asset_${animal}.*?`);
            entries = [...entries, ...matches];
        }
        return entries;
    };

    fetchFarmingEntriesOfAnimal = async (animalId: animalId, address: addressId) => {
        const farmingPower = await this.fetchDataMatch<FarmingPower>(
            `address_${address}_asset_${animalId}_farmingPower`,
        );
        const claimed = await this.fetchDataMatch<Claimed>(`${address}_asset_${animalId}_claimed`, {});
        const lastCheckInterest = await this.fetchDataMatch<LastCheckInterest>(
            `address_${address}_asset_${animalId}_lastCheckInterest`,
        );
        return [farmingPower[0], claimed[0], lastCheckInterest[0]];
    };

    fetchAnimalFarmingEntriesOnAddress = (address: addressId) =>
        this.fetchDataMatch<FarmingEntries>(`address_${address}_asset_.*?`, { avoidCache: true });

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

    fetchFarmingPower = async (
        animalId: animalId,
        name: string,
        basePower: number | undefined,
        farmingPower: number | undefined,
        owner: string | undefined,
        rarity: number | undefined,
        global: number | undefined,
        globalInterest: number | undefined,
    ): Promise<{
        production: number;
        stakedBefore: boolean;
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
                farmingPower: farmingPower,
            });
            return {
                stakedBefore: true,
                global: global || 0,
                production: 0,
                toClaim: toClaim,
                globalInterest: globalInterest || 0,
                assetInterest: assetInterest || 0,
                claimed: claimed || 0,
            };
        }

        const height = await this.helperService.getBlockchainHeight();
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

    calcFarmingPower = async (
        name: string,
        basePower: number | undefined,
        farmingPower: number | undefined,
        owner: string | undefined,
        rarity: number | undefined,
        global: number | undefined,
        globalInterest: number | undefined,
        assetInterest: number | undefined,
        claimed: number | undefined,
    ): Promise<{
        production: number;
        stakedBefore: boolean;
        estimatedBasePower?: number;
        global: number;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    }> => {
        if (farmingPower && owner && rarity) {
            const toClaim = this.calculateToClaim({
                currentInterest: globalInterest ?? int(0),
                assetLastCheckInterest: assetInterest,
                farmingPower: farmingPower,
            });
            return {
                stakedBefore: true,
                global: global || 0,
                production: 0,
                toClaim: toClaim,
                globalInterest: globalInterest || 0,
                assetInterest: assetInterest || 0,
                claimed: claimed || 0,
            };
        }

        const height = await this.helperService.getBlockchainHeight();
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

    fetchAnimalParamsOnAddress = async (address: addressId): Promise<Record<assetId, IFarmingEntriesV2>> => {
        const entries = await this.fetchAnimalFarmingEntriesOnAddress(address);

        const intermediateResult = entries.reduce(
            (result: Record<assetId, any>, { key, value }) => {
                const [_address, _owner, _asset, assetId, paramName] = key.split('_');

                if (!(assetId in result)) {
                    result[assetId] = {} as IFarmingEntriesV2;
                }

                this.addEntry(result[assetId], paramName as any, value);

                return result;
            },
            {} as Record<assetId, any>,
        );

        return Object.entries(intermediateResult)
            .filter(([, { farmingPower }]) => farmingPower > 0)
            .reduce((res, [animalId, entry]) => ({ ...res, [animalId]: entry }), {});
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

    /**
     * Returns the duck farming details
     * @param {Object} currentBlockchainStateByKeys -
     * @param {string} address -
     * @param {string} nftId -
     * @param {Object} farmingGlobals -
     * @param {number} blockchainHeight -
     * @return { farmingParams: IFarmingParams; toClaim: number }
     */
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

    getEmptyFarmingItem = async (address: addressId): Promise<{ [key: string]: number }> => {
        const emptyPerches = await this.fetchDataMatch(`address_${address}_${this.FARMING_ITEM_NAME}Available_.*?`, {
            avoidCache: true,
        });
        const result = {};
        const possibleColors = ['A', 'B', 'C', 'D'];
        emptyPerches.forEach((kv) => {
            const keyParts = kv.key.split('_');
            const color = keyParts[keyParts.length - 1].toUpperCase();
            if (possibleColors.indexOf(color) !== -1) {
                result[color] = kv.value;
            }
        });
        return result;
    };
}

export default CommonAnimalsFarmingService;
