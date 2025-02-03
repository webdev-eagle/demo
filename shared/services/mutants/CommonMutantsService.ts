import { Ducks, Turtles } from '$shared/constants';
import { MUTANT_COLORS, MUTANT_GENERATION_NAMES, MutantColorNames } from '$shared/constants/mutants';
import { getAddress } from '$shared/domain/constants';
import { isAddress } from '$shared/domain/guards';
import { Worlds } from '$shared/enums';
import { AssetDetails, WithAchievements, WithRarityParams } from '$shared/types';
import { IMutantDetails, IMutantDetailsLocked, IMutantParamsFromGenotype } from '$shared/types/mutants';
import {
    attempt,
    capitalize,
    getUrlToPNGithTimeStamp,
    getUrlToSVGWithTimeStamp,
    split,
    urlString,
} from '$shared/utils';
import CommonAnimalsService from '../animals/CommonAnimalsService';
import CommonAssetsService from '../assets';
import CommonAuctionService from '../auction';
import CommonHelperService from '../helper';
import CommonMutantsBreedingService from '../mutants-breeding/CommonMutantsBreedingService';
import CommonFarmingService from '../mutants-farming/CommonFarmingService';
import CommonScanService from '../scan/CommonScanService';

const MUTANTS_BREEDER_DAPP_ADDRESS = getAddress('MUTANTS_BREEDER_DAPP');

abstract class CommonMutantsService {
    animalService: CommonAnimalsService | undefined;
    abstract helperService: CommonHelperService;
    abstract assetsService: CommonAssetsService;
    abstract auctionService: CommonAuctionService;
    abstract mutantsBreedingService: CommonMutantsBreedingService;
    abstract mutantsFarmingService: CommonFarmingService;
    abstract IMAGES_SERVICE_URL: string;
    abstract scanService: CommonScanService;
    abstract APP_URL: string;
    abstract API_URL: string;
    abstract DAPPS_CONTRACTS: { farming: string; auction: string; rental: string };

    isMutant = <T extends { description: string }>({ description }: T) => description.indexOf('MTNT-') === 0;

    getMutantName = async (mutantId: string) => {
        const mutant = await this.assetsService.fetchAssetDetails(mutantId);
        return this.getMutantNameFromGene(mutant.description);
    };

    getMutantNameFromGene = (geneString: string) => {
        const gene = geneString.startsWith('MTNT-') ? split(geneString, '-')[1] : geneString;
        let genePairs: string[] = [];
        for (let i = 0; i < gene.length; i += 2) {
            genePairs.push(gene.slice(i, i + 2));
        }
        const name = genePairs
            .map((gene, index) => {
                const classGene = gene.split('')[0] === 'D' ? 'D' : 'T';
                const gen = gene.split('')[1];
                const mutantName = classGene === 'D' ? Ducks[gen]?.[index] : Turtles[gen]?.[index];
                return mutantName;
            })
            .join('')
            .toLowerCase();
        return capitalize(name);
    };

    getImageByGenotype = (
        genotype: string,
        options?: {
            onFarming?: boolean;
            color?: string | null;
            assetId?: assetId;
            world?: Worlds;
            direction?: number;
            grayscale?: boolean;
        },
    ): string => {
        const {
            onFarming = false,
            color = null,
            assetId,
            world = Worlds.None,
            direction = 0,
            grayscale = false,
        } = options ?? {};
        const hasDruckGenes = genotype.includes('I');
        const mutantName = `MTNT-${genotype}`;
        return urlString(`${this.IMAGES_SERVICE_URL}/api/images/${getUrlToSVGWithTimeStamp(mutantName)}`, {
            onFarming,
            color,
            druck: hasDruckGenes ? (this.helperService.assetIdAsFloat(assetId ?? '_') > 0.5 ? '1' : '2') : null,
            world,
            assetId,
            direction,
            grayscale,
        });
    };

    getMutantsOnFarming = async (addressId) => {
        try {
            const farmingEntriesByMutantId = await this.mutantsFarmingService.fetchMutantByAddress(addressId);
            const keys = farmingEntriesByMutantId.map((entry) => entry.assetId);
            if (keys.length === 0) {
                return [];
            }

            const mutantsOnFarmingDetails = await this.assetsService.fetchAssetsDetails(keys);

            const combinedData = farmingEntriesByMutantId
                .filter((farmingEntry) => {
                    return mutantsOnFarmingDetails.some((detail) => detail.assetId === farmingEntry.assetId);
                })
                .map((farmingEntry) => {
                    const assetDetails = mutantsOnFarmingDetails.find(
                        (detail) => detail.assetId === farmingEntry.assetId,
                    );
                    return {
                        farmingData: farmingEntry,
                        ...assetDetails,
                        status: {
                            onFarming: true,
                            onSale: false,
                            onXmasStable: false,
                            stakedOnDuckHouse: false,
                        },
                    };
                });
            return combinedData;
        } catch (error) {
            console.error('Error in getMutantsOnFarming:', error);
            throw error;
        }
    };

    addAchievements = async <T extends { assetDetails: AssetDetails } & MutantWithAssetDetails>(
        nfts: T[],
    ): Promise<Array<T & WithAchievements>> => {
        const achievements = await this.scanService.fetchAchievementsForMutants(nfts);
        return nfts.map((nft) => ({
            ...nft,
            achievements: achievements?.[nft.assetDetails.assetId]?.a
                ? achievements[nft.assetDetails.assetId]
                : {
                      a: [],
                      n: null,
                  },
        }));
    };

    getMutantsBackend = async () => {
        const url = this.API_URL + '/v2/mutants/nft-mutants';

        const mutants = [];
        try {
            const { data: res } = await this.helperService.http.get(url);
            return res.data;
        } catch {
            console.error('Error getting all mutants');
        }
        return mutants;
    };

    addIssueNumber = (mutants, mutantsBackend) => {
        return mutants.map((mutant) => {
            const backendMutant = mutantsBackend.find((mtnt) => mtnt.assetId === mutant.assetDetails.assetId);

            let mtnt = {};
            if (backendMutant) {
                mtnt = {
                    ...mutant,
                    issueNumber: backendMutant.issueNumber,
                };
            }
            return mtnt;
        });
    };

    getReadyMutants = async (
        address: addressId,
        options: {
            getFreeAnimals?: boolean;
            getOnSale?: boolean;
            getCanBreedStatus?: boolean;
            getOnFarming?: boolean;
            getFarmingRewards?: boolean;
            getAchievements?: boolean;
        },
    ): Promise<IMutantDetails[]> => {
        if (!isAddress(address)) {
            return [];
        }

        const {
            getFreeAnimals = true,
            getOnSale = true,
            getOnFarming = true,
            getCanBreedStatus = false,
            getFarmingRewards = false,
        } = options;
        const [freeAnimals, animalsOnSale, animalsOnFarming] = await Promise.all([
            getFreeAnimals ? this.helperService.getNftsOnAddress(address) : [],
            getOnSale ? this.getUsersMutantsOnSale(address) : [],
            getOnFarming ? this.getMutantsOnFarming(address) : [],
        ]);
        let allNfts: any[] = [...freeAnimals, ...animalsOnSale, ...animalsOnFarming];

        {
            const set = new Set();
            allNfts = allNfts.filter((nft) => {
                if (nft.issuer !== MUTANTS_BREEDER_DAPP_ADDRESS) {
                    return false;
                }
                if (set.has(nft.assetId)) {
                    return false;
                }
                set.add(nft.assetId);

                return true;
            });
        }

        if (getCanBreedStatus) {
            allNfts = await this.mutantsBreedingService.addCanBreed(allNfts);
        }

        return allNfts.map((nft) => {
            return {
                ...nft,
                type: '',
                id: nft.assetId,
                owner: '',
                title: '',
                onSale: nft.onSale ? nft.onSale : false,
                isArtefact: false,
                minSponsoredAssetFee: 0,
                achievements: {
                    a: [],
                    n: null,
                },
                // farmingPower: this.mutantsFarmingService.fetchFarmingPower(nft.name),
            };
        });
    };

    getUsersMutantsOnSale = async (address: addressId) => {
        const list = await this.auctionService
            .fetchLockedNftForUser(address)
            .then((list) => list.map((kv) => kv.value).filter(Boolean));

        const assetsDetails = await this.assetsService.fetchAssetsDetails(list);

        return assetsDetails.filter(this.isMutant).map((mutant) => ({
            ...mutant,
            status: {
                onFarming: false,
                onSale: true,
                onXmasStable: false,
                stakedOnDuckHouse: false,
            },
        }));
    };

    getOneMutantDetailsV2 = async (nftId: string, details?: boolean): Promise<IMutantDetailsLocked> => {
        const { data } = await this.helperService.http.get<any>(urlString(`${this.API_URL}/v2/mutants/${nftId}`), {});

        const animal = data.entity;
        // const achievements = (await this.addAchievements([animal]))[0]; TODO: Check if this line is needed
        //rarity in api is actually huntpower, and olrarity is actually rarity
        const animalDetails: IMutantDetailsLocked = {
            ...animal,
            rarity: animal.oldRarity,
            // achievements: achievements.achievements.a,
            // issueNumber: achievements.achievements.n,
            onFarming: animal.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.farming,
            ),
            onSale: animal.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.auction,
            ),
            inRental: animal.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.rental,
            ),
        };

        if (details) {
            return await this.mutantsFarmingService.addFarmingProductionOne(animalDetails);
        }
        return animalDetails;
    };

    getOneBreedingAnimal = async (
        callerAddress: addressId,
        hatchTxId: txId,
    ): Promise<AssetDetails & { rarity: number }> => {
        const mutantId = await attempt(
            () => this.mutantsBreedingService.fetchMutantIdByHatchTx(callerAddress, hatchTxId),
            {
                interAttemptsSleepTime: 1000,
                maxAttempts: 5,
                isResultSatisfies: (res) => res != null,
            },
        );

        if (!mutantId) {
            throw new Error(`Can't find mutant id with for ${callerAddress} with transaction ${hatchTxId}`);
        }

        const mutant = await this.assetsService.fetchAssetDetails(mutantId.value);
        const [mutantWithRarity] = await this.mutantsBreedingService.addRarityMutants([mutant]);

        return mutantWithRarity;
    };

    getAnimalImageByAssetId = (
        assetId: string | null | undefined,
        params: { filter?: 'grayscale'; cacheTs?: number } = {},
    ) => {
        if (assetId) {
            return urlString(
                `${this.IMAGES_SERVICE_URL}/api${params.cacheTs ? '/uncached' : ''}/mutants/${getUrlToSVGWithTimeStamp(
                    assetId,
                )}`,
                { filter: params.filter },
                params.cacheTs ? `t=${params.cacheTs}` : '',
            );
        }

        return `${this.APP_URL}/img/metaverse/${getUrlToPNGithTimeStamp('ducklization_img')}`;
    };

    getMutantParametersFromGenotype = (
        name: string,
        { assetId, cacheTs }: { assetId?: string; cacheTs?: number } = {},
    ): IMutantParamsFromGenotype => {
        const [, genoType, generationColor] = name.split('-');
        const generation = generationColor[0];
        const color = generationColor[1];
        const {
            name: generationName,
            number: generationNumber,
            color: bgColor,
        } = MUTANT_GENERATION_NAMES.hasOwnProperty(generation)
            ? MUTANT_GENERATION_NAMES[generation]
            : { name: generation, number: 'N/A', color: 'bg-inverse' };

        const mutantInfo = {
            image: assetId
                ? this.getAnimalImageByAssetId(assetId, { cacheTs })
                : this.getImageByGenotype(`${genoType}-${generationColor}`),
            name: this.getMutantNameFromGene(genoType),
        };
        const fullColor = MUTANT_COLORS[color];
        const fullColorName = MutantColorNames[color];

        return {
            genoType,
            generation,
            color,
            mutantInfo,
            fullColor,
            generationName,
            bgColor,
            fullColorName,
            generationNumber: generationNumber ? generationNumber.toString() : '',
        };
    };
}

export default CommonMutantsService;
