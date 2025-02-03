import { getAddress } from '$shared/domain/constants';
import {
    IFarmParamsMutant,
    IFarmingEntriesMutants,
    IFarmingGlobalsMutant,
    IFarmingGlobalsMutants,
    IFarmingParamsV2,
} from '$shared/types/farms';
import { int } from '$shared/utils';
import Cache from '../../structures/Cache';
import {
    Claimed,
    FarmingPower,
    GlobalLastCheckInterest,
    LastCheckInterest,
    MutantOnFarmingOwner,
    Owner,
    TotalStaked,
} from './data-types';

import { EnrichedMutant, Mutant } from '$shared/types/cache-api';
import { IMutantDetailsV2 } from '$shared/types/mutants';
import {
    calculateFPWithMtntGenes,
    calculateFarmPowerMutants,
    uniqueGenesFromMutants,
} from '$shared/utils/calculateFarmPower';
import AbstractDataFetcher from '../AbstractDataFetcher';
import { FarmingGlobalsV2 } from '../animals-farming/data-types';

const MUTANT_FARMING_DAPP = getAddress('MUTANT_FARMING_DAPP');

abstract class CommonMutantsFarmingService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = MUTANT_FARMING_DAPP;
    private farmingGlobalsCache = new Cache<IFarmingGlobalsMutants>({ ttl: 5_000 });

    fetchMutantByAddress: (address: addressId) => Promise<IFarmParamsMutant[]> = async (address: addressId) => {
        const mutantsUserOnFarming = await this.fetchDataMatch<MutantOnFarmingOwner>(
            `address_${address}_asset_.*?_perchColor`,
        );
        const mutants = await Promise.all(
            mutantsUserOnFarming.map(async (mutant) => {
                const mutantData = mutant.key.split('_');
                const mutantId = mutantData[3];
                const mutantOwner = mutantData[1];
                const mutantInfo = await this.fetchFarmingDetails(mutantId, mutantOwner);
                return {
                    ...mutantInfo,
                    assetId: mutantId,
                } as unknown as IFarmParamsMutant;
            }),
        );

        return mutants;
    };

    isRevenueType = (object, revenueType) => {
        const revenueKey = object.key.split('_');
        const total = revenueKey.length;

        return revenueKey[total - 1] === revenueType;
    };

    getRevenueType = (listRevenue, type) => {
        const result = listRevenue.find((item) => this.isRevenueType(item, type));
        return result.value;
    };

    getGlobalType = (listRevenue, type) => {
        const result = listRevenue.filter((item) => this.isRevenueType(item, type));

        const combinedResult = result.reduce(
            (acc, item) => {
                const key = item.key.split('_')[0];
                if (key === 'total') {
                    acc.total_staked = item.value;
                } else if (key === 'global') {
                    acc.global_lastCheck_interest = item.value;
                }
                return acc;
            },
            { total_staked: 0, global_lastCheck_interest: 0 },
        );

        return combinedResult;
    };

    addFarmingProductionOne = async <T extends { oldRarity: number; assetId: string; name: string }>(
        animal: IMutantDetailsV2,
    ): Promise<IMutantDetailsV2> => {
        const { estimatedBasePower, EGG, VEGG, SPICE, FEED } = await this.fetchFarmingPower(
            animal.assetId,
            animal.owner,
            animal.name,
            animal.basePower,
            animal.farmingPower,
        );
        if (!animal.farmingPower) {
            const estimatedFarmingPower = Math.floor(
                Math.floor(((animal.basePower ?? (estimatedBasePower as number)) / 100) * Math.floor(animal.oldRarity)),
            );
            return {
                ...animal,
                farmingParams: {
                    estimatedFarmingPower,
                    stakedBefore: false,
                    EGG,
                    VEGG,
                    SPICE,
                    FEED,
                },
            };
        } else {
            return {
                ...animal,
                farmingParams: {
                    stakedBefore: !!animal.basePower,
                    EGG,
                    VEGG,
                    SPICE,
                    FEED,
                },
            };
        }
    };

    addFarmingProduction = async <T extends { oldRarity: number; assetId: string; name: string }>(
        mutants: Mutant[],
    ): Promise<EnrichedMutant[]> => {
        const MutantWithProduction = mutants.map(async (mutant) => {
            const { farmingPower, estimatedBasePower, EGG, VEGG, SPICE, FEED } = await this.fetchFarmingPower(
                mutant.assetId,
                mutant.owner,
                mutant.name,
                mutant.basePower,
                mutant.farmingPower,
            );

            if (!mutant.farmingPower) {
                const estimatedFarmingPower = Math.floor(
                    Math.floor(((estimatedBasePower as number) / 100) * Math.floor(mutant.oldRarity)),
                );
                return {
                    ...mutant,
                    farmingParams: {
                        estimatedFarmingPower,
                        stakedBefore: false,
                        EGG,
                        VEGG,
                        SPICE,
                        FEED,
                    },
                };
            } else {
                return {
                    ...mutant,
                    farmingParams: {
                        stakedBefore: !!mutant.basePower,
                        EGG,
                        VEGG,
                        SPICE,
                        FEED,
                    },
                };
            }
        });
        return Promise.all(MutantWithProduction);
    };

    fetchFarmingEntriesOfMutants = async (mutantId: string, address: addressId) => {
        const farmingPower = await this.fetchDataMatch<FarmingPower>(
            `address_${address}_asset_${mutantId}_farmingPower`,
        );
        const claimed = await this.fetchDataMatch<Claimed>(`${address}_asset_${mutantId}_claimed_.*`);
        const lastCheckInterest = await this.fetchDataMatch<LastCheckInterest>(
            `address_${address}_asset_${mutantId}_lastCheckInterest_.*`,
        );

        const farmingEntriesMutant = {
            farmingPower: farmingPower[0].value,
            SPICE: {
                lastCheckInterest: this.getRevenueType(lastCheckInterest, 'SPICE'),
                claimed: this.getRevenueType(claimed, 'SPICE'),
            },
            VEGG: {
                lastCheckInterest: this.getRevenueType(lastCheckInterest, 'VEGG'),
                claimed: this.getRevenueType(claimed, 'VEGG'),
            },
            EGG: {
                lastCheckInterest: this.getRevenueType(lastCheckInterest, 'EGG'),
                claimed: this.getRevenueType(claimed, 'EGG'),
            },
            FEED: {
                lastCheckInterest: this.getRevenueType(lastCheckInterest, 'FEED'),
                claimed: this.getRevenueType(claimed, 'FEED'),
            },
        };
        return farmingEntriesMutant;
    };

    fetchFarmingPower = async (
        animalId: string,
        owner: string,
        name: string,
        basePower: number | undefined,
        farmingPower: number | undefined,
    ): Promise<{ [key: string]: any } | { estimatedBasePower: number; [key: string]: any }> => {
        const assetsFarmed = ['EGG', 'VEGG', 'SPICE', 'FEED'];
        const farmingKeys = ['total_staked', 'global_lastCheck_interest'];

        const farmingDataKeys = farmingKeys.reduce((acc, key) => {
            const newKeys = assetsFarmed.map((asset) => `${key}_${asset}`);
            return acc.concat(newKeys);
        }, [] as string[]);

        const farmingPowerData: FarmingGlobalsV2[] = await this.fetchDataByKeys<FarmingGlobalsV2>(farmingDataKeys);

        let estimatedBasePower: number | undefined;

        const result: { [key: string]: any } = {};

        for (const category of assetsFarmed) {
            const global = farmingPowerData.find((entry) => entry.key === `total_staked_${category}`)?.value;
            const globalInterest = farmingPowerData.find(
                (entry) => entry.key === `global_lastCheck_interest_${category}`,
            )?.value;

            if (farmingPower && owner) {
                const assetInfo = await this.fetchDataByKeys<LastCheckInterest | FarmingPower | Claimed>([
                    `address_${owner}_asset_${animalId}_lastCheckInterest_${category}`,
                    `${owner}_asset_${animalId}_claimed_${category}`,
                ]);

                const assetInterest = assetInfo.find(
                    (entry) => entry.key === `address_${owner}_asset_${animalId}_lastCheckInterest_${category}`,
                )?.value;

                const claimed = assetInfo.find(
                    (entry) => entry.key === `${owner}_asset_${animalId}_claimed_${category}`,
                )?.value;

                const toClaim = this.calculateToClaim({
                    currentInterest: globalInterest ?? 0,
                    assetLastCheckInterest: assetInterest,
                    farmingPower: farmingPower,
                });

                result[category] = {
                    global: global || 0,
                    toClaim: toClaim || 0,
                    globalInterest: globalInterest || 0,
                    assetInterest: assetInterest || 0,
                    claimed: claimed || 0,
                };
            } else {
                const height = await this.helperService.getBlockchainHeight();
                estimatedBasePower = basePower || calculateFPWithMtntGenes(height, name);

                result[category] = {
                    global: global || 0,
                    toClaim: 0,
                    globalInterest: globalInterest || 0,
                    assetInterest: 0,
                    exactFp: 0,
                    claimed: 0,
                };
            }
        }

        if (farmingPower) {
            return {
                stakedBefore: true,
                ...result,
            };
        } else {
            return {
                estimatedBasePower: estimatedBasePower!,
                stakedBefore: false,
                ...result,
            };
        }
    };

    fetchFarmingGlobals = async () => {
        if (this.farmingGlobalsCache.data) {
            return this.farmingGlobalsCache.data;
        }

        const [globalLastCheck, totalStaked] = await Promise.all([
            this.fetchDataMatch<GlobalLastCheckInterest>('global_lastCheck_interest_.*'),
            this.fetchDataMatch<TotalStaked>('total_staked_.*'),
        ]);

        const allGlobalData = [...globalLastCheck, ...totalStaked];

        const farmingGlobalMutant = {
            SPICE: this.getGlobalType(allGlobalData, 'SPICE'),
            VEGG: this.getGlobalType(allGlobalData, 'VEGG'),
            EGG: this.getGlobalType(allGlobalData, 'EGG'),
            FEED: this.getGlobalType(allGlobalData, 'FEED'),
        };
        this.farmingGlobalsCache.data = farmingGlobalMutant;
        return this.farmingGlobalsCache.data;
    };

    fetchFarmingDetails = async (mutantId: string, owner: addressId): Promise<IFarmParamsMutant[]> => {
        const [farmingEntries, totalValues] = await Promise.all([
            this.fetchFarmingEntriesOfMutants(mutantId, owner),
            this.fetchFarmingGlobals(),
        ]);
        const farmingPower = farmingEntries['farmingPower'];
        const combinedData = {
            SPICE: {
                globalType: totalValues['SPICE'],
                farmingData: farmingEntries['SPICE'],
            },
            VEGG: {
                globalType: totalValues['VEGG'],
                farmingData: farmingEntries['VEGG'],
            },
            EGG: {
                globalType: totalValues['EGG'],
                farmingData: farmingEntries['EGG'],
            },
            FEED: {
                globalType: totalValues['FEED'],
                farmingData: farmingEntries['FEED'],
            },
        };

        const result = Object.keys(combinedData).map((key) => {
            const { farmingParams, toClaim } = this.calculateFarmingDetails(
                farmingPower,
                combinedData[key].farmingData,
                combinedData[key].globalType,
            );
            return {
                assetId: mutantId,
                typeReward: key,
                claimedData: combinedData[key].farmingData,
                farmingParams,
                toClaim,
                owner: owner,
            };
        });

        return result;
    };

    calculateFarmingDetails = (
        farmingPower,
        currentBlockchainStateByKeys: IFarmingEntriesMutants,
        farmingGlobalsV2: IFarmingGlobalsMutant,
    ): { farmingParams: IFarmingParamsV2; toClaim: number } => {
        const farmingParams: IFarmingParamsV2 = {
            lastCheckFarmedAmount: currentBlockchainStateByKeys.claimed,
            assetLastCheckInterest: currentBlockchainStateByKeys.lastCheckInterest,
            farmingPower: farmingPower,
            globalFarmingPower: parseInt(`${farmingGlobalsV2.total_staked}`),
            globalLastCheck: parseInt(`${farmingGlobalsV2.global_lastCheck_interest}`),
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

    getEmptyMutariums = async (
        address: addressId,
    ): Promise<{ A?: number; B?: number; C?: number; D?: number; G?: number }> => {
        const emptyMutariums = await this.fetchDataMatch(`address_${address}_mutariumAvailable_.*?`);
        const result = {};
        const possibleColors = ['A', 'B', 'C', 'D', 'G'];
        emptyMutariums.forEach((kv) => {
            const keyParts = kv.key.split('_');
            const color = keyParts[keyParts.length - 1].toUpperCase();
            if (possibleColors.indexOf(color) !== -1) {
                result[color] = kv.value;
            }
        });
        return result;
    };

    addMutantsFarmPower = async (name) => {
        const height = await this.helperService.getBlockchainHeight();
        const turtleAndDuckGenes = this.helperService.getGenotypeMutant(name);
        const countOfUniqueGenes = uniqueGenesFromMutants(turtleAndDuckGenes[0], turtleAndDuckGenes[1]);
        return calculateFarmPowerMutants(height, countOfUniqueGenes);
    };
}

export default CommonMutantsFarmingService;
