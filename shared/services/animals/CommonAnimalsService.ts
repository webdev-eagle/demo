import { isAddress } from '$shared/domain/guards';
import { Worlds } from '$shared/enums';
import { AssetDetails, WithRarityParams } from '$shared/types';
import {
    IAnimalDetails,
    IAnimalDetailsLocked,
    IAnimalDetailsV2,
    IAnimalsParamsFromGenotype,
    AnimalConnection,
} from '$shared/types/animals';
import {
    attempt,
    capitalize,
    getUrlToPNGithTimeStamp,
    getUrlToSVGWithTimeStamp,
    split,
    urlString,
} from '$shared/utils';
import CommonAnimalsBreedingService from '../animals-breeding/CommonAnimalsBreedingService';
import CommonAnimalsFarmingService from '../animals-farming';
import CommonAnimalsIncubatorService from '../animals-incubator/CommonAnimalsIncubatorService';
import CommonAssetsService from '../assets';
import CommonAuctionService from '../auction';
import CommonHelperService from '../helper';
import CommonProductionService from '../production';
import CommonScanService from '../scan';
abstract class CommonAnimalsService {
    abstract breedingService: CommonAnimalsBreedingService;
    abstract farmingService: CommonAnimalsFarmingService;
    abstract incubatorService: CommonAnimalsIncubatorService;
    abstract helperService: CommonHelperService;
    abstract assetsService: CommonAssetsService;
    abstract productionService: CommonProductionService;
    abstract auctionService: CommonAuctionService;
    abstract scanService: CommonScanService;
    abstract IMAGES_SERVICE_URL: string;
    abstract APP_URL: string;
    abstract API_URL: string;
    abstract ANIMAL_ACRONYM: string;
    abstract ANIMAL_PATH: string;
    abstract ANIMAL_CONSTANT: { [key: string]: { name: string; unique?: boolean } | string[] };
    abstract ANIMAL_GENERATION_NAMES: { [key: string]: { name: string; number: number; color: string } };
    abstract ANIMAL_COLORS: { [key: string]: string };
    abstract ANIMAL_COLORS_NAMES: { [key: string]: string };
    abstract INCUBATOR_DAPP_ADDRESS: string;
    abstract BREEDER_DAPP_ADDRESS: string;
    abstract FARMING_DAPP_ADDRESS: string;
    abstract DAPPS_CONTRACTS: { farming: string; auction: string; rental: string };

    calcFarmingProduction = (farmingPower: number, globalFarmingPower: number): string => {
        return (((40 * 30.4) / globalFarmingPower) * farmingPower).toFixed(4);
    };

    isAnimal = <T extends { name: string }>({ name }: T) => name.indexOf(`${this.ANIMAL_ACRONYM}-`) === 0;

    getAnimalNameFromGene = (geneString: string) => {
        const gene = geneString.startsWith(`${this.ANIMAL_ACRONYM}-`) ? split(geneString, '-')[1] : geneString;
        const animalGene = this.ANIMAL_CONSTANT[gene];
        if (animalGene && 'name' in animalGene) {
            return animalGene.name;
        }

        const name = gene
            .split('')
            .map((gene, index) => this.ANIMAL_CONSTANT[gene]?.[index])
            .join('')
            .toLowerCase();

        return capitalize(name);
    };

    getImageByGenotype = (
        genotype: string,
        options?: {
            onPerch?: boolean;
            color?: string | null;
            jedi?: boolean;
            assetId?: assetId;
            world?: Worlds;
            direction?: number;
            grayscale?: boolean;
        },
    ): string => {
        const {
            onPerch = false,
            color = null,
            jedi = false,
            assetId,
            world = Worlds.None,
            direction = 0,
            grayscale = false,
        } = options ?? {};
        const hasDruckGenes = genotype.includes('I');
        const animalName = `${this.ANIMAL_ACRONYM}-${genotype}`;
        return urlString(`${this.IMAGES_SERVICE_URL}/api/images/${getUrlToSVGWithTimeStamp(animalName)}`, {
            onPerch,
            color,
            jedi,
            druck: hasDruckGenes ? (this.helperService.assetIdAsFloat(assetId ?? '_') > 0.5 ? '1' : '2') : null,
            world,
            assetId,
            direction,
            grayscale,
        });
    };

    getAnimalImageByAssetId = (
        assetId: animalId | null | undefined,
        params: { filter?: 'grayscale'; cacheTs?: number } = {},
        ANIMAL_PATH?: string,
    ) => {
        if (assetId) {
            return urlString(
                `${this.IMAGES_SERVICE_URL}/api${params.cacheTs ? '' : ''}/${
                    ANIMAL_PATH ? ANIMAL_PATH : this.ANIMAL_PATH
                }/${getUrlToSVGWithTimeStamp(assetId)}`,
                { filter: params.filter },
                params.cacheTs ? `t=${params.cacheTs}` : '',
            );
        }

        return `${this.APP_URL}/img/metaverse/${getUrlToPNGithTimeStamp('ducklization_img')}`;
    };

    getOneAnimal = async (callerAddress: addressId, hatchTxId: txId): Promise<AssetDetails & WithRarityParams> => {
        const animalId = await attempt(() => this.incubatorService.fetchAnimalIdByHatchTx(callerAddress, hatchTxId), {
            interAttemptsSleepTime: 1000,
            maxAttempts: 5,
            isResultSatisfies: (res) => res != null,
        });

        if (!animalId) {
            throw new Error(`Can't find duck id with for ${callerAddress} with transaction ${hatchTxId}`);
        }

        const animal = await this.assetsService.fetchAssetDetails(animalId.value);
        const [animalWithRarity] = await this.productionService.addAnimalRarity([animal]);

        return animalWithRarity;
    };

    getOneBreedingAnimal = async (
        callerAddress: addressId,
        hatchTxId: txId,
    ): Promise<AssetDetails & WithRarityParams> => {
        const animalId = await attempt(() => this.breedingService.fetchAnimalsIdByHatchTx(callerAddress, hatchTxId), {
            interAttemptsSleepTime: 1000,
            maxAttempts: 5,
            isResultSatisfies: (res) => res != null,
        });

        if (!animalId) {
            throw new Error(`Can't find animal id with for ${callerAddress} with transaction ${hatchTxId}`);
        }

        const animal = await this.assetsService.fetchAssetDetails(animalId.value);
        const [animalWithRarity] = await this.productionService.addRarity([animal]);

        return animalWithRarity;
    };

    getAnimalParametersFromGenotype = (
        name: string,
        { assetId, cacheTs }: { assetId?: string; cacheTs?: number } = {},
        ANIMAL_PATH?: string,
    ): IAnimalsParamsFromGenotype => {
        const [, genoType, generationColor] = name.split('-');
        const generation = generationColor[0];
        const color = generationColor[1];
        const {
            name: generationName,
            number: generationNumber,
            color: bgColor,
        } = this.ANIMAL_GENERATION_NAMES.hasOwnProperty(generation)
            ? this.ANIMAL_GENERATION_NAMES[generation]
            : { name: generation, number: 'N/A', color: 'bg-inverse' };

        const animalDetails = {
            image: assetId
                ? this.getAnimalImageByAssetId(assetId, { cacheTs }, ANIMAL_PATH)
                : this.getImageByGenotype(`${genoType}-${generationColor}`),
            name: this.getAnimalNameFromGene(genoType),
        };
        const fullColor = this.ANIMAL_COLORS[color];
        const fullColorName = this.ANIMAL_COLORS_NAMES[color];

        return {
            genoType,
            generation,
            color,
            animalDetails,
            fullColor,
            generationName,
            bgColor,
            fullColorName,
            generationNumber: generationNumber ? generationNumber.toString() : '',
        };
    };

    getUsersAnimalsOnSale = async (address: addressId) => {
        const list = await this.auctionService
            .fetchLockedNftForUser(address)
            .then((list) => list.map((kv) => kv.value).filter(Boolean));

        const assetsDetails = await this.assetsService.fetchAssetsDetails(list);

        return assetsDetails.filter(this.isAnimal).map((animal) => ({ ...animal, onSale: true, onFarming: false }));
    };

    getAnimalsOnFarming = async (
        address: addressId,
        { withRewards }: { withRewards: boolean } = { withRewards: false },
    ) => {
        const farmingEntriesByAnimalId = await this.farmingService.fetchAnimalParamsOnAddress(address);
        const animalOnFarmingDetails = await this.assetsService.fetchAssetsDetails(
            Object.keys(farmingEntriesByAnimalId),
        );

        if (withRewards) {
            const totalValues = await this.farmingService.fetchFarmingGlobals();

            return animalOnFarmingDetails.map((animal) => {
                const { farmingParams, toClaim } = this.farmingService.calculateFarmingDetails(
                    farmingEntriesByAnimalId[animal.assetId] as any,
                    totalValues,
                );

                return {
                    ...animal,
                    onSale: false,
                    onFarming: true,
                    farmingParams,
                    toClaim,
                    perchColor: null,
                };
            });
        }

        return animalOnFarmingDetails.map((duck) => ({ ...duck, onSale: false, onFarming: true }));
    };

    getAnimalFp = (name: string) => {
        return this.helperService.getAnimalFarmPower(name);
    };

    getAnimalGeneration = (name: string) => {
        const [, , [generation]] = split(name, '-');

        return generation;
    };

    isLastGeneration = (name: string) =>
        this.getAnimalGeneration(name) === Object.keys(this.ANIMAL_GENERATION_NAMES).sort().reverse()[0];

    fetchFreeAnimalsBreeding = async (address: addressId, forMutants = false): Promise<IAnimalDetailsV2[]> => {
        if (!isAddress(address)) {
            return [];
        }

        const { data } = await this.helperService.http.get<any>(
            urlString(`${this.API_URL}/v2/addresses/${address}/${this.ANIMAL_PATH}`),
            {
                params: {
                    size: 200_000,
                    details: false,
                },
            },
        );
        const { data: result } = data;
        return result.data.filter(
            (animal: IAnimalDetailsV2) => animal.canBreed && (forMutants || !this.isLastGeneration(animal.name)),
        );
    };

    getReadyAnimals = async (
        address: addressId,
        options: {
            getFreeAnimals?: boolean;
            getOnSale?: boolean;
            getCanBreedStatus?: boolean;
            getOnFarming?: boolean;
            getFarmingRewards?: boolean;
            getAchievements?: boolean;
        },
    ): Promise<IAnimalDetails[]> => {
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
            getOnSale ? this.getUsersAnimalsOnSale(address) : [],
            getOnFarming ? this.getAnimalsOnFarming(address, { withRewards: getFarmingRewards }) : [],
        ]);
        let allNfts: any[] = [...freeAnimals, ...animalsOnSale, ...animalsOnFarming];

        {
            const set = new Set();
            allNfts = allNfts.filter((nft) => {
                if (nft.issuer !== this.INCUBATOR_DAPP_ADDRESS && nft.issuer !== this.BREEDER_DAPP_ADDRESS) {
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
            allNfts = await this.breedingService.addCanBreed(allNfts);
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
                farmingPower: this.helperService.getAnimalFarmPower(nft.name),
            };
        });
    };

    getOneAnimalDetailsV2 = async (nftId: string, details?: boolean): Promise<IAnimalDetailsLocked> => {
        const { data } = await this.helperService.http.get<any>(
            urlString(`${this.API_URL}/v2/${this.ANIMAL_PATH}/${nftId}`),
            {},
        );

        const animal = data.entity;
        // const achievements = (await this.addAchievements([animal]))[0]; TODO: Check if this line is needed
        //rarity in api is actually huntpower, and olrarity is actually rarity
        const animalDetails: IAnimalDetailsLocked = {
            ...animal,
            rarity: animal.rarity,
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
            return await this.farmingService.addFarmingProductionOne(animalDetails);
        }
        return animalDetails;
    };

    fetchAnimalConnections = async (assetId: animalId): Promise<AnimalConnection[]> => {
        const { data: { data = [] } = {} } = await this.helperService.http.get<{ data: AnimalConnection[] }>(
            `${this.API_URL}/v2/${this.ANIMAL_PATH}/${assetId}/connections`,
        );

        return data;
    };
}

export default CommonAnimalsService;
