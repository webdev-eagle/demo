import { AnimalPaths } from '../../types/animals';
import BeachImageGenerator from '../StakeItemImageGenerator';

const getBeach = (color: string): string => {
    const beachProperties = new BeachImageGenerator({
        stakingItemColor: color,
        animalPath: AnimalPaths.TURTLE,
    }).getProperties();

    return `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t viewBox="0 0 510.24 595.28" style="enable-background:new 0 0 510.24 595.28;" xml:space="preserve">

<style type="text/css">
${beachProperties.styles}
</style>

${beachProperties.image}
</svg>`;
};

export default getBeach;
