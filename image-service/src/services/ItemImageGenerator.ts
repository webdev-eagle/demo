import { fileResolver, folderContents, readFile } from '../utils';

const ITEMS = folderContents('/items');
const STYLES = folderContents('/styles');

const getItemPath = fileResolver((name: string) => `/items/${name}.svg`);
const getStylesPath = fileResolver((name: string) => `/styles/${name}.css`);

const getStyles = (name: string): string | undefined =>
    STYLES.includes(`${name}.css`) ? readFile(getStylesPath, name) : undefined;
const getItem = (name: string): string | undefined =>
    ITEMS.includes(`${name}.svg`) ? readFile(getItemPath, name) : undefined;

type ItemType = 'ART' | 'ACCESS-HUNT' | 'ACCESS-RACE' | 'MANTLE';

class ItemImageGenerator {
    private static LARGE_ARTEFACTS = [
        'ART-LAKE',
        'ART-HOUSE',
        'ART-BIGHOUSE',
        'ART-FIXGENE',
        'ART-FREEGENE',
        'ART-MIRROR',
        'ART-CUSTOMDUCK',
        'ART-XMISTL',
        'ART-XSOCK',
        'ART-XTREE',
        'ART-CUST-COSM',
        'ART-BONE',
        'ART-BONE1',
        'ART-BONE2',
        'ART-BONE3',
        'ART-BONE4',
        'ART-BONE5',
        'ART-BONE6',
        'ART-BONE7',
        'ART-SKELHEAD',
    ];

    private static getType(name: string): ItemType {
        if (name.startsWith('ART')) {
            return 'ART';
        }
        if (name === 'DUCK-MANTLE-0') {
            return 'MANTLE';
        }
        if (name === 'ACCESS-HUNT') {
            return 'ACCESS-HUNT';
        }
        if (name === 'ACCESS-RACE') {
            return 'ACCESS-RACE';
        }
    }

    name: string;

    type: ItemType;

    constructor(name: string) {
        this.name = name;
        this.type = ItemImageGenerator.getType(name);
    }

    getStyles(): string {
        if (this.type === 'ACCESS-RACE') {
            return getStyles('ACCESS-RACE');
        }
        if (this.type === 'ACCESS-HUNT') {
            return getStyles('GLASSES');
        }
        if (this.type === 'MANTLE') {
            return getStyles('DUCK-MANTLE-0');
        }

        return getStyles(this.name) ?? '';
    }

    getContents(): string {
        if (this.type === 'ACCESS-RACE') {
            return getItem('ACCESS-RACE');
        }
        if (this.type === 'ACCESS-HUNT') {
            return getItem('GLASSES');
        }
        if (this.type === 'MANTLE') {
            return getItem('DUCK-MANTLE-0');
        }

        if (!ITEMS.includes(`${this.name}.svg`)) {
            throw new Error('Item not found');
        }

        return getItem(this.name);
    }

    isLargeItem = (): boolean => !ItemImageGenerator.LARGE_ARTEFACTS.includes(this.name);
}

export default ItemImageGenerator;
