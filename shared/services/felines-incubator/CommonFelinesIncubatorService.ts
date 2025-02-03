import { getAddress } from '../../domain/constants';
import CommonAnimalsIncubatorService from '../animals-incubator/CommonAnimalsIncubatorService';

const FELINES_INCUBATOR_DAPP_ADDRESS = getAddress('FELINES_INCUBATOR_DAPP');

abstract class CommonFelinesIncubatorService extends CommonAnimalsIncubatorService {
    protected DAPP_ADDRESS = FELINES_INCUBATOR_DAPP_ADDRESS;
    ANIMAL_KEY = 'felines';
}

export default CommonFelinesIncubatorService;
