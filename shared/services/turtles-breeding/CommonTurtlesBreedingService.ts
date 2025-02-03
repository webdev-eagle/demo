import { TURTLE_GENERATION_NAMES } from '$shared/constants';
import { ANIMAL_PREFIXES } from '$shared/enums';
import { AnimalBreedingDataMatch } from '$shared/types/animals';
import { getAddress } from '../../domain/constants';
import CommonAnimalsBreedingService from '../animals-breeding/CommonAnimalsBreedingService';
import type CommonAssetsService from '../assets';
import type CommonTransactionService from '../transaction';

const TURTLES_INCUBATOR_DAPP_ADDRESS = getAddress('TURTLES_INCUBATOR_DAPP');
const TURTLES_BREEDER_DAPP_ADDRESS = getAddress('TURTLES_BREEDER_DAPP');
abstract class CommonTurtlesBreedingService extends CommonAnimalsBreedingService {
    protected DAPP_ADDRESS = TURTLES_BREEDER_DAPP_ADDRESS;

    protected ANIMAL_PREFIXES = ANIMAL_PREFIXES.TURTLE;

    protected INCUBATOR_DAPP_ADDRESS = TURTLES_INCUBATOR_DAPP_ADDRESS;

    protected abstract DUXPLORER_URL: string;

    protected GENERATION_NAMES = TURTLE_GENERATION_NAMES;

    protected abstract assetsService: CommonAssetsService;

    protected abstract transactionService: CommonTransactionService;

    protected ANIMAL_BREEDING_DATA_MATCH = AnimalBreedingDataMatch.TURTLE;
}

export default CommonTurtlesBreedingService;
