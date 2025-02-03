import { DECIMAL } from '../../constants';
import { int, isInt, noop } from '../../utils';
import { Asset, ExchangeResponse, ExchangeSubscriber, PriceChangeHandler } from './types';
import { getAssetId } from './utils';

class PriceDetector {
    protected exchangeSubscriber: ExchangeSubscriber;
    protected ofAsset: Asset;
    protected inAsset?: Asset;
    protected prices: Record<string, integer> = {};
    protected initPromise: Promise<void>;
    protected subscribers: PriceChangeHandler[] = [];

    close: () => void = noop;

    protected calculatePrice(prices: Record<string, integer>) {
        const maxPrice = Math.max(...Object.values(prices));

        if (!Number.isFinite(maxPrice) || !maxPrice) {
            return int(0);
        }
        return int(maxPrice);
    }

    protected subscribe(
        onData?: (vendor: string, response: { amountCoins: string; priceImpact: number }) => void,
    ): void {
        const pair = `${this.ofAsset}/${this.inAsset}` as const;

        this.close = this.exchangeSubscriber.subscribe({
            onData: (vendor: string, response: ExchangeResponse) => {
                if (response.type !== 'data') {
                    return;
                }
                onData?.(vendor, response);
                const price = parseInt(response.amountCoins, 10);
                if (!isInt(price)) {
                    return;
                }
                const lastPrice = this.calculatePrice(this.prices);

                this.prices = {
                    ...this.prices,
                    [vendor]: int(price),
                };

                const newPrice = this.calculatePrice(this.prices);

                if (newPrice !== lastPrice) {
                    this.subscribers.forEach((cb, index) => {
                        cb(newPrice, () => {
                            this.subscribers.splice(index, 1);
                        });
                    });
                }
            },
            onError: () => {
                throw new Error(`[ERROR][EXCHANGER] Could not connect to exchange service for pair ${pair}`);
            },
        });
    }

    constructor(exchangeSubscriber: ExchangeSubscriber, options: { ofAsset: Asset; inAsset?: Asset }) {
        this.exchangeSubscriber = exchangeSubscriber;
        this.ofAsset = options.ofAsset;
        this.inAsset = options.inAsset ?? 'USDT';

        this.exchangeSubscriber.setSwapParams({
            amountCoins: DECIMAL[this.ofAsset].toString(),
            fromAssetId: getAssetId(this.ofAsset),
            toAssetId: getAssetId(this.inAsset),
            slippageTolerance: 0.1,
        });
        this.initPromise = new Promise((resolve) => {
            this.subscribe(() => resolve());
        });
    }

    async getPrice(): Promise<integer> {
        /* const timeoutPromise = new Promise<void>((_, reject) => {
            setTimeout(() => {
                reject();
            }, 5000);
        });

        await Promise.race([this.initPromise, timeoutPromise]); */

        return this.calculatePrice(this.prices);
    }

    onPriceChange(onChange: PriceChangeHandler): () => void {
        const unsubscribe = () => {
            const index = this.subscribers.indexOf(onChange);
            if (index !== -1) {
                this.subscribers.splice(index, 1);
            }
        };

        this.subscribers.push(onChange);

        return unsubscribe;
    }
}

export default PriceDetector;
