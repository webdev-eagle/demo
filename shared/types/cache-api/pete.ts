import { AssetDetails } from '../assets';
import { AuctionDetails } from '../auctions';
import { Auction } from './auctions';
import { CommonNft, Connection, Lock } from './common';

export interface Pete extends CommonNft {
    name: string;
    description: string;
    auction?: Auction;
    locks?: Lock[];
    connection?: Connection;
    type: 'PETE';
    auctionDetails?: AuctionDetails;
    isStaked?: boolean;
    onSale: boolean;
}

export interface IPete extends AssetDetails {
    owner: addressId;
    startPrice?: eggint;
    instantPrice?: eggint;
    auctionId?: auctionId;
    auctionDetails?: AuctionDetails;
    auctionDescription?: string;
    type?: string;
    onSale: boolean;
    isStaked?: boolean;
    eggSell?: boolean;
    title?: string;
}

export interface PeteStakedNft {
    key: string;
    type: string;
    value: boolean;
}
