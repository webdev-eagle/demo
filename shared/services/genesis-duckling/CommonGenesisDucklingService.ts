import { getAddress } from '../../domain/constants';
import type { DucklingParams, IDuckling, IWithLevel } from '../../types';
import { split } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import { log } from '../log';
import type {
    AddressNonce,
    AllData,
    DucklingBlacklisted,
    DucklingIssuedByFeedCall,
    DucklingLevel,
    DucklingStartPercentage,
} from './data-types';

const BABY_DUCKS_DAPP_ADDRESS = getAddress('BABY_DUCKS_DAPP');

const getLevel = ({
    level,
    issuedByFeedCall,
    startPercentage,
}: {
    level?: string;
    startPercentage?: number;
    issuedByFeedCall?: boolean;
} = {}) => {
    if (level != null) {
        return Number(level) / 1e14;
    }

    if (issuedByFeedCall && startPercentage === 0) {
        return 0;
    }

    if (startPercentage != null) {
        return startPercentage;
    }

    return 20;
};

abstract class CommonGenesisDucklingService extends AbstractDataFetcher<AllData> {
    DAPP_ADDRESS = BABY_DUCKS_DAPP_ADDRESS;

    getStatic = this.createStaticGetter({
        globalIssuedTimestamp: 'global_issued_timestamp',
    } as const);

    /**
     * Returns the level of ducks
     * @param {Array<IDuckling>} ducklings
     * @return {Promise<Array<(IDuckling) & IWithLevel>>}
     */
    addDucklingsParams = async <T extends { assetId: assetId }>(ducklings: T[]): Promise<Array<T & DucklingParams>> => {
        const ducklingKeys = await this.fetchDataByKeys<
            DucklingLevel | DucklingBlacklisted | DucklingStartPercentage | DucklingIssuedByFeedCall
        >(
            Object.values(ducklings).flatMap((duckling) => [
                `duckling_${duckling.assetId}_level`,
                `duckling_${duckling.assetId}_blacklisted`,
                `duckling_${duckling.assetId}_startPercentage`,
                `duckling_${duckling.assetId}_issuedByFeedCall`,
            ]),
        );

        const ducklingsById: Record<
            ducklingId,
            { level?: string; blacklisted?: boolean; startPercentage?: number; issuedByFeedCall?: boolean }
        > = ducklingKeys.reduce((res, { key, value }) => {
            const [, ducklingId, paramName] = split(key, '_');

            return {
                ...res,
                [ducklingId]: {
                    ...res[ducklingId],
                    [paramName]: value,
                },
            };
        }, {});

        return ducklings.map((duckling) => {
            const { assetId } = duckling;

            return {
                ...duckling,
                level: getLevel(ducklingsById[assetId]),
                blacklisted: ducklingsById[assetId]?.blacklisted ?? false,
            };
        });
    };

    getUserNonceForFeed = async (address: addressId): Promise<number> => {
        try {
            const nonce = await this.fetchDataByKey<AddressNonce>(`address_${address}_nonce`, { avoidCache: true });

            if (nonce) {
                return nonce.value + 1;
            }

            return 1;
        } catch (e) {
            log('(getUserNonceForFeed) Returning default nonce');
            return 1;
        }
    };
}

export default CommonGenesisDucklingService;
