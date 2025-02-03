import { getAddress } from '../../domain/constants';
import CommonAnimalsIncubatorService from '../animals-incubator/CommonAnimalsIncubatorService';

const DUCK_INCUBATOR_DAPP_ADDRESS = getAddress('DUCK_INCUBATOR_DAPP');

abstract class CommonIncubatorService extends CommonAnimalsIncubatorService {
    protected DAPP_ADDRESS = DUCK_INCUBATOR_DAPP_ADDRESS;
    ANIMAL_KEY = 'duck';
}

export default CommonIncubatorService;
