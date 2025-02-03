import { Worlds } from '$shared/enums';
import { log } from '$shared/services/log';
import type { DuckConnections } from '$shared/types';

import { AnimalPaths } from '../../types/animals';
import MutantImageGenerator from '../MutantImageGenerator';
import MutariumImageGenerator from '../StakeItemImageGenerator';

const wrapper = ({
    contents = '',
    styles = '',
    grayscale = false,
}: {
    styles?: string;
    contents?: string;
    grayscale?: boolean;
}): string => `<?xml version="1.0" encoding="utf-8"?>
<svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 510.24 595.28"
    style="enable-background:new 0 0 510.24 595.28;${grayscale ? 'filter: grayscale(1);' : ''}"
    xml:space="preserve"
>
<style type="text/css">
${styles}
</style>
${contents}
</svg>
`;

const generateMutantFromGenotype = (
    mutantGenotype: string,
    options: {
        mutariumColor?: string;
        world?: Worlds;
        items?: DuckConnections;
        grayscale?: boolean;
    } = {},
): string => {
    const { mutariumColor, grayscale } = options;
    try {
        const mutariumProperties = new MutariumImageGenerator({
            animalGenotype: mutantGenotype,
            stakingItemColor: mutariumColor,
            animalPath: AnimalPaths.MUTANTS,
        }).getProperties();
        const mutantImageGenerator = new MutantImageGenerator(mutantGenotype, { ...options, mutariumProperties });
        const styles = mutantImageGenerator.getComputedStyles();
        const contents = mutantImageGenerator.getComputedMutant();

        return wrapper({ styles, contents, grayscale });
    } catch (e) {
        log('[ERROR][MUTANT_IMAGE_GENERATION]', e);

        return wrapper({});
    }
};

export default generateMutantFromGenotype;
