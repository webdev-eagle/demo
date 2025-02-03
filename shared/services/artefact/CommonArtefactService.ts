import { ItemMap, ItemName } from '$shared/types/stakingItems';
import { BOXES_COUNT, SHAKEABLE_ITEMS_GROUP, WEARABLE_ITEM_GROUP } from '../../constants';
import { getAddress } from '../../domain/constants';
import { getDataKeyPart, getKeyPart } from '../../domain/contract-data';
import { isAddress } from '../../domain/guards';
import CacheMap from '../../structures/CacheMap';
import type { ArtefactDetails, ArtefactType, AssetDetails, AuctionDetails, IArtefact, ILootBox } from '../../types';
import { dedupe, getUrlToSVGWithTimeStamp, split } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type CommonAccountBoosterService from '../account-boosters';
import type CommonAssetsService from '../assets';
import type CommonAuctionService from '../auction';
import type CommonDuckHouseService from '../duck-house';
import type CommonHelperService from '../helper';
import type CommonWearablesService from '../wearables';
import {
    BREEDING_ITEMS,
    CONTAINABLE_ITEMS,
    MUTARIUM_ITEMS,
    STAKEABLE_ITEMS,
    USABLE_ON_ACCOUNT_ITEMS,
    USABLE_ON_ARTEFACT_ITEMS,
    USABLE_ON_DUCK_ITEMS,
} from './constants';
import type {
    ArtefactAmount,
    ArtefactId,
    ArtefactOwner,
    CosmeticItemData,
    DuckBoost,
    FinishHeight,
    LootboxStatus,
    UserBoost,
} from './data-types';

const LOOT_BOXES_DAPP_ADDRESS = getAddress('LOOT_BOXES_DAPP');

abstract class CommonArtefactService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = LOOT_BOXES_DAPP_ADDRESS;
    abstract helperService: CommonHelperService;
    abstract auctionService: CommonAuctionService;
    abstract assetsService: CommonAssetsService;
    abstract accountBoosterService: CommonAccountBoosterService;
    abstract duckHouseService: CommonDuckHouseService;
    abstract megaDuckHouseService: CommonDuckHouseService;
    abstract xmasStbleService: CommonDuckHouseService;
    abstract wearablesService: CommonWearablesService;
    abstract IMAGES_SERVICE_URL: string;

    abstract APP_URL: string;

    private artefactsCache = new CacheMap<addressId, Promise<ArtefactDetails[]>>({ ttl: 10_000 });

    isArtefact = (asset: AssetDetails): asset is ArtefactDetails =>
        asset.issuer === this.DAPP_ADDRESS && asset.name.indexOf('ART') !== -1;

    isStakeable = (val: ArtefactType | { name: ArtefactType }) => {
        return STAKEABLE_ITEMS.includes(typeof val === 'string' ? val : val.name);
    };

    isWearable = (type: ArtefactType) => {
        return Object.keys(WEARABLE_ITEM_GROUP).includes(type);
    };

    isUsableOnDuck = (type: ArtefactType) => {
        return USABLE_ON_DUCK_ITEMS.includes(type);
    };

    isUsableOnAccount = (type: ArtefactType) => {
        return USABLE_ON_ACCOUNT_ITEMS.includes(type);
    };
    isUsableOnArtefact = (type: ArtefactType) => {
        return USABLE_ON_ARTEFACT_ITEMS.includes(type);
    };
    isBreeding = (type: ArtefactType) => {
        return BREEDING_ITEMS.includes(type);
    };

    isContainable = (type: ArtefactType) => {
        return CONTAINABLE_ITEMS.includes(type);
    };

    isMutarium = (type: ArtefactType) => {
        return MUTARIUM_ITEMS.includes(type);
    };

    isDuckHouse = (type: ArtefactType) => {
        return type === 'ART-HOUSE';
    };

    isMegaDuckHouse = (type: ArtefactType) => {
        return type === 'ART-BIGHOUSE';
    };

    isXmasStble = (type: ArtefactType) => {
        return type === 'ART-XMAS_STBLE';
    };

    isSplitMirror = (type: ArtefactType) => {
        return type === 'ART-MIRROR';
    };

    isXmasScarf = (type: ArtefactType) => {
        return type === 'ART-XSCARF';
    };

    isShakeable = (type: ArtefactType) => {
        return Object.keys(SHAKEABLE_ITEMS_GROUP).includes(type);
    };

    isInCooldown = ({ cooldown = 0 }: { cooldown?: minute }) => {
        return cooldown > 0;
    };

    fetchArtefactDetails = (nftIds: assetId[]): Promise<ArtefactDetails[]> => {
        return this.assetsService.fetchAssetsDetails<ArtefactDetails>(nftIds);
    };

    fetchUserBoost = (userAddress: addressId) => {
        return this.fetchDataByKey<UserBoost>(`${userAddress}_user_external_boost`);
    };

    fetchDuckBoost = (duckId: duckId) => {
        return this.fetchDataByKey<DuckBoost>(`${duckId}_duck_external_boost`);
    };

    fetchUserDuckBoost = async (userAddress: addressId, duckId: duckId) => {
        const [userBoost, duckBoost] = await Promise.all([
            this.fetchUserBoost(userAddress),
            this.fetchDuckBoost(duckId),
        ]);

        return (duckBoost?.value ?? 0) + (userBoost?.value ?? 0);
    };

    fetchAllFarmingBoosts = async () => {
        const [usersBoosts, ducksBoosts] = await Promise.all([
            this.fetchDataMatch<UserBoost>(`.*?_user_external_boost`),
            this.fetchDataMatch<DuckBoost>(`.*?_duck_external_boost`),
        ]);

        const ducksFarmingBoostsMap = ducksBoosts.reduce(
            (map, { key, value }) => map.set(getKeyPart(key, 0), value),
            new Map<duckId, integer>(),
        );

        const usersFarmingBoostsMap = usersBoosts.reduce(
            (map, { key, value }) => map.set(getKeyPart(key, 0), value),
            new Map<addressId, integer>(),
        );

        return {
            ducksFarmingBoostsMap,
            usersFarmingBoostsMap,
        };
    };

    getArtefactTypeFromBox = async (
        address: addressId,
        boxId: lootBoxId,
    ): Promise<`ART-${string}` | 'started' | undefined> => {
        const boxResult = await this.fetchDataByKey<LootboxStatus>(`${address}_${boxId}_status`);

        return boxResult?.value;
    };

    getLootBoxesRemaining = async (): Promise<number> => {
        const issuedBoxesAmount = await this.fetchDataByKey<ArtefactAmount>('global_artAmount');

        return BOXES_COUNT - (issuedBoxesAmount?.value ?? 0);
    };

    getLootBoxes = async (address: string): Promise<ILootBox[]> => {
        const allBoxes = await this.fetchDataMatch<LootboxStatus | ArtefactId | FinishHeight>(`${address}_.*?`);
        const results = {};

        allBoxes.forEach((kv) => {
            const [, boxId, lastKey] = split(kv.key, '_');
            if (!results.hasOwnProperty(boxId)) {
                results[boxId] = { boxId, isBox: true };
            }
            results[boxId][lastKey] = kv.value;
        });

        return Object.values(results);
    };

    getClosedLootBoxes = async (address: addressId): Promise<ILootBox[]> => {
        const lootBoxes = await this.getLootBoxes(address);

        return lootBoxes.filter((box) => box.status === 'started');
    };

    fetchArtefactDetailsForAddress = async (address: string): Promise<ArtefactDetails[]> => {
        if (!isAddress(address)) {
            return [];
        }

        return this.artefactsCache.getOr(address, async () => {
            const allNfts = await this.helperService.getNftsOnAddress(address);

            return allNfts.filter(this.isArtefact);
        });
    };

    fetchLockedArtefactsForUsers = async (address: addressId): Promise<IArtefact[]> => {
        const [
            nftsOnSale,
            stakedOnItems,
            stakedOnAccountBoosters,
            stakedOnDuckHouse,
            stakedOnMegaDuckHouse,
            stakedOnXmasStble,
        ] = await Promise.all([
            this.auctionService.fetchLockedNftForUser(address),
            this.fetchDataMatch<ArtefactOwner>(`.*?_${address}_owner`),
            this.accountBoosterService.fetchStakedForUser(address),
            this.duckHouseService.fetchStakedForUser(address),
            this.megaDuckHouseService.fetchStakedForUser(address),
            this.xmasStbleService.fetchStakedForUser(address),
        ]);

        const onSaleIds = nftsOnSale.map((kv) => kv.value).filter(Boolean);
        const stakedIds = dedupe([
            ...stakedOnItems.map((kv) => kv.value),
            ...stakedOnAccountBoosters.map((kv) => kv.value),
            ...stakedOnDuckHouse.map(getDataKeyPart(0)),
            ...stakedOnMegaDuckHouse.map(getDataKeyPart(0)),
            ...stakedOnXmasStble.map(getDataKeyPart(0)),
        ]).filter(Boolean);

        const [onSaleNfts, stakedArtefacts] = await Promise.all([
            this.assetsService.fetchAssetsDetails(onSaleIds),
            this.fetchArtefactDetails(stakedIds),
        ]);

        return [
            ...onSaleNfts
                .filter(this.isArtefact)
                .map((item) => this.formatArtefactData({ assetDetails: item, owner: address, onSale: true })),
            ...stakedArtefacts.map((item) =>
                this.formatArtefactData({ assetDetails: item, owner: address, isStaked: true }),
            ),
        ];
    };

    fetchAllArtefactsForUser = async (address: addressId): Promise<IArtefact[]> => {
        const [artefacts, lockedArtefacts] = await Promise.all([
            this.fetchArtefactDetailsForAddress(address),
            this.fetchLockedArtefactsForUsers(address),
        ]);
        const cooldowns = await this.accountBoosterService.getCooldowns(artefacts.filter(this.isStakeable));

        return [
            ...artefacts.map((item) =>
                this.formatArtefactData({
                    assetDetails: item,
                    owner: address,
                    cooldown: cooldowns[item.assetId]?.estimatedCooldownTime,
                }),
            ),
            ...lockedArtefacts,
        ];
    };

    getArtefactDetails = async (nftId: string): Promise<IArtefact> => {
        const [assetDetails, onSale] = await Promise.all([
            this.assetsService.fetchAssetDetails<ArtefactDetails>(nftId),
            this.auctionService.isOnSale(nftId),
        ]);
        let auctionDetails: AuctionDetails | null | undefined;
        let owner: addressId | undefined;
        let cooldown: minute | undefined;
        let isStaked = false;

        if (onSale) {
            auctionDetails = await this.auctionService.fetchLastAuctionDetails(nftId);
            owner = auctionDetails?.owner;
        }

        if (this.isStakeable(assetDetails.name)) {
            const [itemOwner, { estimatedCooldownTime }] = await Promise.all([
                this.accountBoosterService.stakedItemOwner(nftId, assetDetails.name),
                this.accountBoosterService.getCooldown(nftId, assetDetails.name),
            ]);
            owner = itemOwner;
            cooldown = estimatedCooldownTime;
            isStaked = Boolean(itemOwner);
        } else if (this.isDuckHouse(assetDetails.name)) {
            const itemOwner = await this.duckHouseService.stakedItemOwner(nftId);

            owner = itemOwner;
            isStaked = Boolean(itemOwner);
        } else if (this.isMegaDuckHouse(assetDetails.name)) {
            const itemOwner = await this.megaDuckHouseService.stakedItemOwner(nftId);

            owner = itemOwner;
            isStaked = Boolean(itemOwner);
        } else if (this.isXmasStble(assetDetails.name)) {
            const itemOwner = await this.xmasStbleService.stakedItemOwner(nftId);
            owner = itemOwner;
            isStaked = Boolean(itemOwner);
        }

        return this.formatArtefactData({
            assetDetails,
            owner: owner ?? (await this.helperService.getNftOwner(nftId)),
            auctionDetails,
            onSale,
            isStaked,
            cooldown,
        });
    };

    formatArtefactData = ({
        assetDetails,
        auctionDetails = {},
        owner,
        onSale = false,
        isStaked = false,
        cooldown = 0,
    }: {
        assetDetails: ArtefactDetails;
        owner: string;
        onSale?: boolean;
        isStaked?: boolean;
        auctionDetails?: Partial<AuctionDetails> | null;
        cooldown?: minute;
    }): IArtefact => {
        const lowerCaseName = assetDetails.name.replace('-', '_').toLowerCase();

        return {
            ...assetDetails,
            id: assetDetails.assetId,
            type: assetDetails.name,
            title: `artefacts.types.${lowerCaseName}.title`,
            description: `artefacts.types.${lowerCaseName}.description`,
            onSale,
            isStaked,
            cooldown,
            owner,
            ...auctionDetails,
            isArtefact: true,
        };
    };

    getArtefactImageUrl = (type: string): string => `${this.APP_URL}/ducks/artefacts/${getUrlToSVGWithTimeStamp(type)}`;

    getItemImage = (name: string): string => `${this.helperService.API_URL}/v1/images/${name}.svg`;

    getItemImageByAssetId = (assetId: string): string => `${this.IMAGES_SERVICE_URL}/api/items/${assetId}.svg`;

    getStakingItemImage = <T extends keyof ItemMap>(item: T, name: ItemName<T>): string =>
        `${this.helperService.API_URL}/v1/${item}/${getUrlToSVGWithTimeStamp(name)}`;

    getItemTitle = (name: string): string => `artefacts.types.${name.replace('-', '_').toLowerCase()}.title`;

    getItemDescription = (name: string): string =>
        `artefacts.types.${name.replace('-', '_').toLowerCase()}.description`;

    fetchDirectMarketItems = async (): Promise<CosmeticItemData[]> => {
        return this.fetchDataMatch<CosmeticItemData>('direct_cosmetic_.*?');
    };
}

export default CommonArtefactService;
