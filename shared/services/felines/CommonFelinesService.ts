import { FELINE_COLORS, FELINE_GENERATION_NAMES, FelineColorNames, Felines } from '$shared/constants/felines';
import { getAddress } from '$shared/domain/constants';
import CommonAnimalsService from '../animals/CommonAnimalsService';

const FELINES_INCUBATOR_DAPP = getAddress('FELINES_INCUBATOR_DAPP');
const FELINES_BREEDER_DAPP = getAddress('FELINES_BREEDER_DAPP');

abstract class CommonFelinesService extends CommonAnimalsService {
    ANIMAL_ACRONYM = 'FELI';

    ANIMAL_PATH = 'felines';

    ANIMAL_CONSTANT = Felines;

    ANIMAL_GENERATION_NAMES = FELINE_GENERATION_NAMES;

    ANIMAL_COLORS = FELINE_COLORS;

    ANIMAL_COLORS_NAMES = FelineColorNames;

    INCUBATOR_DAPP_ADDRESS = FELINES_INCUBATOR_DAPP;

    BREEDER_DAPP_ADDRESS = FELINES_BREEDER_DAPP;

    FARMING_DAPP_ADDRESS = '';

    isAnimal = <T extends { name: string }>({ name }: T) => name.indexOf('FELI-') === 0;
}

export default CommonFelinesService;
