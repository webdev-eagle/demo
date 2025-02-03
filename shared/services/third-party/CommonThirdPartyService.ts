import { getDataKeyPart, getKeyPart } from '../../domain/contract-data';
import { toRecord } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { AllData, BoughtItems, DuckOwner, LockedDuckStatus, UnlockTime, UsedItems } from './data-types';

abstract class CommonThirdPartyService extends AbstractDataFetcher<AllData> {
    getStatic = this.createStaticGetter({
        accessItemPrice: 'static_accessItemPrice',
    } as const);

    fetchDuckOwner = (duckId: duckId) => this.fetchDataByKey<DuckOwner>(`duck_${duckId}_owner`);

    fetchDuckUnlockTime = (duckId: duckId) => this.fetchDataByKey<UnlockTime>(`duck_${duckId}_unlockTime`);

    fetchLockedDucksIds = async (address: addressId): Promise<duckId[]> => {
        const lockedDuckStatuses = await this.fetchDataMatch<LockedDuckStatus>(
            `address_${address}_lockedDuck_.*?_status`,
        );

        return lockedDuckStatuses.map(getDataKeyPart(3));
    };

    fetchLockedDuckParams = async (duckId: duckId) => {
        const duckOwnerContract = await this.fetchDuckOwner(duckId);

        if (!duckOwnerContract) {
            return;
        }

        const unlockTimeContract = await this.fetchDuckUnlockTime(duckId);

        return {
            owner: duckOwnerContract.value,
            unlockTime: unlockTimeContract?.value ?? 0,
        };
    };

    fetchAvailableItemsNumber = async (address: string): Promise<number> => {
        const keys = await this.fetchDataByKeys<BoughtItems | UsedItems>([
            `address_${address}_spotsBought`,
            `address_${address}_spotsBusy`,
        ]);

        const values = toRecord(keys, getDataKeyPart(2), ({ value }) => value);

        return (values.spotsBought ?? 0) - (values.spotsBusy ?? 0);
    };

    fetchLockedDucksOwners = async (): Promise<{ [key: duckId]: addressId }> => {
        const lockedDuckStatuses = await this.fetchDataMatch<LockedDuckStatus>(`address_.*?_lockedDuck_.*?_status`);

        return lockedDuckStatuses.reduce((acc, item) => {
            const accumulator = acc;
            accumulator[getKeyPart(item.key, 3)] = getKeyPart(item.key, 1);
            return accumulator;
        }, {});
    };
}

export default CommonThirdPartyService;
