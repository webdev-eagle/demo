import { getAddress } from '../../domain/constants';
import { getKeyPart } from '../../domain/contract-data';
import type { WarsArtefactDetails, WarsArtefactLevels } from '../../types';
import { split } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type CommonAssetsService from '../assets';
import type { ItemByDuck, ItemInvested, ItemLevel, ItemOwner, UsersDuckItemWorn } from './data-types';

const WAVS_DAPP_ADDRESS = getAddress('GAME_DAPP');

abstract class CommonWarsService extends AbstractDataFetcher {
    protected abstract assetsService: CommonAssetsService;
    protected DAPP_ADDRESS = WAVS_DAPP_ADDRESS;

    fetchItemLevel = (itemId: itemId) => this.fetchDataByKey<ItemLevel>(`artefactId_${itemId}_level`);

    fetchMantleOwner = (itemId: itemId) =>
        this.fetchDataByKey<ItemOwner>(`artefact_ mantle_artefactId_${itemId}_owner`);

    fetchWornMantle = async (duckId: duckId) =>
        this.fetchDataByKey<ItemByDuck>(`artefact_ mantle_duck_${duckId}_artefactId`);

    getFreeMantles = async (address: string): Promise<any> => {
        const allMantles = await this.fetchDataMatch(`address_${address}_artefact_.*?_artefactId_.*?_status`);

        const result = {};
        const freeMantles = allMantles.filter((kv) => kv.value === 'FREE');
        const artefactIds: string[] = [];
        freeMantles.forEach((kv) => {
            const [, , , artefactType, , artefactId] = kv.key.split('_');
            result[artefactId] = {
                artefactId,
                type: artefactType,
                status: kv.value,
            };
            artefactIds.push(artefactId);
        });
        const mantleLevels = await this.getArtefactLevels(artefactIds);
        Object.keys(result).forEach((artefactId) => {
            result[artefactId].level = mantleLevels[artefactId].level;
            result[artefactId].invested = mantleLevels[artefactId].invested;
        });
        return Object.values(result);
    };

    getArtefactLevels = async (artefactIds: string[]): Promise<WarsArtefactLevels> => {
        const artefactLevels = await this.fetchDataByKeys<ItemLevel | ItemInvested>(
            artefactIds.flatMap((id) => [`artefactId_${id}_level`, `artefact_mantle_artefactId_${id}_invested`]),
        );
        const result: WarsArtefactLevels = {};
        if (Array.isArray(artefactLevels)) {
            artefactLevels.forEach((kv) => {
                const keyParts = split(kv.key, '_');
                let artefactId;
                let key;
                if (kv.key.indexOf('_invested') !== -1) {
                    artefactId = keyParts[3];
                    key = 'invested';
                } else {
                    artefactId = keyParts[1];
                    key = 'level';
                }
                if (!result.hasOwnProperty(artefactId)) {
                    result[artefactId] = {} as any;
                }
                result[artefactId][key] = kv.value;
            });
        }

        return result;
    };

    fetchWornMantleParamsByUser = async (address: addressId): Promise<Record<duckId, WarsArtefactDetails>> => {
        const data = await this.fetchDataMatch<UsersDuckItemWorn>(
            `address_${address}_duck_.*?_artefact_.*?_artefactId_.*?_status`,
        );

        const artefactIds = data.reduce((set, { key }) => set.add(getKeyPart(key, 7)), new Set<itemId>());

        const artefactLevels = await this.getArtefactLevels(Array.from(artefactIds));

        return data.reduce((artefacts, { key, value }) => {
            const [, , , duckId, , artefactType, , artefactId] = split(key, '_');
            const params = {
                status: value,
                type: artefactType,
                id: artefactId,
                level: artefactLevels[artefactId]?.level ?? 0,
                invested: artefactLevels[artefactId]?.invested ?? 0,
            };

            if (duckId in artefacts) {
                artefacts[duckId].push(params);
            } else {
                artefacts[duckId] = [params];
            }

            return artefacts;
        }, {});
    };

    fetchWornMantleParams = async (duckId: duckId) => {
        const item = await this.fetchWornMantle(duckId);

        if (!item) {
            return;
        }

        const { value: assetId } = item;
        const [levelResponse, ownerResponse] = await Promise.all([
            this.fetchItemLevel(assetId),
            this.fetchMantleOwner(assetId),
        ]);

        return {
            assetId,
            type: 'mantle',
            level: levelResponse?.value ?? null,
            owner: ownerResponse?.value ?? 'unknown',
        };
    };
}

export default CommonWarsService;
