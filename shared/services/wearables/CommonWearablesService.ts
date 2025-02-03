import { getAddress } from '../../domain/constants';
import AbstractDataFetcher from '../AbstractDataFetcher';

const WEARABLES_DAPP_ADDRESS = getAddress('WEARABLES_DAPP');

abstract class CommonWearablesService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = WEARABLES_DAPP_ADDRESS;
}

export default CommonWearablesService;
