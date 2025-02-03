import { IDuckDetailsLocked } from '$shared/types/ducks';
import { RentalDuckStatus, RentalplaceView } from '$shared/types/marketplaces';
import {
    DUCKLINGS_FIRST_LAP_START_TS,
    DUCKLINGS_LAP_LENGTH_TS,
    DUCK_COLORS,
    DUCK_GENERATION_NAMES,
    DuckColorNames,
    Ducks,
} from '../../constants';
import { getAddress } from '../../domain/constants';
import { isJackpot } from '../../domain/ducks';
import { isAddress } from '../../domain/guards';
import { Worlds } from '../../enums';
import type {
    AssetDetails,
    ContractStringData,
    IDuckDetails,
    IDuckParamsFromGenotype,
    WithAchievements,
    WithRarityParams,
} from '../../types';
import { attempt, capitalize, chunkUpBy, getUrlToSVGWithTimeStamp, split, urlString } from '../../utils';
import type CommonArtefactService from '../artefact';
import type CommonAssetsService from '../assets';
import type CommonAuctionService from '../auction';
import type CommonBreedingService from '../breeding';
import type CommonDuckHouseService from '../duck-house';
import CommonFarmingService from '../farming';
import type CommonHelperService from '../helper';
import type CommonIncubatorService from '../incubator';
import type CommonProductionService from '../production';
import type CommonRentalDucksService from '../rental-ducks';
import type CommonScanService from '../scan';
import type CommonStakedDuckService from '../staked-duck';
import type CommonThirdPartyService from '../third-party';
import CommonVeggFarmingService from '../vegg-farming/CommonVeggFarmingService';
import type CommonWarsService from '../wars';

const DUCK_INCUBATOR_DAPP_ADDRESS = getAddress('DUCK_INCUBATOR_DAPP');
const DUCK_BREEDER_DAPP_ADDRESS = getAddress('DUCK_BREEDER_DAPP');

const WEARABLES_DAPP_ADDRESS = getAddress('WEARABLES_DAPP');

abstract class CommonDucksService {
    abstract helperService: CommonHelperService;
    abstract assetsService: CommonAssetsService;
    abstract artefactService: CommonArtefactService;
    abstract farmingService: CommonFarmingService;
    abstract veggFarmingService: CommonVeggFarmingService;
    abstract breedingService: CommonBreedingService;
    abstract incubatorService: CommonIncubatorService;
    abstract productionService: CommonProductionService;
    abstract warsService: CommonWarsService;
    abstract duckHuntService: CommonThirdPartyService;
    abstract stakedDuckService: CommonStakedDuckService;
    abstract auctionService: CommonAuctionService;
    abstract duckHouseService: CommonDuckHouseService;
    abstract megaDuckHouseService: CommonDuckHouseService;
    abstract xmasStbleService: CommonDuckHouseService;
    abstract scanService: CommonScanService;
    abstract rentalDucksService: CommonRentalDucksService;

    abstract APP_URL: string;
    abstract API_URL: string;
    abstract IMAGES_SERVICE_URL: string;

    DAPPS_CONTRACTS = {
        auction: getAddress('AUCTION_DAPP'),
        wars: getAddress('GAME_DAPP'),
        hunt: getAddress('HUNT_DAPP'),
        veggFarming: getAddress('VEGG_FARMING_DAPP'),
        farming: getAddress('DUCK_FARMING_DAPP'),
        rental: getAddress('RENT_DAPP_ADDRESS'),
        xmasStble: getAddress('XMAS_STBLE_DAPP'),
    };

    /** TODO: SHOULD BE ERASED ASAP. JUST REMAINS REFACTOR HUNT TO ERASE THIS
     *
     * @deprecated
     */
    // 3PQf8xUsCEfKtvpRNX9PZN3jK961gapuJNz true false false true false
    // async getReadyDucks(address, getOnSaleStatus = true, getCanBreedStatus = false, getFarmingRewards = false, getAchievements = true, getInWarsDucks = false): Promise<INft[]> {
    getReadyDucks = async (
        address,
        options: {
            getFreeDucks?: boolean;
            getOnSale?: boolean;
            getCanBreedStatus?: boolean;
            getOnFarming?: boolean;
            getOnVeggFarming?: boolean;
            getFarmingRewards?: boolean;
            getAchievements?: boolean;
            getInWarsDucks?: boolean;
            getOnHunt?: boolean;
            getOnRental?: boolean;
            getOnXmasStble?: boolean;
            getAllRentedDucks?: boolean;
            getRented?: boolean;
        },
    ): Promise<IDuckDetails[]> => {
        if (!isAddress(address)) {
            return [];
        }
        const {
            getFreeDucks = true,
            getOnSale = true,
            getOnFarming = false,
            getOnVeggFarming = false,
            getCanBreedStatus = false,
            getFarmingRewards = false,
            getAchievements = true,
            getInWarsDucks = false,
            getOnHunt = false,
            getOnRental = false,
            getOnXmasStble = false,
            getAllRentedDucks = false,
            getRented = false,
        } = options;
        const [
            freeDucks,
            ducksOnSale,
            ducksOnWars,
            ducksOnHunt,
            ducksOnFarming,
            ducksOnVeggFarming,
            ducksOnRental,
            ducksOnXmasStble,
            rentedDucks,
            allRentedDucks,
        ] = await Promise.all([
            getFreeDucks ? this.helperService.getNftsOnAddress(address) : [],
            getOnSale ? this.getUsersDucksOnSale(address) : [],
            getInWarsDucks ? this.getUsersDucksOnWars(address) : [],
            getOnHunt ? this.getUsersDucksOnGame(address, Worlds.Hunt, this.duckHuntService) : [],
            getOnFarming ? this.getDucksOnFarming(address, { withRewards: getFarmingRewards }) : [],
            getOnVeggFarming ? this.getDucksOnFarmingVegg(address, { withRewards: getFarmingRewards }) : [],
            getOnRental ? this.getUsersDucksOnRental(address) : [], // Ducks locked in rentalplace
            getOnXmasStble ? this.getUsersDucksOnXmasStable(address) : [],
            getRented ? this.getUserRentedDucks(address) : [], // Rented ducks
            getAllRentedDucks ? this.getAllRentedDucks() : [], // For Duck Hunt, cause request is come with HUNT_DAPP_ADDRESS
        ]);
        let allNfts = [
            ...freeDucks,
            ...ducksOnSale,
            ...ducksOnWars,
            ...ducksOnHunt,
            ...ducksOnFarming,
            ...ducksOnVeggFarming,
            ...rentedDucks,
            ...ducksOnXmasStble,
        ];
        // NFT list deduplication
        // May occur due to slow cache invalidation
        // Should be removed when cache data normalization is ready
        {
            const set = new Set();
            allNfts = allNfts.filter((nft) => {
                if (nft.issuer !== DUCK_INCUBATOR_DAPP_ADDRESS && nft.issuer !== DUCK_BREEDER_DAPP_ADDRESS) {
                    return false;
                }
                if (set.has(nft.assetId)) {
                    return false;
                }
                set.add(nft.assetId);

                return true;
            });
        }

        // Add is in rental
        if (ducksOnRental?.length) {
            allNfts = allNfts.map((nft) => {
                const inRental = ducksOnRental.some(({ assetId }) => assetId === nft.assetId);
                return {
                    ...nft,
                    inRental,
                };
            });
        }

        // Add rental duck info for Hunt
        if (allRentedDucks?.length) {
            allNfts = allNfts.map((nft) => {
                const rentalDuck = allRentedDucks.find(({ assetId }) => assetId === nft.assetId);
                return {
                    ...nft,
                    rentalDuck,
                };
            });
        }

        if (getCanBreedStatus) {
            allNfts = await this.breedingService.addCanBreed(allNfts);
        }
        let fullTokenDetails = await this.productionService.addRarity(
            allNfts.sort((a, b) => (a.issueTimestamp > b.issueTimestamp ? -1 : 1)),
        );

        if (getAchievements) {
            return this.addAchievements(fullTokenDetails);
        }

        return fullTokenDetails.map((nft) => ({
            ...nft,
            achievements: {
                a: [],
                n: null,
            },
        }));
    };

    isDuck = <T extends { name: string }>({ name }: T) => name.indexOf('DUCK-') === 0;

    addAchievements = async <T extends { assetId: assetId }>(nfts: T[]): Promise<Array<T & WithAchievements>> => {
        const achievements = await this.scanService.fetchAchievementsForDucks(nfts);
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

    addItems = async (nfts: any[]): Promise<any> => {
        const items = await this.getItems();

        const artefactsMap = items.reduce((map, { key }) => {
            const [duckId, ...rest] = split(key, '_');
            const artefact = rest.join('_');
            const [, artefactType] = split(artefact, '-');

            if (map.has(duckId)) {
                map.set(duckId, [...map.get(duckId), artefactType]);
            } else {
                map.set(duckId, [artefactType]);
            }

            return map;
        }, new Map<duckId, string[]>());

        return nfts.map((nft) => ({
            ...nft,
            items: artefactsMap.get(nft.assetId) ?? [],
        }));
    };

    getItems = async (): Promise<any> => {
        const { fetchContractDataByMatch } = this.helperService;
        return await fetchContractDataByMatch<ContractStringData<`${string}_ART_${string}`>>(
            WEARABLES_DAPP_ADDRESS,
            `.*_ART-.*`,
        );
    };

    /**
     * Converts milliseconds to a string of the time remaining until the duck is ready
     * @param {number} millisec
     * @return string
     */
    convertMillisecondsToDuckTimeString = (millisec: number): string => {
        const seconds: string | number = +(millisec / 1000).toFixed(0);
        let minutes: string | number = Math.floor(seconds / 60);
        let hours: any = '';
        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            hours = hours >= 10 ? hours : `0${hours}`;
            minutes -= hours * 60;
            minutes = minutes >= 10 ? minutes : `0${minutes}`;
        }
        if (!minutes) minutes = '00';
        if (hours) {
            if (hours < 10) return `${`0${hours}` + 'h:'}${minutes}m`;
            return `${hours}h:${minutes}m`;
        }
        return `00h:${minutes}m`;
    };

    /**
     * Returns the circle number in the game by timestamp
     * @return {number}
     */
    getWarsLapByTs = (timestamp: number): number => {
        return Math.ceil((timestamp - DUCKLINGS_FIRST_LAP_START_TS) / DUCKLINGS_LAP_LENGTH_TS);
    };

    /**
     * Returns the circle number in the game
     * @return {number}
     */
    getCurrentWarsLap = (): number => {
        return this.getWarsLapByTs(Date.now());
    };

    getUsersDucksOnSale = async (address: addressId) => {
        const list = await this.auctionService
            .fetchLockedNftForUser(address)
            .then((list) => list.map((kv) => kv.value).filter(Boolean));
        const assetsDetails = await this.assetsService.fetchAssetsDetails(list);

        return assetsDetails.filter(this.isDuck).map((duck) => ({ ...duck, onSale: true, onFarming: false }));
    };

    getUsersDucksOnWars = async (address: addressId) => {
        const wornMantlesParams = await this.warsService.fetchWornMantleParamsByUser(address);
        const ducksInWarsDetails = await this.assetsService.fetchAssetsDetails(Object.keys(wornMantlesParams));

        return ducksInWarsDetails.map((duck) => ({
            ...duck,
            inWars: true,
            artefacts: wornMantlesParams[duck.assetId],
        }));
    };

    getUsersDucksOnGame = async (address: addressId, world: Worlds, service: CommonThirdPartyService) => {
        const ducksInGames = await service.fetchLockedDucksIds(address);
        const allDucks = [...ducksInGames];
        const ducksInGamesDetails = await this.assetsService.fetchAssetsDetails(allDucks);

        return ducksInGamesDetails.map((duck) => ({ ...duck, lockedInGame: true, world }));
    };

    getDucksOnFarmingVegg = async (
        address: addressId,
        { withRewards }: { withRewards: boolean } = { withRewards: false },
    ) => {
        const farmingEntriesByDuckId = await this.veggFarmingService.fetchDucksParamsOnAddress(address);
        const ducksOnFarmingDetails = await this.assetsService.fetchAssetsDetails(Object.keys(farmingEntriesByDuckId));

        if (withRewards) {
            const totalValues = await this.veggFarmingService.fetchFarmingVeggGlobals();

            return ducksOnFarmingDetails.map((duck) => {
                const { farmingParams, toClaim } = this.veggFarmingService.calculateVeggFarmingDetails(
                    farmingEntriesByDuckId[duck.assetId],
                    totalValues,
                );
                return {
                    ...duck,
                    onSale: false,
                    onFarming: false,
                    onFarmingVegg: true,
                    farmingParams,
                    toClaim,
                    perchColor: isJackpot(duck) ? farmingEntriesByDuckId[duck.assetId].perchColor : null,
                };
            });
        }

        return ducksOnFarmingDetails.map((duck) => ({ ...duck, onSale: false, onFarming: true }));
    };

    getDucksOnFarming = async (
        address: addressId,
        { withRewards }: { withRewards: boolean } = { withRewards: false },
    ) => {
        const farmingEntriesByDuckId = await this.farmingService.fetchDucksParamsOnAddress(address);
        const ducksOnFarmingDetails = await this.assetsService.fetchAssetsDetails(Object.keys(farmingEntriesByDuckId));

        if (withRewards) {
            const totalValues = await this.farmingService.fetchFarmingGlobals();

            return ducksOnFarmingDetails.map((duck) => {
                const { farmingParams, toClaim } = this.farmingService.calculateFarmingDetails(
                    farmingEntriesByDuckId[duck.assetId],
                    totalValues,
                );
                return {
                    ...duck,
                    onSale: false,
                    onFarming: true,
                    onFarmingVegg: false,
                    farmingParams,
                    toClaim,
                    perchColor: isJackpot(duck) ? farmingEntriesByDuckId[duck.assetId].perchColor : null,
                };
            });
        }

        return ducksOnFarmingDetails.map((duck) => ({ ...duck, onSale: false, onFarming: true }));
    };
    getUsersDucksOnRental = async (address: addressId) => {
        const filters = {
            activeTab: RentalplaceView.MY_DUCKS,
            userAddress: address,
        };

        return this.rentalDucksService.fetchRentalDucks(filters);
    };

    getAllRentedDucks = async () => {
        const filters = {
            status: RentalDuckStatus.RENTED,
        };

        return this.rentalDucksService.fetchRentalDucks(filters);
    };

    getUserRentedDucks = async (address: addressId) => {
        return this.rentalDucksService.fetchDucksRentedByUser(address);
    };

    getUsersDucksOnXmasStable = async (address: addressId) => {
        return this.xmasStbleService.fetchUserAllDucksFromXmasStable(address);
    };

    /**
     * @deprecated
     * @param address
     */
    getMyBids = async (address: string) => {
        const bidsById = await this.auctionService.fetchAddressesBidParamsById(address);
        const statusesById = await this.auctionService.fetchBidsStatuses(Object.values(bidsById));

        if (Object.keys(statusesById).length === 0) {
            return [];
        }

        const assetIdsWithActiveBids = Object.values(bidsById)
            .filter(({ bidId }) => statusesById[bidId] === 'open')
            .map((bid) => bid.assetId);

        const assets = await this.assetsService.fetchAssetsDetails(assetIdsWithActiveBids);

        const batches = chunkUpBy(100, assets);

        const promises = batches.map(async (batch) => {
            const batchAssets = await this.auctionService.fetchMarketplaceNftDetails(batch);
            const assetsWithRarities = await this.productionService.addRarity(batchAssets);
            const assetsWithRaritiesAndAchievements = await this.addAchievements(assetsWithRarities);
            const assetsWithRaritiesAndAchievementsAndFertility = await this.breedingService.addCanBreed(
                assetsWithRaritiesAndAchievements,
            );

            return assetsWithRaritiesAndAchievementsAndFertility.map((item) =>
                this.artefactService.isArtefact(item)
                    ? this.artefactService.formatArtefactData({
                          assetDetails: item,
                          owner: address,
                          onSale: true,
                      })
                    : { ...item, type: item.name, owner: address, onSale: true },
            );
        });

        return Promise.all(promises).then((results) => results.flat());
    };

    getOneDuck = async (callerAddress: addressId, hatchTxId: txId): Promise<AssetDetails & WithRarityParams> => {
        const duckId = await attempt(() => this.incubatorService.fetchAnimalIdByHatchTx(callerAddress, hatchTxId), {
            interAttemptsSleepTime: 1000,
            maxAttempts: 5,
            isResultSatisfies: (res) => res != null,
        });
        if (!duckId) {
            throw new Error(`Can't find duck id with for ${callerAddress} with transaction ${hatchTxId}`);
        }

        const duck = await this.assetsService.fetchAssetDetails(duckId.value);
        const [duckWithRarity] = await this.productionService.addRarity([duck]);

        return duckWithRarity;
    };

    getOneBreedingAnimal = async (
        callerAddress: addressId,
        hatchTxId: txId,
    ): Promise<AssetDetails & WithRarityParams> => {
        const duckId = await attempt(() => this.breedingService.fetchAnimalsIdByHatchTx(callerAddress, hatchTxId), {
            interAttemptsSleepTime: 1000,
            maxAttempts: 5,
            isResultSatisfies: (res) => res != null,
        });

        if (!duckId) {
            throw new Error(`Can't find duck id with for ${callerAddress} with transaction ${hatchTxId}`);
        }

        const duck = await this.assetsService.fetchAssetDetails(duckId.value);
        const [duckWithRarity] = await this.productionService.addRarity([duck]);

        return duckWithRarity;
    };

    getOneDuckDetailsV2 = async (nftId: string, details?: boolean): Promise<IDuckDetailsLocked> => {
        const { data } = await this.helperService.http.get<any>(urlString(`${this.API_URL}/v2/ducks/${nftId}`), {});
        const duck = data.entity;
        //rarity in api is actually huntpower, and olrarity is actually rarity
        const duckDetails: IDuckDetailsLocked = {
            ...duck,
            rarity: duck.oldRarity,
            onFarming: duck.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.farming,
            ),
            onFarmingVegg: duck.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.veggFarming,
            ),
            onSale: duck.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.auction,
            ),
            // TODO: check if rental is correct
            inRental: duck.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.rental,
            ),
            inWars: duck.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.wars,
            ),
            // TODO: hunt does not appear to be correct in locks?
            inHunt: duck.locks.some(
                (lock: { assetId: string; dApp: string }) => lock.dApp === this.DAPPS_CONTRACTS.hunt,
            ),
        };

        //TODO; add basic farmingParams
        // TODO: Send details to backend like fetchUserPageV2 method.
        if (details) {
            const eggPrdInfo = await this.productionService.addEggProductionOne(duckDetails);
            return await this.productionService.addVEggProductionOne(eggPrdInfo);
        }
        return duckDetails;
    };
    /** @deprecated */
    getOneDuckDetails = async (nftId: string): Promise<IDuckDetails> => {
        //TODO: This method is still used in urls like /duck/:DUCKID:/main, this brings heavy load and should be killed
        let _result = await this.assetsService.fetchAssetDetails<IDuckDetails>(nftId);
        let duckOwner: string | undefined = undefined;

        _result = (await this.breedingService.addCanBreed([_result]))[0];
        //TODO: Removed this since we ar enot supposed to use this anymore from scan service, right?
        //_result = (await this.addAchievements([_result]))[0];
        _result.description = '';
        const [
            warsDAppResponse,
            duckHuntDAppResponse,
            duckOnAuctionBalance,
            farmingOwner,
            veggFarmingOwner,
            duckHouseOwner,
            megaDuckHouseOwner,
            xmasStbleOwner,
            duckOnXmasStable,
            rentalDuck,
        ] = await Promise.all([
            this.warsService.fetchWornMantleParams(nftId),
            this.duckHuntService.fetchLockedDuckParams(nftId),
            this.auctionService.fetchAssetBalance(nftId),
            this.farmingService.fetchDuckOwnerForFarming(nftId),
            this.veggFarmingService.fetchDuckOwnerForVegg(nftId),
            this.duckHouseService.getUserDuckOwner(nftId),
            this.megaDuckHouseService.getUserDuckOwner(nftId),
            this.xmasStbleService.getUserDuckOwner(nftId),
            this.xmasStbleService.fetchStakedDucks(nftId),
            this.rentalDucksService.fetchOneRentalDuck(nftId),
        ]);
        _result.inWars = !!warsDAppResponse;
        _result.onSale = duckOnAuctionBalance > 0;
        _result.artefacts = {};
        if (duckHouseOwner) {
            _result.duckHouseType = 'ART-HOUSE';
            duckOwner = duckHouseOwner;
        } else if (megaDuckHouseOwner) {
            _result.duckHouseType = 'ART-BIGHOUSE';
            duckOwner = megaDuckHouseOwner;
        } else if (xmasStbleOwner) {
            _result.duckHouseType = 'ART-XMAS_STBLE';
            duckOwner = xmasStbleOwner;
        }
        if (duckOnXmasStable) {
            _result.onXmasStable = true;
        }
        if (warsDAppResponse) {
            duckOwner = warsDAppResponse.owner;
            _result.artefacts.mantle = {
                id: warsDAppResponse.assetId,
                level: warsDAppResponse.level ?? 0,
            };
            _result.world = Worlds.Wars;
        } else if (duckHuntDAppResponse) {
            _result.world = Worlds.Hunt;
            duckOwner = duckHuntDAppResponse.owner;
            _result.gameUnlockTime = duckHuntDAppResponse.unlockTime;
        } else if (veggFarmingOwner) {
            const { owner, toClaim, perchColor, farmingParams } = await this.veggFarmingService.fetchFarmingVeggDetails(
                nftId,
                veggFarmingOwner.value,
            );
            duckOwner = duckOwner ? duckOwner : owner;
            _result.onFarmingVegg = true;
            _result.onFarming = false;
            _result.perchColor = isJackpot(_result) ? perchColor : undefined;
            _result.farmingParams = farmingParams;
            _result.toClaim = toClaim;
        } else if (farmingOwner) {
            const { owner, toClaim, perchColor, farmingParams } = await this.farmingService.fetchFarmingDetails(
                nftId,
                farmingOwner,
            );
            duckOwner = duckOwner ? duckOwner : owner;
            _result.onFarmingVegg = false;
            _result.onFarming = true;
            _result.perchColor = isJackpot(_result) ? perchColor : undefined;
            _result.farmingParams = farmingParams;
            _result.toClaim = toClaim;
        } else {
            _result.onFarming = false;
        }
        if (rentalDuck?.owner) {
            duckOwner = rentalDuck.owner;
        }

        if (_result.onSale) {
            const auctionDetails = await this.auctionService.fetchLastAuctionDetails(nftId);

            _result = {
                ..._result,
                ...auctionDetails,
            };
        } else {
            _result.owner = duckOwner || (await this.helperService.getNftOwner(nftId));
        }
        const [fullData] = await this.productionService.addRarity([_result]);
        if (!_result.onFarming) {
            const globalData = await this.farmingService.fetchGlobalData();
            const fp = await this.farmingService.fetchFarmingPower(
                nftId,
                _result.name,
                undefined,
                undefined,
                _result.owner,
                _result.oldRarity,
                globalData.globalStaked,
                globalData.globalLastCheck,
                undefined,
            );
            const result = ((fp.estimatedBasePower as number) / 100) * fullData.rarity;
            fullData.farmingParams = {
                ..._result.farmingParams,
                farmingPower: result,
                stakedBefore: fp.stakedBefore,
                globalFarmingPower: fp.global,
            };
        }

        return fullData;
    };

    getAnimalImageByAssetId = (
        assetId: duckId | null | undefined,
        params: { filter?: 'grayscale'; cacheTs?: number } = {},
    ) => {
        if (assetId) {
            return urlString(
                `${this.IMAGES_SERVICE_URL}/api${params.cacheTs ? '/uncached' : ''}/ducks/${assetId}.svg`,
                { filter: params.filter },
                params.cacheTs ? `t=${params.cacheTs}` : '',
            );
        }

        return `${this.APP_URL}/img/metaverse/ducklization_img.png`;
    };

    /**
     * @description Returns a link to a duck image by genotype
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
        const nameDuck = `DUCK-${genotype}`;
        return urlString(`${this.IMAGES_SERVICE_URL}/api/images/${getUrlToSVGWithTimeStamp(nameDuck)}`, {
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

    getDuckGeneration = (name: string) => {
        const [, , [generation]] = split(name, '-');

        return generation;
    };

    isLastGeneration = (name: string) =>
        this.getDuckGeneration(name) === Object.keys(DUCK_GENERATION_NAMES).sort().reverse()[0];

    getDuckName = async (duckId: duckId) => {
        const duck = await this.assetsService.fetchAssetDetails(duckId);

        return this.getDuckNameFromGene(duck.name);
    };

    getDuckNameFromGene = (geneString: string) => {
        const gene = geneString.startsWith('DUCK-') ? split(geneString, '-')[1] : geneString;

        if (gene in Ducks) {
            return Ducks[gene].name;
        }

        const name = gene
            .split('')
            .map((gene, index) => Ducks[gene]?.[index])
            .join('')
            .toLowerCase();

        return capitalize(name);
    };

    getDuckParametersFromGenotype = (
        name: string,
        { assetId, cacheTs }: { assetId?: string; cacheTs?: number } = {},
    ): IDuckParamsFromGenotype => {
        const [, genoType, generationColor] = name.split('-');
        const generation = generationColor[0];
        const color = generationColor[1];
        const {
            name: generationName,
            number: generationNumber,
            color: bgColor,
        } = DUCK_GENERATION_NAMES.hasOwnProperty(generation)
            ? DUCK_GENERATION_NAMES[generation]
            : { name: generation, number: 'N/A', color: 'bg-inverse' };

        const duckDetails = {
            image: assetId
                ? this.getAnimalImageByAssetId(assetId, { cacheTs })
                : this.getImageByGenotype(`${genoType}-${generationColor}`),
            name: this.getDuckNameFromGene(genoType),
        };
        const fullColor = DUCK_COLORS[color];
        const fullColorName = DuckColorNames[color];

        return {
            genoType,
            generation,
            color,
            duckDetails,
            fullColor,
            generationName,
            bgColor,
            fullColorName,
            generationNumber: generationNumber ? generationNumber.toString() : '',
        };
    };

    getDucksHuntParams = async (ducks: IDuckDetails[]): Promise<IDuckDetails[]> => {
        const baseUrl = await this.API_URL;
        const url = `/hunt/v1/ducks/stats`;
        const { data } = await this.helperService.http.post(`${baseUrl}${url}`, {
            ducks: ducks.map((duck) => ({
                assetId: duck.assetId,
                name: duck.name,
                canBreed: duck.canBreed,
                issueTimestamp: duck.issueTimestamp,
                huntPower: duck.rarity,
                owner: duck.owner,
            })),
        });
        return data;
    };

    getDuckImage = (name: string): string =>
        `${this.helperService.API_URL}/v1/images/${getUrlToSVGWithTimeStamp(name)}`;
}

export default CommonDucksService;
