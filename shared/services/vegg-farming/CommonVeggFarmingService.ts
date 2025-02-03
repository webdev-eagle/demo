import { getAddress } from '$shared/domain/constants';
import { getKeyPart } from '$shared/domain/contract-data';
import { IFarmingDetailsV2, IFarmingEntriesV2, IFarmingGlobalsV2, IFarmingParamsV2 } from '$shared/types/farms';
import { capitalize, int, split } from '$shared/utils';
import Cache from '../../structures/Cache';
import AbstractDataFetcher from '../AbstractDataFetcher';
import { FarmingGlobalsV2 } from '../farming/data-types';
import { Claimed, FarmingEntries, FarmingGlobals, FarmingPower, LastCheckInterest, Owner } from './data-types';

const VEGG_FARMING_DAPP_ADDRESS = getAddress('VEGG_FARMING_DAPP');

abstract class CommonVeggFarmingService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = VEGG_FARMING_DAPP_ADDRESS;
    private farmingVeggGlobalsCache = new Cache<IFarmingGlobalsV2>({ ttl: 5_000 });

    private addEntry = (
        record: IFarmingEntriesV2,
        paramName: keyof IFarmingEntriesV2 | 'without' | undefined | string,
        value: string | integer | boolean | number,
    ) => {
        if (value == null || paramName === 'without') {
            return record;
        }
        if (record === undefined) {
            return null;
        }
        if (paramName === 'perchColor') {
            record[paramName] = typeof value === 'string' ? value : value.toString();
            return record;
        }

        if (typeof value === 'number' && paramName) {
            record[paramName] = value;
        }

        return record;
    };

    fetchDuckOwnerForVegg = (duckId: duckId) => this.fetchDataByKey<Owner>(`${duckId}_owner`);

    fetchFarmingEntriesOnAddress = (address: addressId) =>
        this.fetchDataMatch<FarmingEntries>(`address_${address}_asset_.*?`);

    fetchFarmingEntriesOfDucks = async (duckId: duckId, address: addressId) => {
        const farmingPower = (await this.fetchDataMatch<FarmingPower>(
            `address_${address}_asset_${duckId}_farmingPower`,
        )) || [
            {
                key: `address_${address}_asset_${duckId}_farmingPower`,
                type: 'integer',
                value: 0,
            },
        ];
        const claimed = (await this.fetchDataMatch<Claimed>(`${address}_asset_${duckId}_claimed`)) || [
            {
                key: `${address}_asset_${duckId}_claimed`,
                type: 'integer',
                value: 0,
            },
        ];
        const lastCheckInterest = (await this.fetchDataMatch<LastCheckInterest>(
            `address_${address}_asset_${duckId}_lastCheckInterest`,
        )) || [
            {
                key: `address_${address}_asset_${duckId}_lastCheckInterest`,
                type: 'integer',
                value: 0,
            },
        ];

        return [farmingPower[0], claimed[0], lastCheckInterest[0]];
    };

    fetchFarmingVeggGlobals = async (): Promise<IFarmingGlobalsV2> => {
        if (this.farmingVeggGlobalsCache.data) {
            return this.farmingVeggGlobalsCache.data;
        }
        const totalResponse = await this.fetchDataByKeys<FarmingGlobals>(['global_lastCheck_interest', 'total_staked']);

        const totalValues = {
            globalStaked: int(0),
            globalLastCheck: int(0),
        };
        totalResponse.forEach(({ key, value }) => {
            totalValues[`global${capitalize(getKeyPart(key, 1))}`] = value;
        });
        this.farmingVeggGlobalsCache.data = totalValues;

        return this.farmingVeggGlobalsCache.data;
    };

    fetchFarmingVeggDetails = async (duckId: duckId, owner: addressId): Promise<IFarmingDetailsV2> => {
        const [farmingEntries, totalValues] = await Promise.all([
            this.fetchFarmingEntriesOfDucks(duckId, owner),
            this.fetchFarmingVeggGlobals(),
        ]);

        const farmingEntriesByKeys = farmingEntries.reduce((result: IFarmingEntriesV2 | null, { key, value }) => {
            let nameKey: 'farmingPower' | 'lastCheckInterest' | undefined | string = getKeyPart(key, 4);

            if (nameKey === undefined) {
                nameKey = getKeyPart(key, 3) as 'farmingPower' | 'lastCheckInterest' | undefined | string;
            }

            if (result === null) {
                result = {} as IFarmingEntriesV2;
            }
            return this.addEntry(result, nameKey, value) || result;
        }, {} as IFarmingEntriesV2);
        const { farmingParams, toClaim } = this.calculateVeggFarmingDetails(
            farmingEntriesByKeys as unknown as IFarmingEntriesV2,
            totalValues,
        );
        return {
            owner,
            farmingParams,
            toClaim,
        };
    };

    fetchDucksParamsOnAddress = async (address: addressId): Promise<Record<assetId, IFarmingEntriesV2>> => {
        const entries = await this.fetchFarmingEntriesOnAddress(address);

        const intermediateResult = entries.reduce(
            (result: Record<assetId, IFarmingEntriesV2>, { key, value }) => {
                const [, , , assetId, paramName] = split(key, '_');

                if (!(assetId in result)) {
                    result[assetId] = {} as IFarmingEntriesV2;
                }

                this.addEntry(result[assetId], paramName, value);

                return result;
            },
            {} as Record<assetId, IFarmingEntriesV2>,
        );

        return Object.entries(intermediateResult)
            .filter(([, { farmingPower }]) => farmingPower > 0)
            .reduce((res, [duckId, entry]) => ({ ...res, [duckId]: entry }), {});
    };

    calculateVeggFarmingDetails = (
        currentBlockchainStateByKeys: IFarmingEntriesV2,
        farmingGlobalsV2: IFarmingGlobalsV2,
    ): { farmingParams: IFarmingParamsV2; toClaim: number } => {
        const farmingParams: IFarmingParamsV2 = {
            lastCheckFarmedAmount: currentBlockchainStateByKeys.claimed,
            assetLastCheckInterest: currentBlockchainStateByKeys.lastCheckInterest,
            farmingPower: currentBlockchainStateByKeys.farmingPower,
            globalFarmingPower: parseInt(`${farmingGlobalsV2.globalStaked}`),
            globalLastCheck: parseInt(`${farmingGlobalsV2.globalLastCheck}`),
        };
        farmingParams.lastCheckFarmedAmount =
            farmingParams.lastCheckFarmedAmount === undefined || Number.isNaN(farmingParams.lastCheckFarmedAmount)
                ? int(0)
                : farmingParams.lastCheckFarmedAmount;

        return {
            farmingParams,
            toClaim: this.calculateToClaim({
                currentInterest: int(farmingParams.globalLastCheck),
                assetLastCheckInterest: farmingParams.assetLastCheckInterest,
                farmingPower: int(farmingParams.farmingPower),
            }),
        };
    };

    calculateToClaim = ({
        currentInterest,
        assetLastCheckInterest = int(0),
        farmingPower = int(0),
    }: {
        currentInterest: number;
        assetLastCheckInterest?: integer;
        farmingPower?: number;
    }) => ((currentInterest - assetLastCheckInterest) * farmingPower) / 1e8;

    getEmptyPerches = async (address: addressId): Promise<{ B?: number; G?: number; Y?: number; R?: number }> => {
        const emptyPerches = await this.fetchDataMatch(`address_${address}_perchesAvailable_.*?`);
        const result = {};
        const possibleColors = ['B', 'G', 'Y', 'R'];
        emptyPerches.forEach((kv) => {
            const keyParts = kv.key.split('_');
            const color = keyParts[keyParts.length - 1].toUpperCase();
            if (possibleColors.indexOf(color) !== -1) {
                result[color] = kv.value;
            }
        });
        return result;
    };

    fetchGlobalData = async (): Promise<{ globalStaked: number; globalLastCheck: number }> => {
        let farmingPower: Array<FarmingGlobalsV2>;
        farmingPower = await this.fetchDataByKeys<FarmingGlobalsV2>([`total_staked`, 'global_lastCheck_interest']);
        const global = farmingPower.find((entry) => entry.key === 'total_staked')?.value;
        const globalInterest = farmingPower.find((entry) => entry.key === 'global_lastCheck_interest')?.value;
        return {
            globalStaked: global ? Number(global) : 0,
            globalLastCheck: globalInterest ? Number(globalInterest) : 0,
        };
    };

    fetchFarmingPower = async (
        duckId: duckId,
        farmingPower: number,
        owner: string | undefined,
        global: number | undefined,
        globalInterest: number | undefined,
    ): Promise<{
        production: number;
        global: number;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    }> => {
        const assetInfo = await this.fetchDataByKeys<LastCheckInterest | FarmingPower | Claimed>([
            `address_${owner}_asset_${duckId}_lastCheckInterest`,
            `${owner}_asset_${duckId}_claimed`,
        ]);
        const assetInterest = assetInfo.find(
            (entry) => entry.key === `address_${owner}_asset_${duckId}_lastCheckInterest`,
        )?.value;

        const claimed = assetInfo.find((entry) => entry.key === `${owner}_asset_${duckId}_claimed`)?.value;
        const toClaim = this.calculateToClaim({
            currentInterest: globalInterest || int(0),
            assetLastCheckInterest: assetInterest,
            farmingPower,
        });
        return {
            global: global || 0,
            production: 0,
            toClaim: toClaim,
            globalInterest: globalInterest || 0,
            assetInterest: assetInterest || 0,
            claimed: claimed || 0,
        };
    };

    calcFarmingPower = async (
        farmingPower: number,
        global: number | undefined,
        globalInterest: number | undefined,
        assetInterest: number | undefined,
        claimed: number | undefined,
    ): Promise<{
        production: number;
        global: number;
        toClaim: number;
        globalInterest: number;
        assetInterest: number;
        claimed: number;
    }> => {
        const toClaim = this.calculateToClaim({
            currentInterest: globalInterest || int(0),
            assetLastCheckInterest: int(assetInterest || 0),
            farmingPower,
        });
        return {
            global: global || 0,
            production: 0,
            toClaim: toClaim,
            globalInterest: globalInterest || 0,
            assetInterest: assetInterest || 0,
            claimed: claimed || 0,
        };
    };
}

export default CommonVeggFarmingService;
