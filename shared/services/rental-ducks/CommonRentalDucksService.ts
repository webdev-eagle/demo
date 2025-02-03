import { getAddress } from '$shared/domain/constants';
import {
    ICachedMarketplaceDuck,
    ICachedMyRentedDucksResponse,
    ICachedRentalMarketplaceResponse,
    RentalSCStaticKeys,
} from '$shared/types/marketplaces';
import { urlString } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type CommonHelperService from '../helper';
import type { AssetDebtId } from './data-types';

const RENT_DAPP_ADDRESS = getAddress('RENT_DAPP_ADDRESS');

abstract class CommonRentalDucksService extends AbstractDataFetcher {
    protected abstract helperService: CommonHelperService;
    protected DAPP_ADDRESS = RENT_DAPP_ADDRESS;
    fetchRentalDucks = async (filters, page = 1, size = 1000) => {
        const {
            data: { data: ducks },
        } = await this.helperService.http.get<ICachedRentalMarketplaceResponse>(
            urlString(`${this.helperService.API_URL}/v1/rental-place`, {
                ...filters,
                page,
                size,
            }),
        );

        return ducks;
    };

    fetchOneRentalDuck = async (duckId: string) => {
        const { data } = await this.helperService.http.get<Partial<ICachedMarketplaceDuck>>(
            urlString(`${this.helperService.API_URL}/v1/rental-place/${duckId}`),
        );

        return data;
    };

    fetchDucksRentedByUser = async (userAddress: string) => {
        const {
            data: { data: { data: ducks, pagination } = { data: [] } },
        } = await this.helperService.http.get<ICachedMyRentedDucksResponse>(
            `${this.helperService.API_URL}/v2/addresses/${userAddress}/ducks/rentedByMe`,
        );
        return ducks;
    };

    getRentalSCStaticKeys = async (): Promise<RentalSCStaticKeys> => {
        const { data: staticKeys } = await this.helperService.fetchData(
            urlString(`addresses/data/${RENT_DAPP_ADDRESS}`, {
                key: ['static_rentSlots', 'static_minPercentage', 'static_maxPercentage', 'static_depositSteps'],
            }),
        );

        return staticKeys.reduce((acc, { key, value }) => {
            switch (key) {
                case 'static_rentSlots':
                    acc.initialRentSlotsCount = value;
                    break;
                case 'static_minPercentage':
                    acc.minRewardPercentage = value;
                    break;
                case 'static_maxPercentage':
                    acc.maxRewardPercentage = value;
                    break;
                case 'static_depositSteps':
                    acc.depositSteps = value;
                    break;
                default:
                    break;
            }
            return acc;
        }, {});
    };

    getDebtDuck = async (AssetId: string) => {
        const entries = await this.fetchDataMatch<AssetDebtId>(`access_funded_${AssetId}`, { avoidCache: true });
        if (entries.length > 0) {
            const value = entries[0].value;
            return value;
        } else {
            return false;
        }
    };
}

export default CommonRentalDucksService;
