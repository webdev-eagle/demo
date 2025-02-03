import { getAddress } from '../../domain/constants';
import CommonAnimalsIncubatorService from '../animals-incubator/CommonAnimalsIncubatorService';

const TURTLES_INCUBATOR_DAPP_ADDRESS = getAddress('TURTLES_INCUBATOR_DAPP');

abstract class CommonTurtlesIncubatorService extends CommonAnimalsIncubatorService {
    protected DAPP_ADDRESS = TURTLES_INCUBATOR_DAPP_ADDRESS;
    ANIMAL_KEY = 'turtle';
}

export default CommonTurtlesIncubatorService;
