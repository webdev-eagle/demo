import type { Pagination } from '../api';
import type { Auction } from './auctions';
import type { CommonNft, Connection, Lock } from './common';
import type { Pete } from './pete';

export interface Mantle extends CommonNft {
    name: 'DUCK-MANTLE-0';
    type: 'MANTLE';
    level: number;
    auction?: Auction;
    connection?: Connection;
    locks?: Lock[];
}

export interface AccessItem extends CommonNft {
    name: 'ACCESS-RACE' | 'ACCESS-HUNT';
    type: 'ACCESS';
    connection?: Connection;
    locks?: Lock[];
}

export interface Artefact extends CommonNft {
    name: `ART-${string}`;
    type: 'ART';
    connection?: Connection;
    locks?: Lock[];
}

export type Item = Mantle | AccessItem | Artefact | Pete;

export type EmptyPerches = {
    R: number;
    G: number;
    B: number;
    U: number;
};

export interface UserItemsFilters extends Pagination {
    type?: 'MANTLE' | 'ART' | 'ACCESS' | 'PETE';
}
