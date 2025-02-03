import type { ContractIntegerData, WithRarityParams } from '../../types';
import type CommonBreedingService from '../breeding';
import type CommonHelperService from '../helper/CommonHelperService';
import type CommonIncubatorService from '../incubator';
import type CommonTurtlesBreedingService from '../turtles-breeding';
import type CommonTurtlesFarmingService from '../turtles-farming';
import type CommonTurtlesIncubatorService from '../turtles-incubator';

import { getKeyPart } from '../../domain/contract-data';
import { isJackpot } from '../../domain/ducks';
import { withCache } from '../../utils';
import CommonFarmingService from '../farming/CommonFarmingService';

import CommonVeggFarmingService from '$shared/services/vegg-farming';
import { Duck, EnrichedDuck, veggEnrichedDuck } from '$shared/types/cache-api';
import CommonMutantsBreedingService from '../mutants-breeding/CommonMutantsBreedingService';

import { ANIMAL_PREFIXES } from '$shared/enums';
import CommonCaninesIncubatorService from '$shared/services/canines-incubator/CommonCainnesIncubatorService';
import CommonFelinesIncubatorService from '$shared/services/felines-incubator/CommonFelinesIncubatorService';
import { IDuckDetailsV2 } from '$shared/types/ducks';
import CommonAnimalsBreedingService from '../animals-breeding/CommonAnimalsBreedingService';

import { isFakeAnimal } from '$shared/domain/animals';
import { getAddress } from '$shared/domain/constants';
import { calculateFpWithBasePower } from '$shared/utils/calculateFarmPower';
import CommonAnimalsIncubatorService from '../animals-incubator/CommonAnimalsIncubatorService';

type GenotypeAmounts = {
    byGenotypeAndGeneration: Record<string, number>;
};

const calculateRarity = <T extends { issuer: addressId; name: string }>(amountOfAnimal: number, nft: T) => {
    if (isFakeAnimal(nft)) {
        return -1; // IT'S FAKE NFT!!!
    } else if (isJackpot(nft)) {
        return 100;
    }
    const amount = amountOfAnimal > 0 ? amountOfAnimal : amountOfAnimal + 1;
    const rarity = (1 / Math.sqrt(amount)) * 100;
    return Number.isNaN(rarity) ? 100 : rarity;
};

const DUCK_FARMING_DAPP = getAddress('DUCK_FARMING_DAPP');
const VEGG_FARMING_DAPP = getAddress('VEGG_FARMING_DAPP');

abstract class CommonProductionService {
    protected abstract helperService: CommonHelperService;
    protected abstract farmingService: CommonFarmingService;
    protected abstract veggFarmingService: CommonVeggFarmingService;
    protected abstract farmingTurtlesService: CommonTurtlesFarmingService;
    protected abstract breedingService: CommonBreedingService;
    protected abstract breedingTurtlesService: CommonTurtlesBreedingService;
    protected abstract incubatorService: CommonIncubatorService;
    protected abstract incubatorTurtlesService: CommonTurtlesIncubatorService;
    protected abstract breedingMutantsService: CommonMutantsBreedingService;
    protected abstract breedingCaninesService: CommonAnimalsBreedingService;
    protected abstract breedingFelineService: CommonAnimalsBreedingService;
    protected abstract incubatorFelinesService: CommonFelinesIncubatorService;
    protected abstract incubatorCaninesService: CommonCaninesIncubatorService;

    getGenotypeAmounts = withCache(async (): Promise<GenotypeAmounts> => {
        const [breedingGenotypeAmount, incubatorGenotypeAmount] = await Promise.all([
            this.breedingService.getGenotypeAmounts(),
            this.incubatorService.fetchGenotypeAmounts(),
        ]);

        const byGenotypeAndGeneration: Record<string, number> = {};

        [...breedingGenotypeAmount, ...incubatorGenotypeAmount].forEach(({ key, value }) => {
            const fullGenome = getKeyPart(key, 1);
            const genotypeAndGeneration = this.helperService.getGenotypePattern(fullGenome);

            if (!byGenotypeAndGeneration[genotypeAndGeneration]) {
                byGenotypeAndGeneration[genotypeAndGeneration] = 0;
            }

            byGenotypeAndGeneration[genotypeAndGeneration] += value;
        });

        return {
            byGenotypeAndGeneration,
        };
    }, 30_000);

    getTurtlesGenotypeAmounts = withCache(async (): Promise<GenotypeAmounts> => {
        const [breedingGenotypeAmount, incubatorGenotypeAmount] = await Promise.all([
            this.breedingTurtlesService.getGenotypeAmounts(),
            this.incubatorTurtlesService.fetchGenotypeAmounts(),
        ]);

        const byGenotypeAndGeneration: Record<string, number> = {};

        [...breedingGenotypeAmount, ...incubatorGenotypeAmount].forEach(({ key, value }) => {
            const fullGenome = getKeyPart(key, 1);
            const genotypeAndGeneration = this.helperService.getGenotypePattern(fullGenome);

            if (!byGenotypeAndGeneration[genotypeAndGeneration]) {
                byGenotypeAndGeneration[genotypeAndGeneration] = 0;
            }

            byGenotypeAndGeneration[genotypeAndGeneration] += value;
        });

        return {
            byGenotypeAndGeneration,
        };
    }, 30_000);

    getMutantsGenotypeAmounts = withCache(async (): Promise<GenotypeAmounts> => {
        const [breedingGenotypeAmount] = await Promise.all([this.breedingMutantsService.getGenotypeAmounts()]);

        const byGenotypeAndGeneration: Record<string, number> = {};

        [...breedingGenotypeAmount].forEach(({ key, value }) => {
            const fullGenome = getKeyPart(key, 1);
            const genotypeAndMutarium = this.helperService.getGenotypeMutant(fullGenome);
            const genotypeAndGeneration = this.helperService.getGenotypePattern(fullGenome);

            if (!byGenotypeAndGeneration[genotypeAndGeneration]) {
                byGenotypeAndGeneration[genotypeAndGeneration] = 0;
            }

            byGenotypeAndGeneration[genotypeAndGeneration] += value;
        });

        return {
            byGenotypeAndGeneration,
        };
    }, 30_000);

    getGenotypeAnimal = withCache(async (animalType: ANIMAL_PREFIXES): Promise<GenotypeAmounts> => {
        if (animalType === ANIMAL_PREFIXES.TURTLE) {
            return this.getGenotypeAnimalAmounts(this.breedingTurtlesService, this.incubatorTurtlesService);
        }
        if (animalType === ANIMAL_PREFIXES.CANI) {
            return this.getGenotypeAnimalAmounts(this.breedingCaninesService, this.incubatorCaninesService);
        }
        if (animalType === ANIMAL_PREFIXES.FELI) {
            return this.getGenotypeAnimalAmounts(this.breedingFelineService, this.incubatorFelinesService);
        }

        return this.getGenotypeAnimalAmounts(this.breedingService, this.incubatorService);
    }, 30_000);

    getGenotypeAnimalAmounts = withCache(
        async (
            breedingService: CommonBreedingService | CommonTurtlesBreedingService | CommonAnimalsBreedingService,
            incubatorService: CommonIncubatorService | CommonTurtlesIncubatorService | CommonAnimalsIncubatorService,
        ): Promise<GenotypeAmounts> => {
            const [breedingGenotypeAmount, incubatorGenotypeAmount] = await Promise.all([
                breedingService.getGenotypeAmounts(),
                incubatorService.fetchGenotypeAmounts(),
            ]);

            const byGenotypeAndGeneration: Record<string, number> = {};

            [...breedingGenotypeAmount, ...incubatorGenotypeAmount].forEach(({ key, value }) => {
                const fullGenome = getKeyPart(key, 1);
                const genotypeAndGeneration = this.helperService.getGenotypePattern(fullGenome);

                if (!byGenotypeAndGeneration[genotypeAndGeneration]) {
                    byGenotypeAndGeneration[genotypeAndGeneration] = 0;
                }

                byGenotypeAndGeneration[genotypeAndGeneration] += value;
            });

            return {
                byGenotypeAndGeneration,
            };
        },
        30_000,
    );

    calcEggProduction = (farmingPower: number, globalFarmingPower: number): string => {
        return (((40 * 30.4) / globalFarmingPower) * farmingPower).toFixed(4);
    };

    getEggProduction = async (farmingPower: number) => {
        const { globalStaked } = await this.farmingService.fetchFarmingGlobals();

        return this.calcEggProduction(farmingPower, globalStaked);
    };

    addVEggProductionAlternate = async (ducks: Array<EnrichedDuck>): Promise<Array<veggEnrichedDuck>> => {
        const globalData = await this.veggFarmingService.fetchGlobalData();
        const keys: string[] = [];
        ducks.forEach((duck) => {
            if (duck.veggFarmingPower && duck.owner) {
                keys.push(`address_${duck.owner}_asset_${duck.assetId}_lastCheckInterest`);
                keys.push(`${duck.owner}_asset_${duck.assetId}_claimed`);

                keys.push(duck.assetId);
            }
        });
        const allKeys = await this.helperService.fetchContractDataByKeys<ContractIntegerData>(VEGG_FARMING_DAPP, keys, {
            useCache: true,
        });

        const ducksWithEggProduction = ducks.map(async (duck) => {
            if (duck.veggFarmingPower && duck.owner) {
                const assetInterestKey = allKeys.find(
                    (item) => item.key === `address_${duck.owner}_asset_${duck.assetId}_lastCheckInterest`,
                )?.value;
                const claimedKey = allKeys.find(
                    (items) => items.key === `${duck.owner}_asset_${duck.assetId}_claimed`,
                )?.value;

                const { global, toClaim, globalInterest, assetInterest, claimed } =
                    await this.veggFarmingService.calcFarmingPower(
                        duck.veggFarmingPower || 0,
                        globalData.globalStaked,
                        globalData.globalLastCheck,
                        assetInterestKey,
                        claimedKey,
                    );
                return {
                    ...duck,
                    veggFarmingParams: {
                        globalFarmingPower: global,
                        stakedBefore: true,
                        toClaim,
                        globalInterest,
                        assetInterest,
                        claimed,
                    },
                };
            }
            return duck;
        });
        return Promise.all(ducksWithEggProduction);
    };

    addVEggProduction = async (ducks: Array<EnrichedDuck>): Promise<Array<veggEnrichedDuck>> => {
        const globalData = await this.veggFarmingService.fetchGlobalData();
        const ducksWithEggProduction = ducks.map(async (duck) => {
            if (duck.veggFarmingPower && duck.owner) {
                const { global, toClaim, globalInterest, assetInterest, claimed } =
                    await this.veggFarmingService.fetchFarmingPower(
                        duck.assetId,
                        duck.veggFarmingPower || 0,
                        duck.owner,
                        globalData.globalStaked,
                        globalData.globalLastCheck,
                    );
                return {
                    ...duck,
                    veggFarmingParams: {
                        globalFarmingPower: global,
                        stakedBefore: true,
                        toClaim,
                        globalInterest,
                        assetInterest,
                        claimed,
                    },
                };
            }
            return duck;
        });
        return Promise.all(ducksWithEggProduction);
    };

    addVEggProductionOne = async <T extends { oldRarity: number; assetId: string; name: string }>(
        duck: IDuckDetailsV2,
    ): Promise<IDuckDetailsV2> => {
        const globalData = await this.veggFarmingService.fetchGlobalData();
        const { global, toClaim, globalInterest, assetInterest, claimed } =
            await this.veggFarmingService.fetchFarmingPower(
                duck.assetId,
                duck.veggFarmingPower || 0,
                duck.owner,
                globalData.globalStaked,
                globalData.globalLastCheck,
            );
        return {
            ...duck,
            veggFarmingParams: {
                globalFarmingPower: global,
                stakedBefore: true,
                toClaim,
                globalInterest,
                assetInterest,
                claimed,
            },
        };
    };

    addEggProductionAlternate = async <T extends { oldRarity: number; assetId: string; name: string }>(
        ducks: Duck[],
    ): Promise<Array<EnrichedDuck>> => {
        const globalData = await this.farmingService.fetchGlobalData();
        const height = await this.helperService.getBlockchainHeight();
        const keys: string[] = [];

        ducks.forEach((duck) => {
            const owner = this.farmingService.getDuckOwnerForFarming(duck);

            if (duck.farmingPower && owner && duck.oldRarity) {
                keys.push(`address_${owner}_asset_${duck.assetId}_lastCheckInterest`);
                keys.push(`${owner}_asset_${duck.assetId}_claimed`);

                keys.push(duck.assetId);
            }
        });
        const allKeys = await this.helperService.fetchContractDataByKeys<ContractIntegerData>(DUCK_FARMING_DAPP, keys, {
            useCache: true,
        });
        const ducksWithEggProduction = ducks.map(async (duck) => {
            const owner = this.farmingService.getDuckOwnerForFarming(duck);
            const assetInterestKey = allKeys.find(
                (item) => item.key === `address_${owner}_asset_${duck.assetId}_lastCheckInterest`,
            )?.value;
            const claimedKey = allKeys.find((items) => items.key === `${owner}_asset_${duck.assetId}_claimed`)?.value;

            const { estimatedBasePower, global, toClaim, globalInterest, assetInterest, claimed } =
                await this.farmingService.calcFarmingPower(
                    duck.name,
                    duck.basePower,
                    duck.farmingPower,
                    globalData.globalStaked,
                    globalData.globalLastCheck,
                    height,
                    assetInterestKey,
                    claimedKey,
                );

            if (!duck.farmingPower) {
                const estimatedFarmingPower = calculateFpWithBasePower(estimatedBasePower as number, duck.oldRarity);
                const eggProduction = this.calcEggProduction(estimatedFarmingPower, global);
                return {
                    ...duck,
                    eggProduction,
                    farmingParams: {
                        estimatedFarmingPower,
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!duck.basePower,
                        toClaim,
                        claimed,
                        globalInterest,
                        assetInterest,
                    },
                };
            } else {
                const eggProduction = this.calcEggProduction(duck.farmingPower, global);
                return {
                    ...duck,
                    eggProduction,
                    farmingParams: {
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!duck.basePower,
                        toClaim,
                        claimed,
                        globalInterest,
                        assetInterest,
                    },
                };
            }
        });
        return Promise.all(ducksWithEggProduction);
    };
    //Do we really use egg production here? Maybe we should not query it
    addEggProduction = async <T extends { oldRarity: number; assetId: string; name: string }>(
        ducks: Duck[],
    ): Promise<Array<EnrichedDuck>> => {
        const globalData = await this.farmingService.fetchGlobalData();
        const height = await this.helperService.getBlockchainHeight();
        const ducksWithEggProduction = ducks.map(async (duck) => {
            //TODO THIS NEEDS TO STAY BECAUSE THE STATS NEEDS TO BE QUERIES FROM THE STAKING OWNER, IN THIS CASE THE HOUSE
            const owner = this.farmingService.getDuckOwnerForFarming(duck);

            const { estimatedBasePower, global, toClaim, globalInterest, assetInterest, claimed } =
                await this.farmingService.fetchFarmingPower(
                    duck.assetId,
                    duck.name,
                    duck.basePower,
                    duck.farmingPower,
                    owner,
                    duck.oldRarity,
                    globalData.globalStaked,
                    globalData.globalLastCheck,
                    height,
                );

            if (!duck.farmingPower) {
                const estimatedFarmingPower = calculateFpWithBasePower(estimatedBasePower as number, duck.oldRarity);
                const eggProduction = this.calcEggProduction(estimatedFarmingPower, global);
                return {
                    ...duck,
                    eggProduction,
                    farmingParams: {
                        estimatedFarmingPower,
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!duck.basePower,
                        toClaim,
                        claimed,
                        globalInterest,
                        assetInterest,
                    },
                };
            } else {
                const eggProduction = this.calcEggProduction(duck.farmingPower, global);
                return {
                    ...duck,
                    eggProduction,
                    farmingParams: {
                        lastCheckFarmedAmount: globalInterest,
                        globalFarmingPower: global,
                        stakedBefore: !!duck.basePower,
                        toClaim,
                        claimed,
                        globalInterest,
                        assetInterest,
                    },
                };
            }
        });
        return Promise.all(ducksWithEggProduction);
    };

    addAnimalRarity = async <T extends { issuer: addressId; name: string }>(
        nfts: T[],
    ): Promise<Array<T & WithRarityParams>> => {
        const [{ byGenotypeAndGeneration }, { globalFarmingPower }] = await Promise.all([
            this.getTurtlesGenotypeAmounts(),
            this.farmingTurtlesService.fetchFarmingGlobals(),
        ]);

        const mappedPromises = nfts.map(async (nft) => {
            const genotypeTemplate = this.helperService.getGenotypePattern(nft.name);
            const animalsWithSameGenes = byGenotypeAndGeneration[genotypeTemplate];
            const rarity = await this.helperService.getAnimalFarmPower(nft.name);
            const eggProduction = '0';

            return {
                ...nft,
                animalsWithSameGenes,
                rarity,
                globalFarmingPower,
                eggProduction,
            };
        });

        return await Promise.all(mappedPromises);
    };

    addEggProductionOne = async <T extends { oldRarity: number; assetId: string; name: string }>(
        duck: IDuckDetailsV2,
    ): Promise<IDuckDetailsV2> => {
        const globalData = await this.farmingService.fetchGlobalData();
        const owner = duck.owner ? duck.owner : this.farmingService.getDuckOwnerForFarming(duck);

        const { estimatedBasePower, global, toClaim, globalInterest, claimed } =
            await this.farmingService.fetchFarmingPower(
                duck.assetId,
                duck.name,
                duck.basePower,
                duck.farmingPower,
                owner,
                duck.oldRarity,
                globalData.globalStaked,
                globalData.globalLastCheck,
                undefined,
            );
        if (!duck.farmingPower) {
            const estimatedFarmingPower = calculateFpWithBasePower(estimatedBasePower as number, duck.oldRarity);
            const eggProduction = this.calcEggProduction(estimatedFarmingPower, global);
            return {
                ...duck,
                eggProduction,
                farmingParams: {
                    estimatedFarmingPower,
                    lastCheckFarmedAmount: globalInterest,
                    globalFarmingPower: global,
                    stakedBefore: !!duck.basePower,
                    toClaim,
                    claimed,
                },
            };
        } else {
            const eggProduction = this.calcEggProduction(duck.farmingPower, global);
            return {
                ...duck,
                eggProduction,
                farmingParams: {
                    lastCheckFarmedAmount: globalInterest,
                    globalFarmingPower: global,
                    stakedBefore: Boolean(duck.basePower),
                    toClaim,
                    claimed,
                },
            };
        }
    };

    addRarity = async <T extends { issuer: addressId; name: string; assetId: string }>(
        nfts: T[],
        { newDucks }: { newDucks: boolean } = { newDucks: false },
    ): Promise<Array<T & WithRarityParams>> => {
        const [{ byGenotypeAndGeneration }, { globalStaked, globalLastCheck }] = await Promise.all([
            this.getGenotypeAmounts(),
            this.farmingService.fetchFarmingGlobals(),
        ]);

        const result = nfts.map(async (nft) => {
            if (!nft?.assetId) {
                console.log('NFT', nft);
            }
            const genotypeTemplate = this.helperService.getGenotypePattern(nft.name);
            const ducksWithSameGenes = byGenotypeAndGeneration[genotypeTemplate];
            const owner = await this.farmingService.fetchDuckOwnerForFarming(nft.assetId);
            const rarity = calculateRarity(newDucks ? ducksWithSameGenes + 1 : ducksWithSameGenes, nft);
            const {
                estimatedBasePower,
                global,
                stakedBefore: stakedBefore,
                toClaim,
                globalInterest,
                assetInterest,
                claimed,
            } = await this.farmingService.fetchFarmingPower(
                nft.assetId,
                nft.name,
                undefined,
                undefined,
                owner,
                undefined,
                globalStaked,
                globalLastCheck,
                undefined,
            );
            const editedFp = calculateFpWithBasePower(estimatedBasePower as number, rarity);
            const eggProduction = this.calcEggProduction(editedFp, global);
            return {
                ...nft,
                ducksWithSameGenes,
                rarity,
                farmingParams: {
                    farmingPower: editedFp,
                    globalFarmingPower: global,
                    stakedBefore: stakedBefore,
                    toClaim,
                    globalInterest,
                    assetInterest,
                    claimed,
                },
                eggProduction,
            };
        });
        return await Promise.all(result);
    };

    addRarityClean = async <T extends { issuer: addressId; name: string }>(
        nfts: T[],
        { newDucks }: { newDucks: boolean } = { newDucks: false },
    ): Promise<Array<T & { rarity: number }>> => {
        const [{ byGenotypeAndGeneration }] = await Promise.all([this.getGenotypeAmounts()]);
        const result = nfts.map(async (nft) => {
            const genotypeTemplate = this.helperService.getGenotypePattern(nft.name);
            const ducksWithSameGenes = byGenotypeAndGeneration[genotypeTemplate];
            const rarity = calculateRarity(newDucks ? ducksWithSameGenes + 1 : ducksWithSameGenes, nft);
            return {
                ...nft,
                ducksWithSameGenes,
                rarity,
            };
        });
        return await Promise.all(result);
    };

    addMutantsRarity = async <T extends { issuer: addressId; name: string; assetId: string }>(
        nfts: T[],
        { newMutants }: { newMutants: boolean } = { newMutants: false },
    ): Promise<Array<T & { rarity: number }>> => {
        const [{ byGenotypeAndGeneration }] = await Promise.all([this.getGenotypeAmounts()]);
        const result = nfts.map(async (nft) => {
            const genotypeTemplate = this.helperService.getGenotypePattern(nft.name);
            const ducksWithSameGenes = byGenotypeAndGeneration[genotypeTemplate];
            const rarity = calculateRarity(newMutants ? ducksWithSameGenes + 1 : ducksWithSameGenes, nft);
            return {
                ...nft,
                ducksWithSameGenes,
                rarity,
            };
        });
        return await Promise.all(result);
    };

    addRarityCleanAnimals = async <T extends { issuer: addressId; name: string }>(
        nfts: T[],
        { newDucks }: { newDucks: boolean } = { newDucks: false },
        type: ANIMAL_PREFIXES,
    ): Promise<Array<T & { rarity: number }>> => {
        const [{ byGenotypeAndGeneration }] = await Promise.all([this.getGenotypeAnimal(type)]);
        const result = nfts.map(async (nft) => {
            const genotypeTemplate = this.helperService.getGenotypePattern(nft.name);
            const ducksWithSameGenes = byGenotypeAndGeneration[genotypeTemplate];
            const rarity = calculateRarity(newDucks ? ducksWithSameGenes + 1 : ducksWithSameGenes, nft);
            return {
                ...nft,
                ducksWithSameGenes,
                rarity,
            };
        });
        return await Promise.all(result);
    };
}

export default CommonProductionService;
