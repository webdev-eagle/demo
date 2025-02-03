import { Worlds } from '$shared/enums';
import type { DuckConnections } from '$shared/types';

import type { MutariumProperties, StakingItemProperties } from '../types';
import { fileResolver, folderContents, readFile } from '../utils';
import { COMMON_DUCK_STYLE, DUCK_PARAMETER, WORLD } from './imageGenerator/constants';
import { COMMON_TURTLE_STYLE, TURTLE_PARAMETER } from './imageGenerator/constantsTurtle';
import { COMMON_CANINE_STYLE, CANINE_PARAMETER } from './imageGenerator/constantsCanine';
import { COMMON_FELINE_STYLE, FELINE_PARAMETER } from './imageGenerator/constantsFeline';


const STYLES = folderContents('/styles');
const ITEMS = folderContents('/items');

const getItemPath = fileResolver((name: string) => `/items/${name}.svg`);

const getStylesPath = fileResolver((name: string) => `/styles/${name}.css`);

const getStyles = (name: string): string | undefined =>
    STYLES.includes(`${name}.css`) ? readFile(getStylesPath, name) : undefined;
const getItem = (name: string): string | undefined =>
    ITEMS.includes(`${name}.svg`) ? readFile(getItemPath, name) : undefined;

class MutantImageGenerator {
    protected genotype: string;

    protected geneParts: string[];

    protected isBattleGrounds?: boolean;

    protected mutariumColor?: string;

    protected mutariumProperties?: MutariumProperties;

    protected world?: Worlds;

    protected druck?: string;

    protected items?: DuckConnections;

    protected grayscale?: boolean;

    protected countStyle: number;

    protected classStyle: string;

    constructor(
        genotype: string,
        options: {
            mutariumColor?: string;
            mutariumProperties?: StakingItemProperties;
            world?: Worlds;
            druck?: string;
            items?: DuckConnections;
            grayscale?: boolean;
        } = {},
    ) {
        const druck = options.druck ?? '1';
        const isInWorld = options.world !== Worlds.None;
        this.countStyle = 0;
        this.classStyle = '';
        this.genotype = genotype;
        this.geneParts = genotype.split('').map((gene) => (gene !== 'I' ? gene : `I_${druck}`));
        this.isBattleGrounds = !isInWorld && !!options.mutariumColor;
        this.mutariumColor = options.mutariumColor ?? null;
        this.mutariumProperties = !isInWorld
            ? (options.mutariumProperties as MutariumProperties)
            : { styles: '', image: '' };
        this.world = options.world ?? Worlds.None;
        this.druck = druck;
        this.items = options.items ?? {};
        this.grayscale = options.grayscale;
    }

    protected getBackground(): string {
        return '';
    }

    protected getFirstLayer(): string {
        return '';
    }

    protected getLeftWing(): string {
        const geneClass = this.geneParts[10];
        const gene = this.geneParts[11];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.leftWing[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.leftWing[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.leftWing[gene];
        }
        return FELINE_PARAMETER.leftWing[gene];
    }

    protected getTail(): string {
        const geneClass = this.geneParts[14];
        const gene = this.geneParts[15];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.tail[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.tail[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.tail[gene];
        }
        return FELINE_PARAMETER.tail[gene];
    }

    protected getRightWing(): string {
        const geneClass = this.geneParts[12];
        const gene = this.geneParts[13];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.rightWing[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.rightWing[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.rightWing[gene];
        }
        return FELINE_PARAMETER.rightWing[gene];
    }

    protected getEyes(): string {
        const geneClass = this.geneParts[4];
        const gene = this.geneParts[5];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.eyes[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.eyes[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.eyes[gene];
        }
        return FELINE_PARAMETER.eyes[gene];
    }

    protected getBeak(): string {
        const geneClass = this.geneParts[6];
        const gene = this.geneParts[7];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.beak[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.beak[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.beak[gene];
        }
        return FELINE_PARAMETER.beak[gene];
    }

    protected getEyebrows(): string {
        const geneClass = this.geneParts[2];
        const gene = this.geneParts[3];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.eyebrows[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.eyebrows[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.eyebrows[gene];
        }
        return FELINE_PARAMETER.eyebrows[gene];
    }

    protected getBody(): string {
        const geneClass = this.geneParts[8];
        const gene = this.geneParts[9];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.body[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.body[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.body[gene];
        }
        return FELINE_PARAMETER.body[gene];
    }

    protected getHead(): string {
        const geneClass = this.geneParts[8];
        const gene = this.geneParts[9];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.head[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.head[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.head[gene];
        }
        return FELINE_PARAMETER.head[gene];
    }

    protected getAccessory(): string {
        const geneClass = this.geneParts[8];
        const gene = this.geneParts[9];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.accessories[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.accessories[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.accessories[gene];
        }
        return FELINE_PARAMETER.accessories[gene];
    }

    protected getOnHead(): string {
        const geneClass = this.geneParts[0];
        const gene = this.geneParts[1];
        if (geneClass == 'D') {
            return DUCK_PARAMETER.onHead[gene.toUpperCase()];
        } else if (geneClass == 'T') {
            return TURTLE_PARAMETER.onHead[gene.toUpperCase()];
        } else if (geneClass == 'C') {
            return CANINE_PARAMETER.onHead[gene];
        }
        return FELINE_PARAMETER.onHead[gene];
    }

    protected getMutantStyles(): string {
        if (this.isBattleGrounds && STYLES.includes(`${this.genotype}_BATTLEGROUNDS.css`)) {
            return readFile(getStylesPath, `${this.genotype}_BATTLEGROUNDS`);
        }
        if (this.isBattleGrounds && STYLES.includes(`${this.genotype}_BATTLEGROUNDS.css`)) {
            return readFile(getStylesPath, `${this.genotype}_BATTLEGROUNDS`);
        }

        if (STYLES.includes(`${this.genotype}.css`)) {
            return readFile(getStylesPath, this.genotype);
        }

        const getFinalStyle = () => {
            const getPairStyles = (geneParts, index) => {
                const geneClass = geneParts[index];
                const gene = geneParts[index + 1];

                if (!gene) {
                    console.error(`Undefined gene at index ${index + 1}`);
                    return [];
                }

                if (geneClass == 'D') {
                    return COMMON_DUCK_STYLE[gene.toUpperCase()] || [];
                } else if (geneClass == 'T') {
                    return COMMON_TURTLE_STYLE[gene.toUpperCase()] || [];
                } else if (geneClass == 'C') {
                    return COMMON_CANINE_STYLE[gene.toUpperCase()] || [];
                }
                return COMMON_FELINE_STYLE[gene.toUpperCase()] || [];
            };

            let styles = [];

            for (let i = 0; i < this.geneParts.length; i += 2) {
                styles = styles.concat(getPairStyles(this.geneParts, i));
            }

            styles = styles.concat(Object.values(this.items).map(getStyles));
            const result = styles.join('\n');

            return result;
        };

        return getFinalStyle();
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
            ${getItem(this.items.PET) ?? ''}
            ${getItem(WORLD[this.world]) ?? ''}`;
    }

    getComputedStyles(): string {
        return `
            ${this.getMutantStyles()}
            ${this.mutariumProperties.styles}
            ${getStyles(WORLD[this.world]) ?? ''}`;
    }

    getBodyParts(): string {
        return this.getComputedBodyParts();
    }

    getComputedMutant(): string {
        return `
            ${this.getBackground()}
            ${this.mutariumProperties.image}
            ${this.getBodyParts()}
            ${this.getFirstLayer()}
            `;
    }

    isLowerCase(str: string): boolean {
        return str === str.toLowerCase() && str !== str.toUpperCase();
    }
}

export default MutantImageGenerator;
