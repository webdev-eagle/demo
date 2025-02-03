import { CANINE_COLORS, CANINE_GENERATION_NAMES, CanineColorNames, Canines } from '$shared/constants/canines';
import { getAddress } from '$shared/domain/constants';
import CommonAnimalsService from '../animals';

const CANINES_BREEDER_DAPP_ADDRESS = getAddress('CANINES_BREEDER_DAPP');
const CANINES_INCUBATOR_DAPP_ADDRESS = getAddress('CANINES_INCUBATOR_DAPP');
const CANINES_FARMING_DAPP_ADDRESS = getAddress('CANINES_FARMING_DAPP');

abstract class CommonCaninesService extends CommonAnimalsService {
    ANIMAL_ACRONYM = 'CANI';

    ANIMAL_PATH = 'canines';

    ANIMAL_CONSTANT = Canines;

    ANIMAL_COLORS = CANINE_COLORS;

    ANIMAL_COLORS_NAMES = CanineColorNames;

    ANIMAL_GENERATION_NAMES = CANINE_GENERATION_NAMES;

    INCUBATOR_DAPP_ADDRESS = CANINES_INCUBATOR_DAPP_ADDRESS;

    BREEDER_DAPP_ADDRESS = CANINES_BREEDER_DAPP_ADDRESS;

    FARMING_DAPP_ADDRESS = CANINES_FARMING_DAPP_ADDRESS;

    isAnimal = <T extends { name: string }>({ name }: T) => name.indexOf('CANI-') === 0;
}

export default CommonCaninesService;
