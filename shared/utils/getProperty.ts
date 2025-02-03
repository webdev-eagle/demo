export function getProperty(argObject, argKeys, defaultVal) {
    const keys = Array.isArray(argKeys) ? argKeys : argKeys.split('.');
    const object = argObject[keys[0]];
    if (object && keys.length > 1) {
        return getProperty(object, keys.slice(1), '');
    }
    return object === undefined ? defaultVal : object;
}
