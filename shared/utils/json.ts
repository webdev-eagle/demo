import CausedError from '../structures/CausedError';
import { isDevEnv } from './env';

export const parseJSON = <T>(jsonString: stringed<T>, defaultValue?: T): T => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        const error = new CausedError(`Could not parse JSON string ${jsonString}`, { cause: e });

        if (isDevEnv()) {
            console.error(error);
            throw error;
        }

        if (typeof defaultValue !== 'undefined') {
            return defaultValue;
        }

        throw error;
    }
};

export const stringifyJSON = <T>(value: T): stringed<T> => {
    return JSON.stringify(value) as stringed<T>;
};
