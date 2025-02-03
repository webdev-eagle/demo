import { fileResolver, folderContents, readFile } from '../utils';

const DUCKLINGS = folderContents('/ducklings');

const getDucklingPath = fileResolver((name: string) => `/ducklings/${name}.svg`);
const getDuckling = (name: string): string | undefined =>
    DUCKLINGS.includes(`${name}.svg`) ? readFile(getDucklingPath, name) : undefined;

class DucklingImageGenerator {
    name: string;

    stage: number;

    constructor(name: string, params: { stage: number }) {
        this.name = name;
        this.stage = params.stage;
    }

    getDucklingImage(): string {
        return getDuckling(`duckling-${this.stage}`);
    }
}

export default DucklingImageGenerator;
