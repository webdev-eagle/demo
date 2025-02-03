type StringedStructure<T> = T extends object
    ? T extends number
        ? string
        : { [K in keyof T]: StringedStructure<T[K]> }
    : string;

export type AppConfigs = {
    CURRENT_HEIGHT: number;
    GUIDE_LINK: {
        BREEDING: string;
        DUCKLING: string;
    };
    DUCK_HUNT: {
        SEND_LOCATION_INTERVAL: number;
        LOCATION_APPROXIMATION: number;
        LAUNCH_DATE: string;
        ROPE_MAX_DISTANCE: number;
        ROPE_MAX_PRICE: number;
    };
    SUPER_RARE: {
        MAIKEL: {
            ASSET_ID: string;
            AUCTION_ID: string;
            AUCTION_END_DATE: string;
        };
    };
    DEV: {
        DISABLE_UI: boolean;
        FEED_LIMIT: integer;
    };
};

const APP_CONFIGS: StringedStructure<AppConfigs> = {
    CURRENT_HEIGHT: 'CURRENT_HEIGHT',
    GUIDE_LINK: {
        BREEDING: '59a7fdd8-f960-445a-bbe3-f92038a4e941',
        DUCKLING: '3ddc8613-19a7-4019-97c5-7aa2d3a64f46',
    },
    DUCK_HUNT: {
        SEND_LOCATION_INTERVAL: '9e619d50-4842-439f-a91b-2134798bd4b1',
        LOCATION_APPROXIMATION: 'e3cb29df-f95b-4564-ace7-327fe03299d7',
        LAUNCH_DATE: '9ef56b28-d814-4b7e-a193-2f63a44868a7',
        ROPE_MAX_DISTANCE: '8b1f60ee-5120-11ed-bdc3-0242ac120002',
        ROPE_MAX_PRICE: '99255b3a-5120-11ed-bdc3-0242ac120002',
    },
    SUPER_RARE: {
        MAIKEL: {
            ASSET_ID: '4c17a742-ce6d-481b-a7e0-a6c1bb61af96',
            AUCTION_ID: '6e47bfd4-bf1d-449c-8ff3-bcbbd50af7ca',
            AUCTION_END_DATE: '9992edab-1281-4251-acf2-3193aaa3e8dd',
        },
    },
    DEV: {
        DISABLE_UI: '84ea32a0-d35e-4736-ace5-5688367ecf65',
        FEED_LIMIT: '246f2437-31ab-48ea-9ab7-2f544986c163',
    },
};

export default APP_CONFIGS;
