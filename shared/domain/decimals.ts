import { Assets } from '../constants';

const DECIMALS: Record<keyof Assets, number> = {
    BTC: 1e8,
    EGG: 1e8,
    OLD_EGG: 1e8,
    ETH: 1e8,
    XTN: 1e6,
    USDT: 1e6,
    WAVES: 1e8,
    SPICE: 1e8,
    PETE: 1e8,
    STREET: 1e8,
    FOMO: 1e8,
    KOLKHOZ: 1e8,
    TURTLE: 1e8,
    LATAM: 1e8,
    EGGPOINT: 1e8,
    DUXPLORER: 1e8,
};

export default DECIMALS;
