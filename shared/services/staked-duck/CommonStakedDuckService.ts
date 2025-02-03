import { getAddress } from '../../domain/constants';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type CommonHelperService from '../helper';
import type { Duck, DuckOwner, StakedDuck } from './data-types';

const STAKED_DUCK_DAPP_ADDRESS = getAddress('SDUCK_DAPP');

abstract class CommonStakedDuckService extends AbstractDataFetcher {
    protected abstract helperService: CommonHelperService;
    protected DAPP_ADDRESS = STAKED_DUCK_DAPP_ADDRESS;

    fetchDuckOwner = (duckId: duckId) => this.fetchDataByKey<DuckOwner>(`duck_${duckId}_owner`);

    fetchDuckByStakedDuck = (sduckId: sduckId) => this.fetchDataByKey<Duck>(`nft_${sduckId}_duckId`);

    fetchStakedDuck = (duckId: duckId) => this.fetchDataByKey<StakedDuck>(`duck_${duckId}_sduckId`);
}

export default CommonStakedDuckService;
