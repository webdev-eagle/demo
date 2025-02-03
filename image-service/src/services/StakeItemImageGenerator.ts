import { StakingItemProperties } from '../types';
import { AnimalPaths, AnimalSubPaths, FileNames } from '../types/animals';
import { fileResolver, folderContents, readFile } from '../utils';

const STAKING_ITEM_PART = (animalPath: AnimalPaths) => folderContents(AnimalSubPaths[animalPath].stakingItemPath);

const getStakingPath = fileResolver(
    (animalPath: AnimalPaths, type: string, fileName: FileNames) =>
        `${AnimalSubPaths[animalPath].stakingItemPath}/${type}/${fileName}`,
);

const JACKPOTS = (animalPath: AnimalPaths) => folderContents(`/${animalPath}/complete`);

const getStakingItemPart = (animalPath: AnimalPaths, type: string, fileName: FileNames) =>
    STAKING_ITEM_PART(animalPath).includes(type) &&
    folderContents(`${AnimalSubPaths[animalPath].stakingItemPath}/${type}`).includes(fileName)
        ? readFile(getStakingPath, animalPath, type, fileName)
        : '';

class StakeItemImageGenerator {
    private properties: StakingItemProperties;

    protected animalGenotype: string;

    protected stakingItemColor: string | null;

    constructor({
        animalGenotype,
        stakingItemColor = null,
        animalPath,
    }: {
        animalGenotype?: string;
        stakingItemColor?: string | null;
        animalPath: AnimalPaths;
    }) {
        this.stakingItemColor = stakingItemColor;
        this.animalGenotype = animalGenotype;
        if (!JACKPOTS(animalPath).includes(`${animalGenotype}_ON_PERCH.svg`)) {
            if (animalPath === AnimalPaths.DUCK) {
                if (STAKING_ITEM_PART(animalPath).includes(animalGenotype)) {
                    this.properties = {
                        styles: getStakingItemPart(animalPath, animalGenotype, 'styles.css'),
                        front: getStakingItemPart(animalPath, animalGenotype, 'front.svg'),
                        back: getStakingItemPart(animalPath, animalGenotype, 'back.svg'),
                    };
                } else if (STAKING_ITEM_PART(animalPath).includes(stakingItemColor)) {
                    this.properties = {
                        styles: getStakingItemPart(animalPath, stakingItemColor, 'styles.css'),
                        front: getStakingItemPart(animalPath, stakingItemColor, 'front.svg'),
                        back: getStakingItemPart(animalPath, stakingItemColor, 'back.svg'),
                    };
                } else {
                    this.properties = {
                        styles: '',
                        front: '',
                        back: '',
                    };
                }
            } else if (STAKING_ITEM_PART(animalPath).includes(animalGenotype)) {
                this.properties = {
                    styles: getStakingItemPart(animalPath, animalGenotype, 'styles.css'),
                    image: getStakingItemPart(animalPath, animalGenotype, 'image.svg'),
                };
            } else if (STAKING_ITEM_PART(animalPath).includes(stakingItemColor)) {
                this.properties = {
                    styles: getStakingItemPart(animalPath, stakingItemColor, 'styles.css'),
                    image: getStakingItemPart(animalPath, stakingItemColor, 'image.svg'),
                };
            } else {
                this.properties = {
                    styles: '',
                    image: '',
                };
            }
        }
    }

    getProperties(): StakingItemProperties {
        return this.properties;
    }
}

export default StakeItemImageGenerator;
