import type { Assets } from '../../constants';
import type { DuxplorerCollectiveStat, ICollectiveFarms } from '../../types';

export interface TokenInfo {
    assetId: string | null;
    title: keyof Assets;
    decimals: number;
    cover: string;
}

export interface TokenBalance extends TokenInfo {
    balance: number;
    price: number;
}

export interface CollectiveFarmBalance {
    apy: number;
    balance: number;
    contract: string;
    cover: string;
    estimatedReward: number;
    pool: string | null;
    price: number;
    shareAssetId: string;
    stakingContract: string;
    availableToClaim: number;
    title: string;
    claimed: number;
    staked: number;
}

export interface CommonCollectiveFarms extends Partial<DuxplorerCollectiveStat>, Partial<ICollectiveFarms> {
    ducks: number;
}

type Amount = {
    minimumToReceive: number;
    amount: number;
    routing: Array<{ step: number; pool: string }>;
    priceImpact: Array<{ step: number; percent: number }>;
    fee: Array<{ amount: number; asset: string }>;
    price: [{ type: 'from-to'; amount: number }, { type: 'to-from'; amount: number }];
    transaction: any;
};

export type Estimated = {
    fromAsset: string;
    toAsset: string;
} & (
    | {
          fromAmount: number;
          toAmount: Amount[];
      }
    | {
          fromAmount: Amount[];
          toAmount: number;
      }
);

export interface IContractStateKey {
    key: string;
    value: number | boolean | string;
    type: 'integer' | 'string' | 'boolean';
}
