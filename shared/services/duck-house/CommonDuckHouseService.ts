import { getAddress } from '$shared/domain/constants';
import { getDataKeyPart } from '../../domain/contract-data';
import type CommonAssetsService from '../../services/assets';
import type CommonProductionService from '../../services/production';
import type { ArtefactType, AssetDetails } from '../../types';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { ArtefactOwner, StakedDuck } from './data-types';

const MAX_DUCKS = {
    'ART-HOUSE': 4,
    'ART-BIGHOUSE': 10,
    'ART-XMAS_STBLE': 6,
};
const LEGACY_DUCK_HOUSE_DAPP = getAddress('LEGACY_DUCK_HOUSE_DAPP');
const LEGACY_MEGA_DUCK_HOUSE_DAPP = getAddress('LEGACY_MEGA_DUCK_HOUSE_DAPP');

abstract class CommonDuckHouseService extends AbstractDataFetcher {
    protected DAPP_ADDRESS;
    protected abstract assetsService: CommonAssetsService;
    protected abstract productionService: CommonProductionService;
    protected type: ArtefactType;

    constructor(dappAddress: addressId, type: ArtefactType) {
        super();
        this.DAPP_ADDRESS = dappAddress;
        this.type = type;
    }

    getMaxAmount = () => MAX_DUCKS[this.type];

    fetchDucksHouse = async (duckId: duckId) => {
        const contract = await this.fetchDataByKey<StakedDuck>(`${duckId}_duck_house`);

        return contract?.value;
    };

    fetchStakedForUser = async (userAddress: addressId): Promise<ArtefactOwner[]> => {
        const data = await this.fetchDataMatch<ArtefactOwner>('.*?_owner');

        return data.filter(({ value }) => userAddress === value);
    };

    stakedItemOwner = async (assetId: assetId): Promise<addressId | undefined> => {
        const data = await this.fetchDataByKey<ArtefactOwner>(`${assetId}_owner`);

        return data?.value;
    };

    fetchStakedDucks = async (assetId: assetId): Promise<AssetDetails[]> => {
        const stakedDucks = await this.fetchDataMatch<StakedDuck>('.*?_duck_house');
        const ducks = await this.assetsService.fetchAssetsDetails(
            stakedDucks.filter(({ value }) => value === assetId).map(getDataKeyPart(0)),
        );

        return this.productionService.addRarity(ducks);
    };

    getUserDuckOwner = async (assetId: string) => {
        //TODO: THIS SHIT NEEDS TO GO, BUT TO PREVENT 3 UNNEEDED CALLS FOR EVERY NFT WE ADD IT FOR NOW.
        const itemHouseStaked = await this.fetchDucksHouse(assetId);
        if (!itemHouseStaked) {
            return undefined;
        }
        const itemOwner = await this.stakedItemOwner(itemHouseStaked || '');
        return itemOwner;
    };

    fetchUserAllDucksFromXmasStable = async (address) => {
        let ducksInStables: AssetDetails[] = [];
        const AllXmasStable = await this.fetchStakedForUser(address);
        await Promise.all(
            AllXmasStable.map(async (stble) => {
                const ducksInStable = await this.fetchStakedDucks(stble.key.split('_')[0]);
                ducksInStables.push(...ducksInStable);
            }),
        );
        return ducksInStables;
    };
}

export default CommonDuckHouseService;
