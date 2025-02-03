import { getAddress } from '../../domain/constants';
import { collectContractDataToObject, getDataKeyPart, getKeyPart } from '../../domain/contract-data';
import CacheMap from '../../structures/CacheMap';
import type {
    AuctionDetails,
    BidStatusType,
    IAssetAuctionBidDataValue,
    IAuctionBidForAsset,
    IAuctionBidWithAssetId,
    WithAuctionDetails,
    WithBids,
} from '../../types';
import { dedupe, parseJSON, split, toInt, toRecord } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { AssetBidData, AssetIdByBid, BidStatus, Details, EggSell, LockedNft, NftLastAuction } from './data-types';

const AUCTION_DAPP_ADDRESS = getAddress('AUCTION_DAPP');

abstract class CommonAuctionService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = AUCTION_DAPP_ADDRESS;

    private lockedNftsCache = new CacheMap<addressId, Promise<LockedNft[]>>({ ttl: 10_000 });
    private auctionDetailsCache = new CacheMap<auctionId, Promise<AuctionDetails>>();

    private getBidParamsByAuctionId = (auctionDetails: Details[]): Record<auctionId, AuctionDetails & WithBids> => {
        const byAuctionId: Record<auctionId, AuctionDetails & WithBids> = auctionDetails.reduce(
            (res, { key, value }) => {
                const [, auctionId, param, bidId, bidParam] = split(key, '_');

                if (!(auctionId in res)) {
                    res[auctionId] = { auctionId, highestBid: 0 };
                    res[auctionId].bids = {};
                }

                if (param !== 'bid' || !bidId) {
                    res[auctionId][param] = value;

                    return res;
                }

                if (!(bidId in res[auctionId].bids)) {
                    res[auctionId].bids[bidId] = { bidId };
                }
                res[auctionId].bids[bidId][bidParam] = value;

                return res;
            },
            {},
        );

        Object.values(byAuctionId).forEach((auction) => {
            auction.highestBid =
                Object.values(auction.bids).reduce((highestBid, { status, amount }) => {
                    if (status !== 'open') {
                        return highestBid;
                    }
                    return amount > highestBid ? amount : highestBid;
                }, auction.highestBid) ?? 0;
        });

        return byAuctionId;
    };

    isOnSale = async (nftId: assetId) => {
        const balance = await this.fetchAssetBalance(nftId);

        return balance !== 0;
    };

    fetchAuctionDetails = (auctionId: auctionId): Promise<AuctionDetails> => {
        return this.auctionDetailsCache.getOr(auctionId, async () => {
            const auctionParams = await this.fetchDataMatch<Details>(`auction_${auctionId}_.*?`);

            const objectByKeys = collectContractDataToObject(auctionParams);

            return {
                auctionId,
                auctionDescription: objectByKeys[`auction_${auctionId}_description`],
                instantPrice: objectByKeys[`auction_${auctionId}_instantPrice`],
                owner: objectByKeys[`auction_${auctionId}_owner`],
                startPrice: objectByKeys[`auction_${auctionId}_startPrice`],
                startedAt: objectByKeys[`auction_${auctionId}_startedAt`],
                eggSell: objectByKeys[`auction_${auctionId}_eggSell`],
                status: objectByKeys[`auction_${auctionId}_status`],
            };
        });
    };

    fetchLastAuctionDetails = async (nftId: assetId): Promise<AuctionDetails> => {
        let auctionDetails = {} as AuctionDetails;

        try {
            const lastAuction = await this.fetchDataByKey<NftLastAuction>(`auction_${nftId}_last`);

            if (!lastAuction) {
                return auctionDetails;
            }

            const { value: auctionId } = lastAuction;

            if (auctionId) {
                return this.fetchAuctionDetails(auctionId);
            }
        } catch (e) {
            console.error(e);
        }

        return auctionDetails;
    };

    fetchAddressesBidParamsById = async (address: addressId): Promise<Record<bidId, IAuctionBidWithAssetId>> => {
        const data = await this.fetchDataMatch<AssetIdByBid>(`address_${address}_auction_.*?_bid_.*?`);

        return toRecord(data, getDataKeyPart(5), ({ key, value: assetId }) => {
            const [, , , auctionId, , bidId] = split(key, '_');

            return { address, auctionId, bidId, assetId };
        });
    };

    fetchBidsStatuses = async (
        bids: Array<{ bidId: bidId; auctionId: auctionId }>,
    ): Promise<Record<bidId, BidStatusType>> => {
        const statuses = await this.fetchDataByKeys<BidStatus>(
            bids.map(({ bidId, auctionId }) => `auction_${auctionId}_bid_${bidId}_status`),
        );

        return toRecord(statuses, getDataKeyPart(3), ({ value }) => value);
    };

    fetchAuctionsEggSell = async (auctionIds: auctionId[]): Promise<Record<auctionId, boolean>> => {
        if (auctionIds.length === 0) {
            return {};
        }

        const eggSellData = await this.fetchDataByKeys<EggSell>(
            auctionIds.map((auctionId) => `auction_${auctionId}_eggSell`),
        );

        return toRecord(eggSellData, getDataKeyPart(1), ({ value }) => value);
    };

    fetchBidsForAsset = async (assetId: assetId): Promise<IAuctionBidForAsset[]> => {
        const bids = await this.fetchDataMatch<AssetBidData>(`assetId_${assetId}_bid_.*?`);

        const resultBids: Array<IAssetAuctionBidDataValue & { bidId: bidId }> = [];
        const auctionsList: auctionId[] = [];

        bids.forEach((bid) => {
            const bidId = getKeyPart(bid.key, 3);
            const bidData = parseJSON(bid.value);
            resultBids.push({
                ...bidData,
                bidId,
            });
            if (auctionsList.indexOf(bidData.auctionId) === -1) {
                auctionsList.push(bidData.auctionId);
            }
        });

        const eggSellObject = await this.fetchAuctionsEggSell(auctionsList);

        return resultBids.map((bidData) => ({
            ...bidData,
            amount: toInt(bidData.amount),
            eggSell: bidData.auctionId in eggSellObject ? eggSellObject[bidData.auctionId] : false,
        }));
    };

    fetchLockedNftForUser = (address: addressId): Promise<LockedNft[]> =>
        this.lockedNftsCache.getOr(
            address,
            async () => await this.fetchDataMatch<LockedNft>(`address_${address}_auction_.*?_lockedNFT`),
        );

    fetchMarketplaceNftDetails = async <T extends { assetId: nftId }>(
        nfts: T[],
        options?: { avoidCache?: boolean },
    ): Promise<Array<T & WithAuctionDetails>> => {
        if (nfts.length === 0) {
            return [];
        }

        const lastAuctions = await this.fetchDataByKeys<NftLastAuction>(
            nfts.map(({ assetId }) => `auction_${assetId}_last`),
            options,
        );

        const auctionIdByNftId: Record<duckId, auctionId> = {};
        const auctionIds: auctionId[] = [];

        lastAuctions.forEach(({ key, value: auctionId }) => {
            const nftId = getKeyPart(key, 1);

            auctionIds.push(auctionId);
            auctionIdByNftId[nftId] = auctionId;
        });

        const auctionDetails = await this.fetchDataMatch<Details>(`^auction_(${auctionIds.join('|')})_.*?`, options);

        const bidParamsByAuctionId = this.getBidParamsByAuctionId(auctionDetails);

        return nfts.map((nft) => {
            const { assetId } = nft;
            const auctionId = auctionIdByNftId[assetId];

            return {
                ...nft,
                auctionId,
                auction: bidParamsByAuctionId[auctionId],
            };
        });
    };

    fetchActiveBidAssetsOnAddress = async (address: addressId): Promise<assetId[]> => {
        const bidsById = await this.fetchAddressesBidParamsById(address);
        const statusesById = await this.fetchBidsStatuses(Object.values(bidsById));

        if (Object.keys(statusesById).length === 0) {
            return [];
        }

        return dedupe(
            Object.values(bidsById)
                .filter(({ bidId }) => statusesById[bidId] === 'open')
                .map((bid) => bid.assetId),
        );
    };
}

export default CommonAuctionService;
