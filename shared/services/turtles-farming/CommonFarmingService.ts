import { REWARD_PER_BLOCK, SCALE } from '../../constants';
import { getAddress } from '../../domain/constants';
import { getKeyPart } from '../../domain/contract-data';
import Cache from '../../structures/Cache';
import type { IFarmingDetails, IFarmingEntries, IFarmingGlobals, IFarmingParams } from '../../types';
import { int, roundUp, split, urlString } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { FarmingEntries, FarmingGlobals, Owner } from './data-types';

const TURTLES_FARMING_DAPP_ADDRESS = getAddress('TURTLES_FARMING_DAPP');

abstract class CommonTurtlesFarmingService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = TURTLES_FARMING_DAPP_ADDRESS;

    private farmingGlobalsCache = new Cache<IFarmingGlobals>({ ttl: 30_000 });

    private addEntry = (
        record: IFarmingEntries,
        paramName: keyof IFarmingEntries | 'without',
        value: string | integer | boolean,
    ) => {
        if (value == null || paramName === 'without') {
            return record;
        }

        if (paramName === 'perchColor') {
            record[paramName] = typeof value === 'string' ? value : value.toString();
            return record;
        }

        if (typeof value === 'number') {
            record[paramName] = value;
        }

        return record;
    };

    fetchFarmingEntriesOfTurtles = (turtleId: turtleId, address: addressId) =>
        this.fetchDataMatch<FarmingEntries>(`${turtleId}_owner_${address}_.*?`);

    fetchFarmingEntriesOnAddress = (address: addressId) =>
        this.fetchDataMatch<FarmingEntries>(`assetId_.*?_owner_${address}_.*?`);

    fetchTurtlesParamsOnAddress = async (address: addressId): Promise<Record<assetId, IFarmingEntries>> => {
        const entries = await this.fetchFarmingEntriesOnAddress(address);

        const intermediateResult = entries.reduce(
            (result: Record<assetId, any>, { key, value }) => {
                const [, assetId, , , paramName] = split(key, '_');

                if (!(assetId in result)) {
                    result[assetId] = {} as IFarmingEntries;
                }

                this.addEntry(result[assetId], paramName as any, value);

                return result;
            },
            {} as Record<assetId, any>,
        );

        return Object.entries(intermediateResult)
            .filter(([, { power }]) => power > 0)
            .reduce((res, [duckId, entry]) => ({ ...res, [duckId]: entry }), {});
    };

    fetchFarmingGlobals = async (): Promise<IFarmingGlobals> => {
        if (this.farmingGlobalsCache.data) {
            return this.farmingGlobalsCache.data;
        }

        const totalResponse = await this.fetchDataByKeys<FarmingGlobals>([
            'total_lastCheckInterestHeight',
            'global_lastCheck_interest',
            'total_staked',
        ]);
        const totalValues = {
            globalLastCheckInterestHeight: int(0),
            globalLastCheckInterest: int(0),
            globalFarmingPower: int(0),
        };

        //there are no key of the interestHeight in the turtle farming sc
        if (totalResponse != undefined) {
            const totalValues = {
                globalLastCheckInterestHeight: int(0),
                globalLastCheckInterest: totalResponse[0]?.value ?? int(0),
                globalFarmingPower: totalResponse[1]?.value ?? int(0),
            };
            this.farmingGlobalsCache.data = totalValues;
            return this.farmingGlobalsCache.data;
        }

        this.farmingGlobalsCache.data = totalValues;

        return this.farmingGlobalsCache.data;
    };

    fetchTurtleOwner = (turtleId: turtleId) => this.fetchDataByKey<Owner>(`${turtleId}_owner`);

    fetchFarmingDetails = async (turtleId: turtleId, owner: addressId): Promise<IFarmingDetails> => {
        const [farmingEntries, blockchainHeight, totalValues] = await Promise.all([
            this.fetchFarmingEntriesOfTurtles(turtleId, owner),
            this.helperService.getBlockchainHeight(),
            this.fetchFarmingGlobals(),
        ]);
        const farmingEntriesByKeys = farmingEntries.reduce(
            (result: IFarmingEntries, { key, value }) => this.addEntry(result, getKeyPart(key, 4), value),
            {} as IFarmingEntries & { power: integer },
        );

        const { farmingParams, toClaim } = this.calculateTurtlesFarmingDetails(
            farmingEntriesByKeys as IFarmingEntries & { power: integer },
            owner,
            turtleId,
            totalValues,
            blockchainHeight,
        );

        return {
            owner,
            farmingParams,
            toClaim,
            perchColor: farmingEntriesByKeys.perchColor,
        };
    };

    /**
     * Returns the duck farming details
     * @param {Object} currentBlockchainStateByKeys -
     * @param {string} address -
     * @param {string} nftId -
     * @param {Object} farmingGlobals -
     * @param {number} blockchainHeight -
     * @return { farmingParams: IFarmingParams; toClaim: number }
     */
    calculateTurtlesFarmingDetails = (
        currentBlockchainStateByKeys: IFarmingEntries & { power: integer },
        address: string,
        nftId: string,
        farmingGlobals: IFarmingGlobals,
        blockchainHeight: number,
    ): { farmingParams: IFarmingParams; toClaim: number } => {
        const farmingParams: IFarmingParams = {
            lastCheckFarmedAmount: currentBlockchainStateByKeys.lastCheckFarmedAmount,
            withdrawnAmount: currentBlockchainStateByKeys.withdrawnAmount,
            assetLastCheckInterest: currentBlockchainStateByKeys.lastCheckInterest,
            farmingPower: currentBlockchainStateByKeys.power,
            globalFarmingPower: parseInt(`${farmingGlobals.globalFarmingPower}`),
            globalLastCheckInterest: parseInt(`${farmingGlobals.globalLastCheckInterest}`),
            globalLastCheckInterestHeight: parseInt(`${farmingGlobals.globalLastCheckInterestHeight}`),
            blockchainHeight,
            currentInterest: int(0),
        };
        farmingParams.lastCheckFarmedAmount =
            farmingParams.lastCheckFarmedAmount === undefined || Number.isNaN(farmingParams.lastCheckFarmedAmount)
                ? int(0)
                : farmingParams.lastCheckFarmedAmount;
        farmingParams.withdrawnAmount =
            farmingParams.withdrawnAmount === undefined || Number.isNaN(farmingParams.withdrawnAmount)
                ? int(0)
                : farmingParams.withdrawnAmount;
        farmingParams.currentInterest = this.calculateCurrentInterest(farmingParams);

        return {
            farmingParams,
            toClaim: this.calculateToClaim({
                assetLastCheckInterest: farmingParams.assetLastCheckInterest,
                currentInterest: farmingParams.currentInterest,
                farmingPower: farmingParams.farmingPower,
                lastCheckFarmedAmount: farmingParams.lastCheckFarmedAmount,
                withdrawnAmount: farmingParams.withdrawnAmount,
            }),
        };
    };

    calculateCurrentInterest = ({
        blockchainHeight,
        globalFarmingPower,
        globalLastCheckInterest,
        globalLastCheckInterestHeight,
    }: {
        blockchainHeight: number;
        globalFarmingPower: number;
        globalLastCheckInterest: number;
        globalLastCheckInterestHeight: number;
    }) =>
        roundUp(
            globalLastCheckInterest +
                (SCALE * REWARD_PER_BLOCK * (blockchainHeight - globalLastCheckInterestHeight)) / globalFarmingPower,
        );

    calculateToClaim = ({
        lastCheckFarmedAmount = int(0),
        withdrawnAmount = int(0),
        currentInterest,
        assetLastCheckInterest = int(0),
        farmingPower,
    }: {
        lastCheckFarmedAmount?: integer;
        withdrawnAmount?: integer;
        currentInterest: integer;
        assetLastCheckInterest?: integer;
        farmingPower: integer;
    }) => (lastCheckFarmedAmount - withdrawnAmount + (currentInterest - assetLastCheckInterest) * farmingPower) / 1e6;

    getEmptySands = async (address: addressId): Promise<{ B?: number; G?: number; Y?: number; R?: number }> => {
        const emptyPerches = await this.fetchDataMatch(`address_${address}_beachesAvailable_.*?`, { avoidCache: true });
        const result = {};
        const possibleColors = ['R', 'D', 'S', 'G'];
        emptyPerches.forEach((kv) => {
            const keyParts = kv.key.split('_');
            const color = keyParts[keyParts.length - 1].toUpperCase();
            if (possibleColors.indexOf(color) !== -1) {
                result[color] = kv.value;
            }
        });
        return result;
    };

    getAddressFarmPower = async (userAddress: string): Promise<number> => {
        const { data } = await this.helperService.fetchData(
            urlString(`addresses/data/${this.DAPP_ADDRESS}`, { matches: `total_staked_${userAddress}` }),
            false,
        );
        if (data != undefined) {
            if (data.length == 0) {
                return 0;
            } else {
                return data[0].value;
            }
        }
        return 0;
    };
}

export default CommonTurtlesFarmingService;
