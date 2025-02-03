import { ANIMAL_PREFIXES } from '$shared/enums';
import { AnimalPaths } from '../types/animals';
import AnimalImageGenerator from './AnimalImageGenerator';
import { COMMON_FELINE_STYLE, FELINE_PARAMETER } from './imageGenerator/constantsFeline';

class FelineImageGenerator extends AnimalImageGenerator {
    ANIMAL_PARAMETER = FELINE_PARAMETER;

    COMMON_ANIMAL_STYLE = COMMON_FELINE_STYLE;

    ANIMAL_PREFIXES = ANIMAL_PREFIXES.FELI;

    ANIMAL_PATH = AnimalPaths.FELINE;
}

export default FelineImageGenerator;
