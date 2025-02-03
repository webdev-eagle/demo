import type { ARTEFACT_TYPE, ITEM_GROUP_TYPE } from '../enums';
import type { AssetDetails } from './assets';

export type ArtefactType = EnumValues<ARTEFACT_TYPE>;

export type ItemGroupType = EnumValues<ITEM_GROUP_TYPE>;

export interface ArtefactDetails extends AssetDetails {
    name: ArtefactType;
}

export interface ArtefactCooldown {
    isInCooldown: boolean;
    lastUnstakeHeight: blocksHeight;
    currentHeight: blocksHeight;
    estimatedCooldownTime: minute;
}

export type AccountBoosterType = 'ART-LAKE' | 'ART-XSCARF' | 'ART-XMISTL' | 'ART-XTREE';
