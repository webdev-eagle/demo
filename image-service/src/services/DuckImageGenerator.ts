import { ANIMAL_PREFIXES, Worlds } from '$shared/enums';
import type { DuckConnections } from '$shared/types';
import { unique } from '$shared/utils';

import type { PerchProperties } from '../types';
import { AnimalPaths } from '../types/animals';
import { folderContents, readFile } from '../utils';
import AnimalImageGenerator, { getStyles, getStylesPath } from './AnimalImageGenerator';
import { COMMON_DUCK_STYLE, DUCK_PARAMETER, JACKPOT_ALIAS } from './imageGenerator/constants';

const STYLES = folderContents('/styles');

class DuckImageGenerator extends AnimalImageGenerator {
    protected druck?: string;

    ANIMAL_PARAMETER = DUCK_PARAMETER;

    COMMON_ANIMAL_STYLE = COMMON_DUCK_STYLE;

    ANIMAL_PREFIXES = ANIMAL_PREFIXES.DUCK;

    ANIMAL_PATH = AnimalPaths.DUCK;

    constructor(
        genotype: string,
        options: {
            perchColor?: string;
            perchProperties?: PerchProperties;
            world?: Worlds;
            druck?: string;
            items?: DuckConnections;
            grayscale?: boolean;
        } = {},
    ) {
        super(genotype, {
            perchColor: options.perchColor,
            stakingItemProperties: options.perchProperties,
            world: options.world,
            items: options.items,
            grayscale: options.grayscale,
        });
        const druck = options.druck ?? '1';
        this.geneParts = genotype.split('').map((gene) => (gene !== 'I' ? gene : `I_${druck}`));
        this.druck = druck;
    }

    protected getAnimalStyles(): string {
        if (this.isStaked && STYLES.includes(`${this.genotype}_PERCHED.css`)) {
            return readFile(getStylesPath, `${this.genotype}_PERCHED`);
        }
        if (this.isStaked && STYLES.includes(`${this.genotype}_ON_PERCH.css`)) {
            return readFile(getStylesPath, `${this.genotype}_ON_PERCH`);
        }

        if (STYLES.includes(`${this.genotype}.css`)) {
            return readFile(getStylesPath, this.genotype);
        }

        if (this.genotype in JACKPOT_ALIAS) {
            return readFile(getStylesPath, JACKPOT_ALIAS[this.genotype]);
        }
        if (this.isVPerched && STYLES.includes(`${this.genotype}_ON_VPERCH.css`)) {
            return readFile(getStylesPath, `${this.genotype}_ON_VPERCH`);
        }
        if (this.isVPerched && STYLES.includes(`${this.genotype}_VPERCHED.css`)) {
            return readFile(getStylesPath, `${this.genotype}_VPERCHED`);
        }
        return unique(this.geneParts)
            .map((part) => COMMON_DUCK_STYLE[part])
            .concat(Object.values(this.items).map(getStyles))
            .join('\n');
    }
}

export default DuckImageGenerator;
