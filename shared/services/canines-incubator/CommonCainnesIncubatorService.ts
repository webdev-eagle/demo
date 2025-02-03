import { getAddress } from '../../domain/constants';
import CommonAnimalsIncubatorService from '../animals-incubator/CommonAnimalsIncubatorService';

const CANINES_INCUBATOR_DAPP_ADDRESS = getAddress('CANINES_INCUBATOR_DAPP');

abstract class CommonCaninesIncubatorService extends CommonAnimalsIncubatorService {
    protected DAPP_ADDRESS = CANINES_INCUBATOR_DAPP_ADDRESS;
    ANIMAL_KEY = 'cani';
}

export default CommonCaninesIncubatorService;
