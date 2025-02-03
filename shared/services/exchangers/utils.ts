import { ASSET, Assets } from '../../constants';
import { ASSETS_BIMAP } from '../../domain/constants';
import { isDevEnv } from '../../utils';

export const getAssetId = (assetKey: keyof Assets) =>
    isDevEnv() ? ASSET.PRODUCTION[assetKey] : ASSETS_BIMAP.getByKey(assetKey);
