export type BidStatusType = 'open' | 'cancelled' | 'finished';
export type AuctionStatusType = 'open' | 'cancelled' | 'finished';

export interface AuctionDetails {
    auctionId: auctionId;
    auctionDescription: string;
    instantPrice: eggint | wavesint;
    owner: addressId;
    startPrice: eggint | wavesint;
    finalPrice?: eggint | wavesint;
    startedAt: timestamp;
    status: AuctionStatusType;
    eggSell: boolean;
}

export interface AuctionEntity {
    auctionId: string;
    assetId: string;
    currency: string;
    description: string;
    instantPrice: number;
    startPrice: number;
    startedAt: number;
    status: string;
    type: string;
}

export interface WithBids {
    highestBid: number;
    bids: Record<bidId, { bidId: bidId; amount: integer; author: addressId; status: BidStatusType }>;
}

export interface IAuctionBid {
    address: addressId;
    auctionId: auctionId;
    bidId: bidId;
}

export interface IWithDuckId {
    duckId: nftId;
}

export interface IAuctionBidWithAssetId extends IAuctionBid {
    assetId: assetId;
}

export interface IAssetAuctionBidDataValue {
    auctionId: auctionId;
    author: addressId;
    amount: stringed<eggint>;
    status: BidStatusType;
}

export interface IAssetAuctionBidDataItem {
    key: `assetId_${assetId}_bid_${bidId}_data`;
    type: 'string';
    value: stringed<IAssetAuctionBidDataValue>;
}

export interface IAuctionSellEggItem {
    key: `auction_${auctionId}_eggSell`;
    type: 'boolean';
    value: boolean;
}

export interface IAuctionBidForAsset {
    auctionId: auctionId;
    author: addressId;
    amount: eggint;
    bidId: bidId;
    status: BidStatusType;
    eggSell: boolean;
}

export interface WithAuctionDetails {
    auction: AuctionDetails & WithBids;
}
