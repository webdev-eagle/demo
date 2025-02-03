import type {
    ContractBooleanData,
    ContractIntegerData,
    ContractStringData,
    IAssetAuctionBidDataValue,
} from '../../types';

export type AssetBidData = ContractStringData<
    `assetId_${assetId}_bid_${bidId}_data`,
    stringed<IAssetAuctionBidDataValue>
>;

export type NftLastAuction = ContractStringData<`auction_${nftId}_last`, auctionId>;
export type AssetId = ContractStringData<`auction_${auctionId}_assetId`, assetId>;
export type Description = ContractStringData<`auction_${auctionId}_description`>;
export type InstantPrice = ContractIntegerData<`auction_${auctionId}_instantPrice`>;
export type Owner = ContractStringData<`auction_${auctionId}_owner`, addressId>;
export type StartPrice = ContractIntegerData<`auction_${auctionId}_startPrice`>;
export type StartedAt = ContractIntegerData<`auction_${auctionId}_startedAt`>;
export type EggSell = ContractBooleanData<`auction_${auctionId}_eggSell`>;
export type Status = ContractStringData<`auction_${auctionId}_status`, 'open' | 'finished' | 'cancelled'>;
export type IsArtefact = ContractBooleanData<`auction_${auctionId}_isArtefact`>;

export type BidStatus = ContractStringData<
    `auction_${auctionId}_bid_${bidId}_status`,
    'open' | 'finished' | 'cancelled'
>;
export type BidAuthor = ContractStringData<`auction_${auctionId}_bid_${bidId}_author`, addressId>;
export type BidAmount = ContractIntegerData<`auction_${auctionId}_bid_${bidId}_amount`>;

export type AssetIdByBid = ContractStringData<`address_${addressId}_auction_${auctionId}_bid_${bidId}`, assetId>;
export type LockedNft = ContractStringData<`address_${addressId}_auction_${auctionId}_lockedNFT`, assetId>;

export type Details =
    | AssetId
    | Description
    | InstantPrice
    | Owner
    | StartPrice
    | StartedAt
    | EggSell
    | Status
    | BidStatus
    | BidAuthor
    | BidAmount;
