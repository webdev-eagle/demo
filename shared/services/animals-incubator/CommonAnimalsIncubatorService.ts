import { collectContractDataToObject } from '$shared/domain/contract-data';
import { isAddress } from '$shared/domain/guards';
import { AnimalCalls, AnimalType, HatchingAnimalsParams } from '$shared/types/animals';
import { int, urlString, withCache } from '$shared/utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import { AnimalId, GenotypeAmount, HatchingFinishHeight, HatchingStatus, LastAnimalPrice } from './data-types';

abstract class CommonAnimalsIncubatorService extends AbstractDataFetcher {
    protected abstract DAPP_ADDRESS: addressId;
    abstract ANIMAL_KEY: string;

    fetchGenotypeAmounts = withCache(
        (): Promise<GenotypeAmount[]> => this.fetchDataMatch<GenotypeAmount>('stats_.*?_amount'),
        60_000,
    );

    fetchAnimalIdByHatchTx = async (address: addressId, hatchTxId: txId): Promise<AnimalId | undefined> =>
        this.fetchDataByKey<AnimalId>(`${address}_${hatchTxId}_di`);

    fetchHatchingAnimalParams = async (address: addressId): Promise<HatchingAnimalsParams[]> => {
        if (!isAddress(address)) {
            return [];
        }
        const params = await this.fetchDataMatch<AnimalId | HatchingStatus | HatchingFinishHeight>(`${address}_.*?`, {
            avoidCache: true,
        });

        const paramsObject = collectContractDataToObject(params);

        return params.reduce((res: HatchingAnimalsParams[], { key, value }) => {
            const [, txId, param] = key.split('_');

            if (param === 'status' && value === 'HATCHING_STARTED') {
                res.push({
                    txId,
                    address,
                    animalId: paramsObject[`${address}_${txId}_di`],
                    finishHeight: paramsObject[`${address}_${txId}_fh`],
                    status: paramsObject[`${address}_${txId}_status`],
                });
            }

            return res;
        }, []);
    };

    fetchLastAnimalHatchPrice = async (): Promise<eggint> => {
        const lastPrice = await this.fetchDataByKey<LastAnimalPrice>(`${this.ANIMAL_KEY}_last_price`);
        return int(lastPrice?.value ?? 0);
    };

    getStaticKeys = async (
        animal: AnimalType,
    ): Promise<{
        typesAmount: number;
        totalTRTLsAmount: number;
        discountCoefficient: number;
    }> => {
        const { data: keys } = await this.helperService.fetchData(
            urlString(`addresses/data/${AnimalCalls[animal].dapp}`, {
                key: [AnimalCalls[animal].sc_call, 'discountCoefficient'],
            }),
        );

        return keys.reduce(
            (acc, { key, value }) => {
                switch (key) {
                    case `${AnimalCalls[animal].sc_call}_amount`:
                        acc.totalTRTLsAmount = value;
                        break;
                    case 'discountCoefficient':
                        acc.discountCoefficient = value;
                        break;
                }
                return acc;
            },
            { discountCoefficient: 0, typesAmount: 4, totalTRTLsAmount: 0 },
        );
    };
}

export default CommonAnimalsIncubatorService;
