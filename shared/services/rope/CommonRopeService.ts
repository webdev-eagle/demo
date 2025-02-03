import { getAddress } from '../../domain/constants';
import { int } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { RopedEgg } from './data-types';

const ROPE_DAPP_ADDRESS = getAddress('ROPE_EGG_DAPP');

abstract class CommonRopeService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = ROPE_DAPP_ADDRESS;

    fetchRopedEgg = async (
        eggId: string,
        userAddressId: string,
    ): Promise<{ distance: number; amount: number } | null> => {
        const ropedEggCostAndDistance = await this.fetchDataByKey<RopedEgg>(`eggId_${eggId}_${userAddressId}`, {
            avoidCache: true,
        });

        const [amount = null, distance = null] = ropedEggCostAndDistance?.value?.split(';') ?? [];

        if (amount === null) {
            return null;
        }
        return { amount: int(Number(amount)), distance: int(Number(distance)) };
    };
}

export default CommonRopeService;
