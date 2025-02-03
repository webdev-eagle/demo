import { ANIMAL_PREFIXES } from '$shared/enums';
import { ImageProp } from '../types';
import { AnimalPaths } from '../types/animals';
import AnimalImageGenerator from './AnimalImageGenerator';
import { CANINE_PARAMETER, COMMON_CANINE_STYLE } from './imageGenerator/constantsCanine';
class CanineImageGenerator extends AnimalImageGenerator {
    stakingItemProperties?: ImageProp;

    ANIMAL_PARAMETER = CANINE_PARAMETER;

    COMMON_ANIMAL_STYLE = COMMON_CANINE_STYLE;

    ANIMAL_PREFIXES = ANIMAL_PREFIXES.CANI;

    ANIMAL_PATH = AnimalPaths.CANINE;
}

export default CanineImageGenerator;
