import { getAssetID } from '../../domain/constants';
import { getItemGroupByType } from '../../domain/items';
import type CommonArtefactService from '../../services/artefact';
import type { ArtefactType, DirectMarketItemData } from '../../types';
import { int } from '../../utils';

abstract class CommonMarketService {
    protected abstract artefactService: CommonArtefactService;

    fetchMarketItems = async (): Promise<Map<ArtefactType, DirectMarketItemData>> => {
        const map = new Map<ArtefactType, DirectMarketItemData>();
        const REWORD_PROP = {
            '': 'basePrice',
            'max_sales': 'maxQuantity',
            'sale': 'onSale',
            'growing_percentage': 'growPercentage',
            'sold': 'soldQuantity',
            'last_price': 'lastPrice',
            'priceAsset': 'priceAsset',
            'startTs': 'start',
            'endTs': 'end',
        } as const;
        const cosmeticData = await this.artefactService.fetchDirectMarketItems();

        for (const { key, value } of cosmeticData) {
            const match = key.match(/direct_cosmetic_([A-Z0-9-_]*[A-Z0-9])_?(.*)/);
            if (match == null) {
                continue;
            }
            const [, itemType, propSnakeCase] = match as [string, ArtefactType, keyof typeof REWORD_PROP];
            const prop = REWORD_PROP[propSnakeCase ?? ''];

            if (!map.has(itemType)) {
                map.set(itemType, {
                    itemType,
                    group: getItemGroupByType(itemType),
                    basePrice: int(0),
                    maxQuantity: int(0),
                    onSale: false,
                    growPercentage: int(0),
                    soldQuantity: int(0),
                    lastPrice: int(0),
                    priceAsset: getAssetID('EGG'),
                });
            }
            (map.get(itemType) as any)[prop] = value;
        }
        map.forEach(({ basePrice, onSale, start, end }, itemType) => {
            if (!onSale || basePrice === 0 || (start && Date.now() < start) || (end && end < Date.now())) {
                map.delete(itemType);
            }
        });

        return map;
    };
}

export default CommonMarketService;
