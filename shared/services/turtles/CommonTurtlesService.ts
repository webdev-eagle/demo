import { TURTLE_COLORS } from '$shared/constants';
import { TURTLE_GENERATION_NAMES, TurtleColorNames, Turtles } from '$shared/constants/turtles';
import { getAddress } from '$shared/domain/constants';
import { isAddress } from '$shared/domain/guards';
import { Worlds } from '$shared/enums';
import CommonScanService from '$shared/services/scan';
import { AssetDetails, ITurtlesDetails, WithAchievements, WithRarityParams } from '$shared/types';
import { IAnimalDetails, IAnimalsParamsFromGenotype } from '$shared/types/animals';
import { ITurtleDetailsLocked } from '$shared/types/turtles';
import { attempt, capitalize, getUrlToPNGithTimeStamp, getUrlToSVGWithTimeStamp, split, urlString } from '../../utils';
import CommonAssetsService from '../assets';
import CommonAuctionService from '../auction';
import type CommonHelperService from '../helper';
import CommonProductionService from '../production';
import CommonTurtlesBreedingService from '../turtles-breeding';
import CommonTurtlesFarmingService from '../turtles-farming';
import CommonTurtlesIncubatorService from '../turtles-incubator';

const TURTLES_INCUBATOR_DAPP_ADDRESS = getAddress('TURTLES_INCUBATOR_DAPP');
const TURTLES_BREEDER_DAPP_ADDRESS = getAddress('TURTLES_BREEDER_DAPP');

abstract class CommonTurtlesService {
    abstract helperService: CommonHelperService;
    abstract assetsService: CommonAssetsService;
    abstract productionService: CommonProductionService;
    abstract turtlesIncubatorService: CommonTurtlesIncubatorService;
    abstract auctionService: CommonAuctionService;
    abstract turtleBreedingService: CommonTurtlesBreedingService;
    abstract turtleFarmingService: CommonTurtlesFarmingService;
    abstract scanService: CommonScanService;
    abstract IMAGES_SERVICE_URL: string;
    abstract APP_URL: string;
    abstract API_URL: string;

    DAPPS_CONTRACTS = {
        auction: getAddress('AUCTION_DAPP'),
        farming: getAddress('TURTLES_FARMING_DAPP'),
        rental: getAddress('RENT_DAPP_ADDRESS'),
    };

    isAnimal = <T extends { name: string }>({ name }: T) => name.indexOf('TRTL-') === 0;

    getAnimalNameFromGene = (geneString: string) => {
        const gene = geneString.startsWith('TRTL-') ? split(geneString, '-')[1] : geneString;
        if (gene in Turtles) {
            return Turtles[gene].name;
        }

        const name = gene
            .split('')
            .map((gene, index) => Turtles[gene]?.[index])
            .join('')
            .toLowerCase();

        return capitalize(name);
    };

    /**
     * @description Returns a link to a turtle image by genotype
     *
     * @param {string} genotype
     * @param {object} options
     * @param {boolean} [options.onFarming=false]
     * @param {(string | null)} [options.color=null]
     * @param {boolean} [options.jedi=false]
     * @param {string} [options.assetId='_']
     * @param {Worlds} [options.world=Worlds.None]
     *
     * @return {string}
     */
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
        const turtleName = `TRTL-${genotype}`;
        return urlString(`${this.IMAGES_SERVICE_URL}/api/images/${getUrlToSVGWithTimeStamp(turtleName)}`, {
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
        assetId: turtleId | null | undefined,
        params: { filter?: 'grayscale'; cacheTs?: number } = {},
    ) => {
        if (assetId) {
            return urlString(
                `${this.IMAGES_SERVICE_URL}/api${params.cacheTs ? '/uncached' : ''}/turtles/${getUrlToSVGWithTimeStamp(
                    assetId,
                )}`,
                { filter: params.filter },
                params.cacheTs ? `t=${params.cacheTs}` : '',
            );
        }

        return `${this.APP_URL}/img/metaverse/${getUrlToPNGithTimeStamp('turtlelization_img')}`;
    };

    getOneAnimal = async (callerAddress: addressId, hatchTxId: txId): Promise<AssetDetails & WithRarityParams> => {
        const turtleId = await attempt(
            () => this.turtlesIncubatorService.fetchAnimalIdByHatchTx(callerAddress, hatchTxId),
            {
                interAttemptsSleepTime: 1000,
                maxAttempts: 5,
                isResultSatisfies: (res) => res != null,
            },
        );

        if (!turtleId) {
            throw new Error(`Can't find turtle id with for ${callerAddress} with transaction ${hatchTxId}`);
        }

        const turtle = await this.assetsService.fetchAssetDetails(turtleId.value);
        const [turtleWithRarity] = await this.productionService.addAnimalRarity([turtle]);

        return turtleWithRarity;
    };

    getOneBreedingAnimal = async (
        callerAddress: addressId,
        hatchTxId: txId,
    ): Promise<AssetDetails & WithRarityParams> => {
        const turtleId = await attempt(
            () => this.turtleBreedingService.fetchAnimalsIdByHatchTx(callerAddress, hatchTxId),
            {
                interAttemptsSleepTime: 1000,
                maxAttempts: 5,
                isResultSatisfies: (res) => res != null,
            },
        );

        if (!turtleId) {
            throw new Error(`Can't find turtle id with for ${callerAddress} with transaction ${hatchTxId}`);
        }

        const turtle = await this.assetsService.fetchAssetDetails(turtleId.value);
        const [turtleWithRarity] = await this.productionService.addRarity([turtle]); // We need it?

        return turtleWithRarity;
    };

    getAnimalParametersFromGenotype = (
        name: string,
        { assetId, cacheTs }: { assetId?: string; cacheTs?: number } = {},
    ): IAnimalsParamsFromGenotype => {
        const [, genoType, generationColor] = name.split('-');
        const generation = generationColor[0];
        const color = generationColor[1];
        const {
            name: generationName,
            number: generationNumber,
            color: bgColor,
        } = TURTLE_GENERATION_NAMES.hasOwnProperty(generation)
            ? TURTLE_GENERATION_NAMES[generation]
            : { name: generation, number: 'N/A', color: 'bg-inverse' };

        const animalDetails = {
            image: assetId
                ? this.getAnimalImageByAssetId(assetId, { cacheTs })
                : this.getImageByGenotype(`${genoType}-${generationColor}`),
            name: this.getAnimalNameFromGene(genoType),
        };
        const fullColor = TURTLE_COLORS[color];
        const fullColorName = TurtleColorNames[color];

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

        return assetsDetails.filter(this.isAnimal).map((turtle) => ({ ...turtle, onSale: true, onFarming: false }));
    };

    getAnimalsOnFarming = async (
        address: addressId,
        { withRewards }: { withRewards: boolean } = { withRewards: false },
    ) => {
        const farmingEntriesByTurtleId = await this.turtleFarmingService.fetchTurtlesParamsOnAddress(address);
        const turtlesOnFarmingDetails = await this.assetsService.fetchAssetsDetails(
            Object.keys(farmingEntriesByTurtleId),
        );

        if (withRewards) {
            const blockchainHeight = await this.helperService.getBlockchainHeight();
            const totalValues = await this.turtleFarmingService.fetchFarmingGlobals();

            return turtlesOnFarmingDetails.map((turtle) => {
                const { farmingParams, toClaim } = this.turtleFarmingService.calculateTurtlesFarmingDetails(
                    farmingEntriesByTurtleId[turtle.assetId] as any,
                    address,
                    turtle.assetId,
                    totalValues,
                    blockchainHeight,
                );

                return {
                    ...turtle,
                    onSale: false,
                    onFarming: true,
                    farmingParams,
                    toClaim,
                    perchColor: null,
                };
            });
        }

        return turtlesOnFarmingDetails.map((turtle) => ({ ...turtle, onSale: false, onFarming: true }));
    };

    getAnimalGeneration = (name: string) => {
        const [, , [generation]] = split(name, '-');

        return generation;
    };

    isLastGeneration = (name: string) =>
        this.getAnimalGeneration(name) === Object.keys(TURTLE_GENERATION_NAMES).sort().reverse()[0];
    addAchievements = async <T extends { assetId: assetId }>(nfts: T[]): Promise<Array<T & WithAchievements>> => {
        const achievements = await this.scanService.fetchAchievementsForTurtles(nfts);
        return nfts.map((nft) => ({
            ...nft,
            achievements: achievements?.[nft.assetId]?.a
                ? achievements[nft.assetId]
                : {
                      a: [],
                      n: null,
                  },
        }));
    };
    getReadyAnimals = async (
        address,
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
            getAchievements = true,
        } = options;
        const [freeTurtles, turtlesOnSale, turtlesOnFarming] = await Promise.all([
            getFreeAnimals ? this.helperService.getNftsOnAddress(address) : [],
            getOnSale ? this.getUsersAnimalsOnSale(address) : [],
            getOnFarming ? this.getAnimalsOnFarming(address, { withRewards: getFarmingRewards }) : [],
        ]);
        let allNfts: any[] = [...freeTurtles, ...turtlesOnSale, ...turtlesOnFarming];
        // NFT list deduplication
        // May occur due to slow cache invalidation
        // Should be removed when cache data normalization is ready
        {
            const set = new Set();
            allNfts = allNfts.filter((nft) => {
                if (nft.issuer !== TURTLES_INCUBATOR_DAPP_ADDRESS && nft.issuer !== TURTLES_BREEDER_DAPP_ADDRESS) {
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
            allNfts = await this.turtleBreedingService.addCanBreed(allNfts);
        }

        if (getAchievements) {
            const turtle = await this.addAchievements(allNfts);
            return turtle.map((nft) => {
                return {
                    ...nft,
                    type: '',
                    id: nft.assetId,
                    owner: '',
                    title: '',
                    onSale: nft.onSale ? nft.onSale : false,
                    isArtefact: false,
                    minSponsoredAssetFee: 0,
                    farmingPower: nft.basePower,
                };
            });
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
                farmingPower: nft.basePower,
            };
        });
    };

    // TODO: turtles
    getOneAnimalDetails = async (nftId: string): Promise<ITurtlesDetails> => {
        let _result = await this.assetsService.fetchAssetDetails<ITurtlesDetails>(nftId);
        let turtleOwner: string | null = null;

        _result = (await this.turtleBreedingService.addCanBreed([_result]))[0];
        _result = (await this.addAchievements([_result]))[0];
        _result.description = '';
        const [turtleOnAuctionBalance, farmingOwner] = await Promise.all([
            // this.stakedTurtleService.fetchTurtleOwner(nftId),
            this.auctionService.fetchAssetBalance(nftId),
            this.turtleFarmingService.fetchTurtleOwner(nftId),
        ]);

        _result.onSale = turtleOnAuctionBalance > 0;
        if (farmingOwner) {
            const { owner, toClaim, perchColor, farmingParams } = await this.turtleFarmingService.fetchFarmingDetails(
                nftId,
                farmingOwner.value,
            );
            turtleOwner = owner;
            _result.owner = owner;
            _result.onFarming = true;
            _result.perchColor = undefined;
            _result.farmingParams = farmingParams;

            _result.toClaim = toClaim;
        } else {
            _result.onFarming = false;
        }

        if (_result.onSale) {
            const auctionDetails = await this.auctionService.fetchLastAuctionDetails(nftId);

            _result = {
                ..._result,
                ...auctionDetails,
            };
        } else {
            _result.owner = turtleOwner || (await this.helperService.getNftOwner(nftId));
        }

        const [fullData] = await this.productionService.addRarity([_result]);
        return fullData;
    };

    getOneTurtleDetailsV2 = async (nftId: string): Promise<ITurtleDetailsLocked> => {
        const { data } = await this.helperService.http.get<any>(urlString(`${this.API_URL}/v2/turtles/${nftId}`), {});
        const turtle = data.entity;
        const achievements = (await this.addAchievements([turtle]))[0];
        let turtleDetails: ITurtleDetailsLocked = {
            ...turtle,
            achievements: achievements.achievements.a,
            issueNumber: achievements.achievements.n,
            onFarming: turtle.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.farming,
            ),
            onSale: turtle.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.auction,
            ),
        };

        let responseFarming = await this.turtleFarmingService.fetchFarmingDetails(turtle.assetId, turtle.owner);

        turtleDetails = {
            ...turtleDetails,
            ...responseFarming,
        };
        return turtleDetails;
    };

    getOneAnimalDetailsV2 = async (nftId: string, details?: boolean): Promise<ITurtleDetailsLocked> => {
        const { data } = await this.helperService.http.get<any>(urlString(`${this.API_URL}/v2/turtles/${nftId}`), {});
        const animal = data.entity;
        // const achievements = (await this.addAchievements([animal]))[0]; TODO: Check if this line is needed
        //rarity in api is actually huntpower, and olrarity is actually rarity
        const animalDetails: ITurtleDetailsLocked = {
            ...animal,
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

        // if (details) {
        //     return await this.farmingService.addFarmingProductionOne(animalDetails);
        // }
        return animalDetails;
    };
}

export default CommonTurtlesService;
