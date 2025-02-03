import { getAddress } from '../../domain/constants';
import { getDataKeyPart, getKeyPart } from '../../domain/contract-data';
import type { ArtefactCooldown, ArtefactType } from '../../types';
import { int, maybe } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { ArtefactOwner, LastUnstakeHeight } from './data-types';

const ACCOUNT_BOOSTER_DAPP_ADDRESS = getAddress('ACCOUNT_BOOSTER_DAPP');

const COOLDOWN_PERIOD = 240;

abstract class CommonAccountBoosterService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = ACCOUNT_BOOSTER_DAPP_ADDRESS;

    fetchStakedForUser = async (userAddress: addressId): Promise<ArtefactOwner[]> => {
        return this.fetchDataMatch<ArtefactOwner>(`.*?_${userAddress}_owner`);
    };

    isItemStakedByUser = async (
        item: { assetId: assetId; type: ArtefactType },
        userAddress: addressId,
    ): Promise<boolean> => {
        const data = await this.fetchDataByKey<ArtefactOwner>(`${item.type}_${userAddress}_owner`);

        return data?.value === item.assetId;
    };

    isUserStakedItem = async (userAddress: addressId, artefactType: ArtefactType) => {
        const itemId = await this.fetchDataByKey(`${artefactType}_${userAddress}_owner`);

        return Boolean(itemId);
    };

    stakedItemOwner = async (assetId: assetId, type: ArtefactType): Promise<addressId | undefined> => {
        const data = await this.fetchDataMatch<ArtefactOwner>(`${type}_.*?_owner`);

        return maybe(data.find(({ value }) => value === assetId))
            .map(getDataKeyPart(1))
            .get();
    };

    getCooldown = async (assetId: assetId, type: ArtefactType): Promise<ArtefactCooldown> => {
        const [data, currentHeight] = await Promise.all([
            this.fetchDataByKey<LastUnstakeHeight>(`${type}_${assetId}_unstake_height`),
            this.helperService.getBlockchainHeight(),
        ]);
        const lastUnstakeHeight = data?.value ?? int(0);
        const cooldownEnd = lastUnstakeHeight + COOLDOWN_PERIOD;
        const isInCooldown = currentHeight < cooldownEnd;

        return {
            isInCooldown,
            lastUnstakeHeight,
            currentHeight,
            estimatedCooldownTime: int(isInCooldown ? cooldownEnd - currentHeight : 0),
        };
    };

    getCooldowns = async (
        items: Array<{ assetId: assetId; name: ArtefactType }>,
    ): Promise<Record<assetId, ArtefactCooldown>> => {
        const [currentHeight, unstakeHeights] = await Promise.all([
            this.helperService.getBlockchainHeight(),
            this.fetchDataByKeys<LastUnstakeHeight>(
                items.map(({ name, assetId }) => `${name}_${assetId}_unstake_height`),
            ),
        ]);

        return unstakeHeights.reduce(
            (result: Record<assetId, ArtefactCooldown>, unstakeHeight) => {
                const assetId = getKeyPart(unstakeHeight.key, 1);
                const lastUnstakeHeight = unstakeHeight.value;
                const cooldownEnd = lastUnstakeHeight + COOLDOWN_PERIOD;
                const isInCooldown = currentHeight < cooldownEnd;

                result[assetId] = {
                    isInCooldown,
                    lastUnstakeHeight,
                    currentHeight,
                    estimatedCooldownTime: int(isInCooldown ? cooldownEnd - currentHeight : 0),
                };

                return result;
            },
            {} as Record<assetId, ArtefactCooldown>,
        );
    };
}

export default CommonAccountBoosterService;
