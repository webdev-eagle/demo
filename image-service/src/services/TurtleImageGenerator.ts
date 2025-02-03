import { ANIMAL_PREFIXES } from '$shared/enums';
import { AnimalPaths } from '../types/animals';
import AnimalImageGenerator from './AnimalImageGenerator';
import { COMMON_TURTLE_STYLE, TURTLE_PARAMETER } from './imageGenerator/constantsTurtle';
class TurtleImageGenerator extends AnimalImageGenerator {
    ANIMAL_PARAMETER = TURTLE_PARAMETER;

    COMMON_ANIMAL_STYLE = COMMON_TURTLE_STYLE;

    ANIMAL_PREFIXES = ANIMAL_PREFIXES.TURTLE;

    ANIMAL_PATH = AnimalPaths.TURTLE;
}

export default TurtleImageGenerator;
