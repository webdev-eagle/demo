import { DUCK_GENERATION_NAMES } from '$shared/constants';
import { ANIMAL_PREFIXES } from '$shared/enums';
import { AnimalBreedingDataMatch } from '$shared/types/animals';
import { getAddress } from '../../domain/constants';
import CommonAnimalsBreedingService from '../animals-breeding/CommonAnimalsBreedingService';
import type CommonAssetsService from '../assets';
import type CommonTransactionService from '../transaction';

const DUCK_INCUBATOR_DAPP_ADDRESS = getAddress('DUCK_INCUBATOR_DAPP');
const DUCK_BREEDER_DAPP_ADDRESS = getAddress('DUCK_BREEDER_DAPP');

abstract class CommonBreedingService extends CommonAnimalsBreedingService {
    protected DAPP_ADDRESS = DUCK_BREEDER_DAPP_ADDRESS;

    protected INCUBATOR_DAPP_ADDRESS = DUCK_INCUBATOR_DAPP_ADDRESS;

    protected GENERATION_NAMES = DUCK_GENERATION_NAMES;

    protected ANIMAL_PREFIXES = ANIMAL_PREFIXES.DUCK;

    protected abstract DUXPLORER_URL: string;

    protected abstract assetsService: CommonAssetsService;

    protected abstract transactionService: CommonTransactionService;

    protected ANIMAL_BREEDING_DATA_MATCH = AnimalBreedingDataMatch.DUCK;
}

export default CommonBreedingService;
