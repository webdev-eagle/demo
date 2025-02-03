import { getAddress } from '../../domain/constants';
import type { DucklingParams, IDuckling, IWithLevel } from '../../types';
import { split } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { AllData, DucklingBlacklisted, DucklingLevel, DucklingStartPercentage } from './data-types';

const BREEDING_BABY_DUCKS_DAPP_ADDRESS = getAddress('BREEDING_BABY_DUCKS_DAPP');

abstract class CommonBredDucklingService extends AbstractDataFetcher<AllData> {
    DAPP_ADDRESS = BREEDING_BABY_DUCKS_DAPP_ADDRESS;

    getStatic = this.createStaticGetter({
        globalIssuedTimestamp: 'global_issued_timestamp',
    } as const);

    /**
     * Returns the level of ducks
     * @param {Array<IDuckling>} ducklings
     * @return {Promise<Array<(IDuckling) & IWithLevel>>}
     */
    addDucklingsParams = async <T extends { assetId: assetId }>(ducklings: T[]): Promise<Array<T & DucklingParams>> => {
        const ducklingKeys = await this.fetchDataByKeys<DucklingLevel | DucklingBlacklisted | DucklingStartPercentage>(
            Object.values(ducklings).flatMap((duckling) => [
                `duckling_${duckling.assetId}_level`,
                `duckling_${duckling.assetId}_blacklisted`,
                `duckling_${duckling.assetId}_startPercentage`,
            ]),
        );

        const ducklingsById: Record<ducklingId, { level: number; blacklisted: boolean; startPercentage: number }> =
            ducklingKeys.reduce((res, { key, value }) => {
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
            const level = ducklingsById[assetId]?.level ?? 0;
            const levelVal = level > 0 ? level / 1e8 : 0;
            const startPercentage = ducklingsById[assetId]?.startPercentage ?? 0;

            return {
                ...duckling,
                level: levelVal === 0 ? startPercentage : levelVal,
                blacklisted: ducklingsById[assetId]?.blacklisted ?? false,
            };
        });
    };
}

export default CommonBredDucklingService;
