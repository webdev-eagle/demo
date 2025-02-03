export type InvokeArgPrimitive =
    | { type: 'integer'; value: string }
    | { type: 'binary'; value: string }
    | { type: 'string'; value: string }
    | { type: 'boolean'; value: boolean };

export type InvokeArg = InvokeArgPrimitive | { type: 'list'; value: InvokeArgPrimitive[] };

export interface ExchangeInvokeTransaction {
    dApp: string;
    call: {
        function: string;
        args: InvokeArg[];
    };
    payment: Array<{ assetId: string | null; amount: string }>;
}

export interface ExchangeParams {
    amountCoins: string;
    fromAssetId: string;
    slippageTolerance: number;
    toAssetId: string;
}

export type ExchangeResponse =
    | {
          type: 'error';
          code: number;
      }
    | {
          type: 'data';
          amountCoins: string;
          priceImpact: number;
          swapParams: ExchangeParams;
          tx: ExchangeInvokeTransaction;
      };

export interface Subscriber {
    onError: () => void;
    onData: (vendor: string, response: ExchangeResponse) => void;
}

export interface ExchangeSubscriber {
    setSwapParams(params: ExchangeParams): void;
    subscribe(subscriber: Subscriber): () => void;
}

export type PriceChangeHandler = (price: integer, unsubscribe: () => void) => void;

export type Asset =
    | 'EGG'
    | 'WAVES'
    | 'USDT'
    | 'XTN'
    | 'SPICE'
    | 'PETE'
    | 'STREET'
    | 'FOMO'
    | 'KOLKHOZ'
    | 'TURTLE'
    | 'LATAM'
    | 'EGGPOINT'
    | 'DUXPLORER';

export type Pair = `${Asset}/${Asset}`;
