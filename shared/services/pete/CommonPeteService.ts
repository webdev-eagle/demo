import { headersJson } from '$shared/constants';
import { getAddress } from '$shared/domain/constants';
import { isAddress } from '$shared/domain/guards';
import CacheMap from '$shared/structures/CacheMap';
import { AssetDetails, AuctionDetails } from '$shared/types';
import { Auction } from '$shared/types/cache-api';
import { IPete } from '$shared/types/cache-api/pete';
import { urlString } from '$shared/utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import CommonAssetsService from '../assets/CommonAssetsService';
import CommonAuctionService from '../auction/CommonAuctionService';
import CommonHelperService from '../helper/CommonHelperService';
import { PeteClaimStakedNft, PeteStaked, PeteStakedNft } from './data-types';

const PETE_DAPP_ADDRESS = getAddress('PETE_DAPP_ADDRESS');

abstract class CommonPeteService extends AbstractDataFetcher {
    abstract helperService: CommonHelperService;
    abstract IMAGES_SERVICE_URL: string;
    abstract API_URL: string;
    abstract assetsService: CommonAssetsService;
    abstract auctionService: CommonAuctionService;
    private peteCache = new CacheMap<addressId, Promise<any[]>>({ ttl: 10_000 });

    DAPP_ADDRESS = PETE_DAPP_ADDRESS;
    isPete = (issuer: string) => issuer === PETE_DAPP_ADDRESS;

    getAllPete = async (address: addressId): Promise<any> => {
        const allPete: any[] = [];
        const allItems = await this.helperService.getNftsOnAddress(address);
        const peteOnSale = await this.fetchLockedPeteForUsers(address);
        const petesFarm = await this.getUserPeteStakedNft(address);
        allPete.push(...allItems);
        allPete.push(...peteOnSale);
        allPete.push(...petesFarm);
        const petes = allPete.filter((item) => this.isPete(item.issuer));
        if (petes.length === 0) {
            return [];
        }
        return petes;
    };

    fetchLockedPeteForUsers = async (address: string): Promise<any> => {
        const [nftsOnSale, nftsOnFarm] = await Promise.all([
            await this.auctionService.fetchLockedNftForUser(address),
            await this.getUserPeteStakedNft(address),
        ]);
        const onSaleIds = nftsOnSale.map((kv) => kv.value).filter(Boolean);
        const onStakedNfts = nftsOnFarm.filter((nft) => nft.value).map((nft) => nft.key.split('_')[1] as string);
        const [onSaleNfts, onFarmNfts] = await Promise.all([
            this.assetsService.fetchAssetsDetails(onSaleIds),
            this.assetsService.fetchAssetsDetails(onStakedNfts),
        ]);
        return [
            ...onSaleNfts.map((item) =>
                this.formatPeteData({ assetDetails: item, owner: address, onSale: true, type: 'ART-PETE' }),
            ),
            ...onFarmNfts.map((item) =>
                this.formatPeteData({
                    assetDetails: item,
                    owner: address,
                    isStaked: true,
                    onSale: false,
                    type: 'ART-PETE',
                }),
            ),
        ];
    };

    fetchPeteDetailsForAddress = async (address: string): Promise<IPete[]> => {
        if (!isAddress(address)) {
            return [];
        }

        return this.peteCache.getOr(address, async () => {
            const allNfts = await this.helperService.getNftsOnAddress(address);

            return allNfts.filter((item) => this.isPete(item.issuer));
        });
    };

    getItem = async (assetId): Promise<any> => {
        try {
            const { data } = await this.helperService.http.get<any>(
                urlString(`${this.API_URL}/v2/items/${assetId}`),
                headersJson,
            );

            if (data) {
                return data['entity'];
            }

            return [];
        } catch (error) {
            console.error('Error fetching item:', error);
            throw error;
        }
    };

    getPeteTags = (nft: IPete | undefined | null): string[] => {
        const tags: string[] = [];

        if (!nft) {
            return tags;
        }
        const { isStaked, owner, onSale } = nft;

        if (isStaked) {
            tags.push('is_active');
        }

        if (onSale) {
            tags.push('on_sale');
        }

        return tags.concat(['external']);
    };

    getPeteDetails = async (nftId: string): Promise<any> => {
        const [assetDetails, onSale, itemDetails, onFarm] = await Promise.all([
            this.assetsService.fetchAssetDetails<AssetDetails>(nftId),
            this.auctionService.isOnSale(nftId),
            this.getItem(nftId),
            this.getPeteStakedNft(nftId),
        ]);

        let auctionDetails: AuctionDetails | null | undefined;
        let owner: addressId | undefined;
        let createdAt = '';
        let auction: Auction | undefined;
        if (itemDetails) {
            owner = itemDetails.owner;
            auctionDetails = itemDetails.auctionDetails;
            createdAt = itemDetails.createdAt;
            if ('auction' in itemDetails) {
                auction = itemDetails.auction;
            }
        }
        if (onSale) {
            auctionDetails = await this.auctionService.fetchLastAuctionDetails(nftId);
            if (onSale) {
                auctionDetails = await this.auctionService.fetchLastAuctionDetails(nftId);
            }
            const originalName = assetDetails.name;
            const manipulateAssetDetails = { ...assetDetails, name: 'ART-PETE' };
            const peteDataFormated = this.formatPeteData({
                assetDetails: manipulateAssetDetails,
                owner: owner ?? (await this.helperService.getNftOwner(nftId)),
                auctionDetails,
                type: 'ART-PETE',
                onSale,
                title: originalName,
            });
            return { ...peteDataFormated, auction };
        }

        if (onFarm && onFarm.value) {
            return this.formatPeteData({
                assetDetails: assetDetails,
                owner: onFarm.key.split('_')[0],
                auctionDetails,
                type: 'ART-PETE',
                isStaked: true,
                title: assetDetails.name,
            });
        }

        const peteDataFormated = this.formatPeteData({
            assetDetails,
            owner: owner ?? (await this.helperService.getNftOwner(nftId)),
            auctionDetails,
            type: 'ART-PETE',
            onSale,
            isStaked: false,
        });

        return { ...peteDataFormated, auction };
    };

    getPeteAssetInfo = async (nftId: string): Promise<any> => {
        return this.assetsService.fetchAssetDetails<AssetDetails>(nftId);
    };

    getPeteImage = () => {
        const imgPete = `${this.IMAGES_SERVICE_URL}/api/images/DUCK-GGGGGGGG.svg`;
        return imgPete;
    };

    formatPeteData = ({
        assetDetails,
        auctionDetails = {},
        owner,
        type,
        onSale = false,
        isStaked = false,
    }: {
        assetDetails: AssetDetails;
        owner: string;
        type: string;
        onSale?: boolean;
        isStaked?: boolean;
        auctionDetails?: Partial<AuctionDetails> | null;
        title?: string;
    }): IPete => {
        return {
            ...assetDetails,
            name: assetDetails.name,
            onSale,
            owner,
            type,
            isStaked,
            ...auctionDetails,
        };
    };

    getPeteStakedToken = async (addressUser: string) => {
        const token = `${addressUser}_userTokenStaked`;
        const result = await this.fetchDataMatch<PeteStaked>(token);
        return result.length > 0 ? result[0].value : 0;
    };

    getPeteClaimAvaliable = async (addressUser: string): Promise<integer> => {
        const response = await this.helperService.http.post(
            `${this.helperService.NODE_URL}/utils/script/evaluate/${PETE_DAPP_ADDRESS}`,
            {
                expr: `getStatsByUserREADONLY("${addressUser}")`,
            },
            headersJson,
        );
        // eslint-disable-next-line no-underscore-dangle
        return response.data.result.value._2.value.split('__')[3];
    };

    getPeteStakedNft = async (nftId: string) => {
        const stakedNfts = await this.getPeteStakedNfts();
        const nft = stakedNfts.find((stakedNft) => stakedNft.key.split('_')[1] === nftId);
        return nft;
    };

    getPeteStakedNfts = async () => {
        const token = `.*_.*_userNFTStakedId`;
        const result = await this.fetchDataMatch<PeteStakedNft>(token);
        return result.length > 0 ? result : [];
    };

    getUserPeteStakedNft = async (addressUser: string) => {
        const token = `${addressUser}_.*_userNFTStakedId`;
        const result = await this.fetchDataMatch<PeteStakedNft>(token);
        return result.length > 0 ? result : [];
    };

    getNFTAvailableClaimPete = async (addressUser: string) => {
        const token = `${addressUser}_NFTUserAvailableClaim`;
        const result = await this.fetchDataMatch<PeteClaimStakedNft>(token);
        return result.length > 0 ? result[0].value : 0;
    };
}

export default CommonPeteService;
