import PriceDetector from './PriceDetector';
import type { Asset, ExchangeSubscriber, Pair, PriceChangeHandler } from './types';

abstract class CommonExchangersService {
    static readonly ASSETS = ['EGG', 'WAVES', 'USDT', 'XTN', 'SPICE', 'PETE'];
    /**
     * Represents the constructor for the exchange subscriber.
     */
    protected abstract ExchangeSubscriberConstructor: { new (): ExchangeSubscriber };

    protected detectors: Partial<Record<Pair, PriceDetector>> = {};

    protected getPriceDetector(ofAsset: Asset, inAsset: Asset): PriceDetector {
        const pair = `${ofAsset}/${inAsset}` as const;
        const { [pair]: detector } = this.detectors;
        if (!detector) {
            const exchangeSubscriber = new this.ExchangeSubscriberConstructor();
            const detector = new PriceDetector(exchangeSubscriber, { ofAsset, inAsset });
            this.detectors[pair] = detector;

            return detector;
        }

        return detector;
    }

    isKnownAsset = (asset: string): asset is Asset => CommonExchangersService.ASSETS.includes(asset as Asset);

    getPrice = async (ofAsset: Asset, inAsset: Asset = 'USDT'): Promise<integer> => {
        const priceDetector = await this.getPriceDetector(ofAsset, inAsset);
        return await priceDetector.getPrice();
    };

    onPriceChange = (options: { ofAsset: Asset; inAsset?: Asset }, onPriceChange: PriceChangeHandler): (() => void) => {
        const { ofAsset, inAsset = 'USDT' } = options;
        const priceDetector = this.getPriceDetector(ofAsset, inAsset);
        return priceDetector.onPriceChange(onPriceChange);
    };
}

export default CommonExchangersService;
