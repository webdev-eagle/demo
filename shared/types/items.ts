import type { ArtefactDetails, ArtefactType, ItemGroupType } from './artefacts';

export interface ILootBox {
    boxId: lootBoxId;
    isBox: true;
    status: ArtefactType | 'started';
    artefactId: itemId;
    finishHeight: blocksHeight;
}

export interface IArtefact extends ArtefactDetails {
    id: artefactId;
    owner: addressId;
    title: string;
    assetId: artefactId;
    startPrice?: eggint;
    instantPrice?: eggint;
    auctionId?: auctionId;
    auctionDescription?: string;
    type: ArtefactType;
    onSale: boolean;
    isStaked?: boolean;
    cooldown?: minute;
    isArtefact: true;
    eggSell?: boolean;
}

export interface DirectMarketItemData {
    itemType: ArtefactType;
    group: ItemGroupType;
    basePrice: integer;
    maxQuantity: integer;
    onSale: boolean;
    growPercentage: integer;
    soldQuantity: integer;
    lastPrice: integer;
    priceAsset: assetId;
    start?: number;
    end?: number;
}
