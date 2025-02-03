import { ANIMAL_PREFIXES, Worlds } from '$shared/enums';
import { DuckConnections } from '$shared/types';
import { unique } from '$shared/utils';
import { StakingItemProperties } from '../types';
import { AnimalPaths } from '../types/animals';
import { fileResolver, folderContents, isInWars, readFile } from '../utils';
import { JACKPOT_ALIAS, WORLD } from './imageGenerator/constants';

const JACKPOTS = (animalPath: AnimalPaths) => folderContents(`/${animalPath}/complete`);
const STYLES = folderContents('/styles');
const ITEMS = folderContents('/items');
const BACKGROUNDS = (animalPath: AnimalPaths) => folderContents(`/${animalPath}/parts/background`);
const FIRST_LAYERS = (animalPath: AnimalPaths) => folderContents(`/${animalPath}/parts/first-layer`);

const getAnimalFirstLayerPath = fileResolver(
    (animalPath: AnimalPaths, genotype: string) => `/${animalPath}/parts/first-layer/${genotype}.svg`,
);
const getAnimalBackgroundPath = fileResolver(
    (animalPath: AnimalPaths, genotype: string) => `/${animalPath}/parts/background/${genotype}.svg`,
);

const getItemPath = fileResolver((name: string) => `/items/${name}.svg`);
export const getStylesPath = fileResolver((name: string) => `/styles/${name}.css`);

export const getCompleteAnimalPath = fileResolver(
    (animalPath: AnimalPaths, genotype: string) => `/${animalPath}/complete/${genotype}.svg`,
);

export const getStyles = (name: string): string | undefined =>
    STYLES.includes(`${name}.css`) ? readFile(getStylesPath, name) : undefined;

const getItem = (name: string): string | undefined =>
    ITEMS.includes(`${name}.svg`) ? readFile(getItemPath, name) : undefined;

abstract class AnimalImageGenerator {
    protected genotype: string;

    protected geneParts: string[];

    protected isVPerched?: boolean;

    protected isStaked?: boolean;

    protected perchColor?: string;

    protected stakingItemProperties?: StakingItemProperties;

    protected world?: Worlds;

    protected items?: DuckConnections;

    protected grayscale?: boolean;

    abstract ANIMAL_PARAMETER: { [key: string]: { [key: string]: string } };

    abstract COMMON_ANIMAL_STYLE: { [key: string]: string };

    abstract ANIMAL_PREFIXES: ANIMAL_PREFIXES;

    abstract ANIMAL_PATH: AnimalPaths;

    constructor(
        genotype: string,
        options: {
            perchColor?: string;
            stakingItemProperties?: StakingItemProperties;
            world?: Worlds;
            items?: DuckConnections;
            grayscale?: boolean;
        } = {},
    ) {
        const isInWorld = options.world !== Worlds.None;
        this.genotype = genotype;
        this.geneParts = genotype.split('').map((gene) => gene);
        this.isStaked = !isInWorld && !!options.perchColor;
        this.isVPerched = options.perchColor === 'P';
        this.perchColor = this.isVPerched ? 'P' : (options.perchColor ?? null);
        this.stakingItemProperties = !isInWorld ? options.stakingItemProperties : { styles: '', front: '', back: '' };
        this.world = options.world ?? Worlds.None;
        this.items = options.items ?? {};
        this.grayscale = options.grayscale;
    }

    protected getBackground(): string {
        if (BACKGROUNDS(this.ANIMAL_PATH).includes(`${this.genotype}.svg`)) {
            return readFile(getAnimalBackgroundPath, this.ANIMAL_PATH, this.genotype);
        }

        return '';
    }

    protected getFirstLayer(): string {
        if (FIRST_LAYERS(this.ANIMAL_PATH).includes(`${this.genotype}.svg`)) {
            return readFile(getAnimalFirstLayerPath, this.ANIMAL_PATH, this.genotype);
        }

        return '';
    }

    protected getLeftWing(): string {
        if (isInWars(this.world)) {
            return '';
        }
        if ('LEFT_WING' in this.items) {
            return getItem(this.items.LEFT_WING) ?? this.ANIMAL_PARAMETER.leftWing[this.geneParts[5]];
        }

        return this.ANIMAL_PARAMETER.leftWing[this.geneParts[5]];
    }

    protected getTail(): string {
        if ('TAIL' in this.items) {
            return getItem(this.items.TAIL) ?? this.ANIMAL_PARAMETER.tail[this.geneParts[7]];
        }

        return this.ANIMAL_PARAMETER.tail[this.geneParts[7]];
    }

    protected getRightWing(): string {
        if ('RIGHT_WING' in this.items) {
            return getItem(this.items.RIGHT_WING) ?? this.ANIMAL_PARAMETER.rightWing[this.geneParts[6]];
        }

        return this.ANIMAL_PARAMETER.rightWing[this.geneParts[6]];
    }

    protected getEyes(): string {
        return this.ANIMAL_PARAMETER.eyes[this.geneParts[2]];
    }

    protected getBeak(): string {
        return this.ANIMAL_PARAMETER.beak[this.geneParts[3]];
    }

    protected getEyebrows(): string {
        if ('HELMET' in this.items) {
            return '';
        }
        if ('MASK' in this.items) {
            return getItem(this.items.MASK) ?? this.ANIMAL_PARAMETER.eyebrows[this.geneParts[1]];
        }
        return this.ANIMAL_PARAMETER.eyebrows[this.geneParts[1]];
    }

    protected getBody(): string {
        return this.ANIMAL_PARAMETER.body[this.geneParts[4]];
    }

    protected getHead(): string {
        return this.ANIMAL_PARAMETER.head[this.geneParts[4]];
    }

    protected getAccessory(): string {
        if ('TOP' in this.items) {
            return getItem(this.items.TOP) ?? this.ANIMAL_PARAMETER.body[this.geneParts[4]];
        }

        return this.ANIMAL_PARAMETER.accessories[this.geneParts[4]];
    }

    protected getOnHead(): string {
        if ('HELMET' in this.items) {
            return getItem(this.items.HELMET) ?? this.ANIMAL_PARAMETER.onHead[this.geneParts[0]];
        }
        if ('HEAD' in this.items) {
            return getItem(this.items.HEAD) ?? this.ANIMAL_PARAMETER.onHead[this.geneParts[0]];
        }

        return this.ANIMAL_PARAMETER.onHead[this.geneParts[0]];
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

        const items = Object.values(this.items);
        const stylesArray =
            items.length > 0
                ? items.map(getStyles)
                : this.geneParts.map((gens) => getStyles(`${this.ANIMAL_PREFIXES}-${gens}`));

        return unique(this.geneParts)
            .map((part) => this.COMMON_ANIMAL_STYLE[part])
            .concat(stylesArray)
            .join('\n');
    }

    getComputedBodyParts(): string {
        return `
            ${this.getTail()}
            ${this.getLeftWing()}
            ${this.getBody()}
            ${this.getHead()}
            ${this.getAccessory()}
            ${getItem(this.items.BACK) ?? ''}
            ${getItem(this.items.ACCESSORY) ?? ''}
            ${this.getEyes()}
            ${this.getBeak()}
            ${this.getOnHead()}
            ${this.getRightWing()}
            ${this.getEyebrows()}
            ${getItem(WORLD[this.world]) ?? ''}
            `;
    }

    getComputedStyles(): string {
        return `
        ${this.getAnimalStyles()}
            ${this.stakingItemProperties.styles}
            ${getStyles(WORLD[this.world]) ?? ''}
            `;
    }

    getBodyParts(): string {
        if (this.isStaked && JACKPOTS(this.ANIMAL_PATH).includes(`${this.genotype}_PERCHED.svg`)) {
            return readFile(getCompleteAnimalPath, this.ANIMAL_PATH, `${this.genotype}_PERCHED`);
        }
        if (this.isStaked && JACKPOTS(this.ANIMAL_PATH).includes(`${this.genotype}_ON_PERCH.svg`)) {
            return readFile(getCompleteAnimalPath, this.ANIMAL_PATH, `${this.genotype}_ON_PERCH`);
        }
        if (JACKPOTS(this.ANIMAL_PATH).includes(`${this.genotype}.svg`)) {
            return readFile(getCompleteAnimalPath, this.ANIMAL_PATH, this.genotype);
        }
        if (this.genotype in JACKPOT_ALIAS) {
            return readFile(getCompleteAnimalPath, AnimalPaths.DUCK, JACKPOT_ALIAS[this.genotype]);
        }

        return this.getComputedBodyParts();
    }

    getComputedAnimal(): string {
        return this.ANIMAL_PATH === AnimalPaths.DUCK
            ? `
            ${this.getBackground()}
            ${this.stakingItemProperties.back}
            ${this.getBodyParts()}
            ${this.stakingItemProperties.front}
            ${this.getFirstLayer()}
            ${getItem(this.items.PET) ?? ''}
            `
            : `
            ${this.getBackground()}
            ${this.stakingItemProperties.image}
            ${this.getBodyParts()}
            ${this.getFirstLayer()}
            ${getItem(this.items.PET) ?? ''}
        `;
    }
}

export default AnimalImageGenerator;
