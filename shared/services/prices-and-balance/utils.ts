import type { DuxplorerCollectiveStat, IAssetBalances, ICollectiveFarmTokenPrice } from '../../types';
import type { CollectiveFarmBalance } from './types';

interface CollectiveFarmMapperParams {
    collectiveFarmBalance?: IAssetBalances;
    shareAssetPrice?: ICollectiveFarmTokenPrice;
    duxplorerCollectiveJson?: DuxplorerCollectiveStat;
    staked?: number;
    claimed?: number;
    lastCheckInterest?: number;
    currentInterest?: number;
}

export const getCollectiveFarmBalance = (balances: IAssetBalances[], shareAssetId: string) =>
    balances.find((b) => b.assetId === shareAssetId);

export const getShareAssetPrice = (shareAssetPrices: ICollectiveFarmTokenPrice[], shareAssetId: string) =>
    shareAssetPrices.find((asp) => asp.assetId === shareAssetId);

export const getCollectiveFarmDuxplorerInfo = (duxplorerCollectiveJson: DuxplorerCollectiveStat[], contract: string) =>
    duxplorerCollectiveJson.find((dcj) => dcj.owner === contract);

export const collectiveFarmMapper = (
    collectiveFarm,
    {
        collectiveFarmBalance,
        shareAssetPrice,
        duxplorerCollectiveJson,
        staked = 0,
        claimed = 0,
        lastCheckInterest = 0,
        currentInterest = 0,
    }: CollectiveFarmMapperParams,
): CollectiveFarmBalance => {
    const balanceNumber = collectiveFarmBalance ? collectiveFarmBalance.balance : 0;
    const balance = (balanceNumber + staked) / 1e8;
    const apy = duxplorerCollectiveJson ? duxplorerCollectiveJson.farmApy : 0;
    const estimatedReward = balance * (apy / 100);
    const availableToClaim = lastCheckInterest > 0 ? ((currentInterest - lastCheckInterest) * staked) / 1e8 ** 2 : 0;

    return {
        apy, // na swap
        balance,
        contract: collectiveFarm.contract,
        cover: collectiveFarm.cover,
        estimatedReward,
        pool: shareAssetPrice ? shareAssetPrice.pool : null, // na swap
        price: shareAssetPrice ? shareAssetPrice.price : 0, // XTN
        shareAssetId: collectiveFarm.shareAssetId,
        stakingContract: collectiveFarm.stakingContract,
        title: collectiveFarm.title,
        staked: staked / 1e8,
        claimed: claimed / 1e8,
        availableToClaim,
    };
};
