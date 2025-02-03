import { getAddress } from './constants';

const CANINES_BREEDER_DAPP = getAddress('CANINES_BREEDER_DAPP');
const CANINES_INCUBATOR_DAPP = getAddress('CANINES_INCUBATOR_DAPP');
const FELINES_INCUBATOR_DAPP = getAddress('FELINES_INCUBATOR_DAPP');
const FELINES_FARMING_DAPP = getAddress('FELINES_FARMING_DAPP');
const DUCK_BREEDER_DAPP_ADDRESS = getAddress('DUCK_BREEDER_DAPP');
const DUCK_INCUBATOR_DAPP_ADDRESS = getAddress('DUCK_INCUBATOR_DAPP');
const TURTLES_INCUBATOR_DAPP_ADDRESS = getAddress('TURTLES_INCUBATOR_DAPP');
const TURTLES_FARMING_DAPP_ADDRESS = getAddress('TURTLES_FARMING_DAPP');

const arrayDapp = [
    CANINES_BREEDER_DAPP,
    CANINES_INCUBATOR_DAPP,
    FELINES_FARMING_DAPP,
    FELINES_INCUBATOR_DAPP,
    DUCK_BREEDER_DAPP_ADDRESS,
    DUCK_INCUBATOR_DAPP_ADDRESS,
    TURTLES_INCUBATOR_DAPP_ADDRESS,
    TURTLES_FARMING_DAPP_ADDRESS,
];

export const isFakeAnimal = ({ issuer }: { issuer: string }) => arrayDapp.every((item) => item !== issuer);

export const isJackpot = (name: string) => !!name.split('-')[2] && name.endsWith('JU');
