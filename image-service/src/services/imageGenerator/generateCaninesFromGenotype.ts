import { Worlds } from '$shared/enums';
import { log } from '$shared/services/log';
import type { DuckConnections } from '$shared/types';

import { AnimalPaths } from '../../types/animals';
import CaninesImageGenerator from '../CaninesImageGenerator';
import DockingAnimalImageGenerator from '../StakeItemImageGenerator';

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

const generateCanineFromGenotype = (
    canineGenotype: string,
    options: {
        dockingColor?: string;
        world?: Worlds;
        items?: DuckConnections;
        grayscale?: boolean;
    } = {},
): string => {
    const { dockingColor, grayscale } = options;

    try {
        const dockingProperties = new DockingAnimalImageGenerator({
            animalGenotype: canineGenotype,
            stakingItemColor: dockingColor,
            animalPath: AnimalPaths.CANINE,
        }).getProperties();
        const canineImageGenerator = new CaninesImageGenerator(canineGenotype, {
            ...options,
            stakingItemProperties: dockingProperties,
        });
        const styles = canineImageGenerator.getComputedStyles();
        const contents = canineImageGenerator.getComputedAnimal();

        return wrapper({ styles, contents, grayscale });
    } catch (e) {
        log('[ERROR][CANINE_IMAGE_GENERATION]', e);

        return wrapper({});
    }
};

export default generateCanineFromGenotype;
