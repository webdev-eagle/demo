import type { RecordByEnv } from '../types';

export type EthereumVars = {
    CHAIN_ID: number;
    DUCKS_ADDRESS: string;
};

const ETHEREUM_VARS: RecordByEnv<EthereumVars> = {
    DEVELOPMENT: {
        CHAIN_ID: 0x4, // rinkeby
        DUCKS_ADDRESS: '0x4970841E0B1e20918E3717A764d3d6272088bCB8',
    },
    PRODUCTION: {
        CHAIN_ID: 0x1, // eth
        DUCKS_ADDRESS: '0x7740a504FCFFF8eFfddaa85B820d7FC0b6559493',
    },
    TEST: {
        CHAIN_ID: 0x4, // rinkeby
        DUCKS_ADDRESS: '0x4970841E0B1e20918E3717A764d3d6272088bCB8',
    },
} as const;

export default ETHEREUM_VARS;
