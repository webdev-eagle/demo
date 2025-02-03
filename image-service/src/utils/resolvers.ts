import fs from 'fs';
import path from 'path';

const ASSETS_FOLDER_PATH = './src/assets';

export function readFile(path: string): string;
export function readFile<Args extends any[]>(getPath: (...args: Args) => string, ...args: Args): string;
export function readFile<Args extends any[]>(
    pathOrGetter: string | ((...args: Args) => string),
    ...args: Args
): string {
    const path = typeof pathOrGetter === 'string' ? pathOrGetter : pathOrGetter(...args);

    return fs.readFileSync(path, { encoding: 'utf-8' });
}

export const fileResolver =
    <Args extends any[]>(pathGetter: (...args: Args) => string): ((...args: Args) => string) =>
    (...args) =>
        path.resolve(__dirname, `${ASSETS_FOLDER_PATH}${pathGetter(...args)}`);

export const folderContents = (folderPath: string): string[] => {
    const absolutePath = path.resolve(__dirname, `${ASSETS_FOLDER_PATH}${folderPath}`);

    if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
        return fs.readdirSync(absolutePath);
    }
    return [];
};
