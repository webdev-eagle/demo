import { ADDRESS } from '$shared/constants';
import { IDappAddress } from '$shared/types/burnedEggs';
import { getEnv } from '$shared/utils';
import { getAddress } from '../../domain/constants';
import AbstractDataFetcher from '../AbstractDataFetcher';
import { BurnedEgg } from './data-types';

const BURN_DAPP_ADDRESS = getAddress('BURN_DAPP');

abstract class CommonBurnedEggsService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = BURN_DAPP_ADDRESS;
    fetchBurnedEggs = async (): Promise<IDappAddress[]> => {
        const results = await this.fetchDataMatch<BurnedEgg>('BURN_DAPP_.*');
        const dappAddress = results.map((dappAddress) => {
            const address = dappAddress.key.split('_')[2];
            const key = this.getNameAddressByValue(address) || address;
            const value = Number((dappAddress.value / 1e8).toFixed(2));
            return { key, value };
        });
        const distinctKeys = [...new Set(dappAddress.map((dapp) => dapp.key))];
        const burnedEggsTotalValue = distinctKeys.map((key) => {
            return { key, value: this.getTotalDappValue(dappAddress, key) };
        });
        return burnedEggsTotalValue;
    };

    private getNameAddressByValue = (value: string): string | undefined => {
        const address = ADDRESS[getEnv().toUpperCase()];
        const name = Object.keys(address).find((key) => address[key] === value);
        if (!name) return undefined;
        let formattedName = name.toLowerCase().split('_').join(' ');
        formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
        return formattedName;
    };

    private getTotalDappValue = (dappList: IDappAddress[], key: string): number => {
        const filteredValues = dappList.filter((dapp) => dapp.key === key);
        const total = filteredValues.map((dapp) => dapp.value).reduce((a, b) => a + b, 0);
        return total;
    };
}

export default CommonBurnedEggsService;
