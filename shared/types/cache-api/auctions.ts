import type { AuctionStatusType, BidStatusType } from '$shared/types';

export interface Bid {
    bidId: bidId;
    amount: integer;
    auctionId: auctionId;
    author: addressId;
    status: BidStatusType;
}

export interface Auction {
    auctionId: auctionId;
    assetId: assetId;
    bids: Bid[];
    currency: assetId | 'WAVES';
    description: string;
    instantPrice: integer;
    startPrice: integer;
    startedAt: timestamp;
    status: AuctionStatusType;
}
