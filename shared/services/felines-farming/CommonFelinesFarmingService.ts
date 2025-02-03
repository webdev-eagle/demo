import { getAddress } from '$shared/domain/constants';
import CommonAnimalsFarmingService from '$shared/services/animals-farming/CommonAnimalsFarmingService';

const FELINES_FARMING_DAPP_ADDRESS = getAddress('FELINES_FARMING_DAPP');

abstract class CommonFelinesFarmingService extends CommonAnimalsFarmingService {
    protected DAPP_ADDRESS = FELINES_FARMING_DAPP_ADDRESS;

    FARMING_ITEM_NAME = 'perches';
}

export default CommonFelinesFarmingService;
