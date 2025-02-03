import { toEggs } from '../../domain/amounts';
import { getAddress } from '../../domain/constants';
import type { ICollectiveFarms } from '../../types';
import { int } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type CommonHelperService from '../helper/CommonHelperService';
import type { IsCollectiveFarm } from './data-types';

const COLLECTIVE_FARMS_MASTER_ADDRESS = getAddress('COLLECTIVE_FARMS_MASTER');

abstract class CommonCollectiveFarmService extends AbstractDataFetcher {
    abstract helperService: CommonHelperService;

    protected DAPP_ADDRESS = COLLECTIVE_FARMS_MASTER_ADDRESS;

    abstract getCollectiveFarms: () => Promise<ICollectiveFarms[]>;

    getActiveCollectiveFarms = async (): Promise<ICollectiveFarms[]> => {
        const farms = await this.getCollectiveFarms();

        return farms.filter(({ active }) => active);
    };

    checkIsCollectiveFarm = async (address: addressId): Promise<boolean> => {
        const referrerReward = await this.fetchDataByKey<IsCollectiveFarm>(`farm_${address}`);

        return referrerReward?.value ?? false;
    };

    /**
     * Getting total farm liquidity
     * @return Promise<number>
     */
    getTotalLiquidity = async (): Promise<number> => {
        const data = await this.getCollectiveFarms();
        const result = int(data.reduce((res, { totalLiquidity }) => res + totalLiquidity, 0));

        return toEggs(result);
    };
}

export default CommonCollectiveFarmService;
