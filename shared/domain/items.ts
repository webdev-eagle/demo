import { ITEM_GROUP, WEARABLE_ITEM_GROUP } from '../constants';
import type { ArtefactDetails, DuckConnectionType, ItemGroupType } from '../types';
import { keys, unique } from '../utils';

export const getItemGroupByType = (type: `ART-${string}`): ItemGroupType => ITEM_GROUP[type];

export const getWearableItemGroupByType = (type: `ART-${string}`): DuckConnectionType => WEARABLE_ITEM_GROUP[type];

export const isWearable = (nft: { name: string }): nft is ArtefactDetails => nft.name in WEARABLE_ITEM_GROUP;

export const getItemGroups = (): ItemGroupType[] => unique(Object.values(ITEM_GROUP));

export const getWearableItemGroups = (): DuckConnectionType[] => unique(Object.values(WEARABLE_ITEM_GROUP));
