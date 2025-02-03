import { Worlds } from '$shared/enums';
import { log } from '$shared/services/log';
import type { DuckConnections } from '$shared/types';

import { AnimalPaths } from '../../types/animals';
import DuckImageGenerator from '../DuckImageGenerator';
import PerchImageGenerator from '../StakeItemImageGenerator';
import VPerchImageGenerator from '../vPerchImageGenerator';

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

const generateDuckFromGenotype = (
    genotype: string,
    options: {
        perchColor?: string;
        world?: Worlds;
        druck?: string;
        items?: DuckConnections;
        grayscale?: boolean;
    } = {},
): string => {
    const { perchColor, grayscale } = options;
    try {
        let perchProperties;
        if (genotype.includes('WWWWPAIN')) {
            perchProperties = '';
        } else {
            perchProperties =
                perchColor === 'P'
                    ? new VPerchImageGenerator({ duckGenotype: genotype, perchColor })
                    : new PerchImageGenerator({
                          animalGenotype: genotype,
                          stakingItemColor: perchColor,
                          animalPath: AnimalPaths.DUCK,
                      }).getProperties();
        }
        const duckImageGenerator = new DuckImageGenerator(genotype, { ...options, perchProperties });
        const styles = duckImageGenerator.getComputedStyles();
        const contents = duckImageGenerator.getComputedAnimal();
        return wrapper({ styles, contents, grayscale });
    } catch (e) {
        log('[ERROR][DUCK_IMAGE_GENERATION]', e);

        return wrapper({});
    }
};

export default generateDuckFromGenotype;
