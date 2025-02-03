import { fileResolver, folderContents, readFile } from '../utils';

const JACKPOTS = folderContents('/ducks/complete');
const PERCH_PART = folderContents('/vPerches');

const getVPerchPartPath = fileResolver(
    (type: string, fileName: 'back.svg' | 'front.svg' | 'styles.css') => `/vPerches/P/${fileName}`,
);

const getVPerchPart = (type: string, fileName: 'back.svg' | 'front.svg' | 'styles.css') =>
    PERCH_PART.includes('P') && folderContents(`/vPerches/${type}`).includes(fileName)
        ? readFile(getVPerchPartPath, type, fileName)
        : '';

class VPerchImageGenerator {
    protected duckGenotype: string;

    protected perchColor: string | null;

    styles = '';

    back = '';

    front = '';

    constructor({ duckGenotype, perchColor = null }: { duckGenotype?: string; perchColor?: string | null }) {
        this.perchColor = perchColor;
        this.duckGenotype = duckGenotype ?? '';

        if (!JACKPOTS.includes(`${duckGenotype}_ON_VPERCH.svg`)) {
            if (PERCH_PART.includes(duckGenotype)) {
                this.styles = getVPerchPart(duckGenotype, 'styles.css');
                this.back = getVPerchPart(duckGenotype, 'back.svg');
                this.front = getVPerchPart(duckGenotype, 'front.svg');
            } else if (PERCH_PART.includes('P')) {
                this.styles = getVPerchPart('P', 'styles.css');
                this.back = getVPerchPart('P', 'back.svg');
                this.front = getVPerchPart('P', 'front.svg');
            }
        }
    }
}

export default VPerchImageGenerator;
