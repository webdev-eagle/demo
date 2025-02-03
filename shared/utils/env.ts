export const getEnv = () => process.env.ENV_TYPE || process.env.NODE_ENV || 'production';

export const isDevEnv = () => isDevOnlyEnv() || isTestOnlyEnv();

export const isDevOnlyEnv = () => getEnv() === 'development';

export const isTestOnlyEnv = () => getEnv() === 'test';

export const isProdEnv = () => getEnv() === 'production' && !process.env.LOCAL_PROD;
