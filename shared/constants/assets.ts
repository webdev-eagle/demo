import type { RecordByEnv } from '../types';
import { EGG_DECIMALS, WAVES_DECIMALS } from './common';

export type Assets = {
    EGG: string;
    OLD_EGG: string;
    SPICE: string;
    BTC: string;
    ETH: string;
    USDT: string;
    XTN: string;
    WAVES: string;
    PETE: string;
    STREET: string;
    FOMO: string;
    KOLKHOZ: string;
    TURTLE: string;
    LATAM: string;
    EGGPOINT: string;
    DUXPLORER: string;
};

export const ASSET: RecordByEnv<Assets> = {
    DEVELOPMENT: {
        OLD_EGG: '53bLXGQhnMxAoiWnza2SJQRp7hNQZVHnyrRziLmwdVjb',
        EGG: 'Ag7HEcF5ewbQ84uczdJ2DBG2LA2riks2DtchM2A222vM',
        SPICE: 'HU8e8oyixyYTD93kjmBfBejhNbRE2qacTzgEyjjTogk7',
        BTC: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        ETH: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
        USDT: '9wc3LXNA4TEBsXyKtoLE9mrbDD7WMHXvXrCjZvabLAsi',
        XTN: 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
        WAVES: 'WAVES',
        PETE: 'CS4Md7Bub7fsVZft2cDbTmKeSi6UnYKQQLYnAukKzgST',
        STREET: 'BZwEiYViUJR1uBigfaX6CukijBqnNwCzfTNEoGDwyRJB',
        FOMO: '4YjKK22V4MMDjPh6HmF6nG7CQ6DrAxDzBaiikC4qyidQ',
        KOLKHOZ: '6aYkdeQtKXhZ2eyy9JpuLsFjjuXYSe7Tamdk49H2uzvU',
        TURTLE: 'DtdhNw3fQNFriXidkLaoU5uCQBa7MiahjyQzxqms7GHy',
        LATAM: '3pR8ATgoDzGC6NYMbxPgekGpyDRREKVTMhZB2w4762SZ',
        EGGPOINT: 'FNMf6j59bWuJVbeG3ScygjncusccrCcAEbXYtB7C9Rth',
        DUXPLORER: '45CYij99p2V8sdiRszj9oq5Z2E8GqbFmQ8MakUbaJ8Nw',
    },
    PRODUCTION: {
        OLD_EGG: 'JCGDtrVy64cCJ1wCKfCaiNQMnyYwii71TbE5QeAHfxgF',
        EGG: 'C1iWsKGqLwjHUndiQ7iXpdmPum9PeCDFfyXBdJJosDRS',
        SPICE: '6jsmMsMfpJWqxSGyxrkTvH5zZyaQd2P6VEY9fBz2T8FB',
        BTC: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        ETH: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
        USDT: '9wc3LXNA4TEBsXyKtoLE9mrbDD7WMHXvXrCjZvabLAsi',
        XTN: 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
        WAVES: 'WAVES',
        PETE: 'GAzAEjApmjMYZKPzri2g2VUXNvTiQGF7KDYZFFsP3AEq',
        STREET: 'DAGQvqQg4F5YTQCQ5JFaVJdZEVoTvecuw2W9ybL5P1hR',
        FOMO: 'J4iWJS2kGmAqLC4dYFuHvmqXK1E6rBJaRTA6nd1VmFkj',
        KOLKHOZ: 'BwCk5zUMTuYtFFu3euo3g6Fwdk7TALrr5C8wvdzps8R5',
        TURTLE: '9mFbBseP3RSC2veLrBgiLJMXDjahwBiH44WnqMfdkgid',
        LATAM: '5JQ8yUY4vnB19s4bXSGVYsNEyA9Bag6jbMtVEgFHvYM7',
        EGGPOINT: '6pHc1PyBcXyS74eBEo95V3ecQvhAypL9RfsUUKtHDUq2',
        DUXPLORER: 'usUeJwSpvghP5FR6jE9X4fUJbgXyxXnAezSgbzoMA8K',
    },
    TEST: {
        OLD_EGG: '53bLXGQhnMxAoiWnza2SJQRp7hNQZVHnyrRziLmwdVjb',
        EGG: 'Ag7HEcF5ewbQ84uczdJ2DBG2LA2riks2DtchM2A222vM',
        SPICE: 'HU8e8oyixyYTD93kjmBfBejhNbRE2qacTzgEyjjTogk7',
        BTC: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        ETH: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
        USDT: '9wc3LXNA4TEBsXyKtoLE9mrbDD7WMHXvXrCjZvabLAsi',
        XTN: 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
        WAVES: 'WAVES',
        PETE: 'CS4Md7Bub7fsVZft2cDbTmKeSi6UnYKQQLYnAukKzgST',
        STREET: 'BZwEiYViUJR1uBigfaX6CukijBqnNwCzfTNEoGDwyRJB',
        FOMO: '4YjKK22V4MMDjPh6HmF6nG7CQ6DrAxDzBaiikC4qyidQ',
        KOLKHOZ: '6aYkdeQtKXhZ2eyy9JpuLsFjjuXYSe7Tamdk49H2uzvU',
        TURTLE: 'DtdhNw3fQNFriXidkLaoU5uCQBa7MiahjyQzxqms7GHy',
        LATAM: '3pR8ATgoDzGC6NYMbxPgekGpyDRREKVTMhZB2w4762SZ',
        EGGPOINT: 'FNMf6j59bWuJVbeG3ScygjncusccrCcAEbXYtB7C9Rth',
        DUXPLORER: '45CYij99p2V8sdiRszj9oq5Z2E8GqbFmQ8MakUbaJ8Nw',
    },
};

export const DECIMAL: Record<keyof Assets, integer> = {
    EGG: EGG_DECIMALS,
    WAVES: WAVES_DECIMALS,
    SPICE: 1e8 as integer,
    BTC: 1e8 as integer,
    ETH: 1e8 as integer,
    OLD_EGG: 1e2 as integer,
    USDT: 1e6 as integer,
    XTN: 1e6 as integer,
    PETE: 1e8 as integer,
    STREET: 1e8 as integer,
    FOMO: 1e8 as integer,
    KOLKHOZ: 1e8 as integer,
    TURTLE: 1e8 as integer,
    LATAM: 1e8 as integer,
    EGGPOINT: 1e8 as integer,
    DUXPLORER: 1e8 as integer,
};
