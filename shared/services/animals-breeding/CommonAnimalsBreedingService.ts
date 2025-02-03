import { isAddress } from '$shared/domain/guards';
import { ANIMAL_PREFIXES } from '$shared/enums';
import { AnimalBreedingDataMatch, HatchingAnimalsParams, PossibleAnimal } from '$shared/types/animals';
import { collectContractDataToObject, getDataKeyPart, getKeyPart } from '../../domain/contract-data';
import { isJackpot } from '../../domain/ducks';
import BiMap from '../../structures/BiMap';
import Cache from '../../structures/Cache';
import type { AssetDetails, ContractStringData, ITransaction } from '../../types';
import { split, withCache } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { BreedingAnimal, Children, GenotypeAmount } from '../animals-breeding/data-types';
import { AnimalId } from '../animals-incubator/data-types';
import type CommonAssetsService from '../assets';
import type CommonTransactionService from '../transaction';

const getNftChildrenKey = (nftId) => `asset_${nftId}_children`;

abstract class CommonAnimalsBreedingService extends AbstractDataFetcher {
    protected abstract DAPP_ADDRESS: addressId;
    protected abstract INCUBATOR_DAPP_ADDRESS: string;
    protected abstract ANIMAL_PREFIXES: ANIMAL_PREFIXES;
    protected abstract ANIMAL_BREEDING_DATA_MATCH: AnimalBreedingDataMatch;
    protected GENERATION_NAMES: Record<string, { name: string; number: string | number; color: string }> = {};
    protected abstract DUXPLORER_URL: string;
    protected abstract assetsService: CommonAssetsService;
    protected abstract transactionService: CommonTransactionService;

    private genotypeFamilies = new Cache({ ttl: 60_000 });
    private hasChildrenCache = new Map<assetId, boolean>();

    fetchActiveBreedingList = async (address: addressId): Promise<BiMap<txId, ducklingId>> => {
        const entries = await this.fetchDataMatch<BreedingAnimal<ANIMAL_PREFIXES>>(
            `${address}_.*?_${this.ANIMAL_BREEDING_DATA_MATCH}`,
        );

        return entries.reduce(
            (bimap, { key, value }) => bimap.set(getKeyPart(key, 1), value),
            new BiMap<txId, ducklingId>(),
        );
    };

    getActiveBreedings = async (address: string): Promise<txId[]> => {
        const { helperService } = this;

        const breedings = await helperService.fetchContractDataByMatch<
            ContractStringData<`${addressId}_${txId}_status`, 'BREEDING_STARTED' | 'BREEDING_FINISHED'>
        >(this.DAPP_ADDRESS, `${address}_.*?_status`);

        return breedings.filter((breeding) => breeding.value === 'BREEDING_STARTED').map(getDataKeyPart(1));
    };

    fetchBreedingAnimalsParams = async (address: addressId): Promise<HatchingAnimalsParams[]> => {
        if (!isAddress(address)) {
            return [];
        }

        const params = await this.fetchDataMatch(`${address}_.*?`, {
            avoidCache: true,
        });

        const paramsObject = collectContractDataToObject(params) as any;

        return params.reduce((res: HatchingAnimalsParams[], { key, value }) => {
            const [, txId, param] = split(key, '_');

            if (param === 'status' && value === 'BREEDING_STARTED') {
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

    fetchAnimalsIdByHatchTx = async (address: addressId, hatchTxId: txId): Promise<AnimalId | undefined> =>
        this.fetchDataByKey<AnimalId>(`${address}_${hatchTxId}_di`);

    getBreedingFinishHeight = async (address: string, txId: string): Promise<any> => {
        const { fetchData } = this.helperService;
        const { data: breedingFinishHeight } = await fetchData(
            `addresses/data/${this.DAPP_ADDRESS}/${address}_${txId}_fh`,
        );

        return parseInt(breedingFinishHeight.value);
    };

    getActiveBreeding = async (
        breedTxId: string,
    ): Promise<{ firstAnimal: AssetDetails; secondAnimal: AssetDetails; breedTransaction: ITransaction }> => {
        const breedTransaction = await this.transactionService.getInvokeScriptTransactionInfo(breedTxId);

        if (!breedTransaction) {
            throw new Error(`Transaction ${breedTxId} doesn't exists`);
        }

        const [firstAnimal, secondAnimal] = await Promise.all(
            breedTransaction.payment
                .filter(({ assetId }) => assetId != null)
                .map(({ assetId }) => this.assetsService.fetchAssetDetails<AssetDetails>(assetId!)),
        );

        return {
            firstAnimal,
            secondAnimal,
            breedTransaction,
        };
    };

    getBreededAnimal = async (callerAddress: string, breedTxId: string): Promise<any> => {
        const animalNftId = await this.fetchDataByKey<ContractStringData>(`${callerAddress}_${breedTxId}_di`, {
            avoidCache: true,
        });

        return this.assetsService.fetchAssetDetails(animalNftId?.value ?? '');
    };

    // have to batched because there is a limit of 2048 length of API request of the node
    getNftsChildren = async (nfts: Array<{ assetId: assetId }>): Promise<Map<assetId, boolean>> => {
        const filteredNfts = nfts.filter(({ assetId }) => !this.hasChildrenCache.has(assetId));

        const children = await this.fetchDataByKeys<Children>(
            filteredNfts.map((nft) => getNftChildrenKey(nft.assetId)),
        );

        children.forEach(({ key, value }) => {
            const assetId = getKeyPart(key, 1);

            this.hasChildrenCache.set(assetId, value > 0);
        });

        return this.hasChildrenCache;
    };

    addCanBreed = async <T extends { assetId: assetId; name: string }>(
        nfts: T[],
    ): Promise<Array<T & { canBreed?: boolean }>> => {
        try {
            const haveChildren = await this.getNftsChildren(nfts);

            return nfts.map((nft) => ({
                ...nft,
                canBreed: nft.name && isJackpot(nft) ? false : !haveChildren.get(nft.assetId),
            }));
        } catch (e) {
            return nfts;
        }
    };
    // TODO: In breeding calculator, if the generation be Obstinate, it returns the undefined.
    getPossibleAnimalsChildrenNames = (animalOneName: string, animalTwoName: string): string[] => {
        const _genes: string[] = [];
        const [animalType, animalOneGenes, generationColorOne] = animalOneName.split('-');
        const [, animalTwoGenes, generationColorTwo] = animalTwoName.split('-');
        const generationOne = generationColorOne.split('')[0];
        const generationTwo = generationColorTwo.split('')[0];
        const generations = Object.keys(this.GENERATION_NAMES).sort();
        const currentGenerationIndex = generations.indexOf([generationOne, generationTwo].sort()[1]);
        let newGeneration;
        if (generations.length > currentGenerationIndex) {
            newGeneration = generations[currentGenerationIndex + 1];
        } else {
            generations[currentGenerationIndex];
        }
        newGeneration = newGeneration === 'J' ? generations[currentGenerationIndex + 2] : newGeneration;
        const differentGenesOne = animalOneGenes
            .split('')
            .filter((gene, ind) => gene !== animalTwoGenes.split('')[ind]);
        const differentGenesTwo = animalTwoGenes
            .split('')
            .filter((gene, ind) => gene !== animalOneGenes.split('')[ind]);
        const sameGenes =
            differentGenesOne.length < 8
                ? animalOneGenes.split('').filter((gene, ind) => gene === animalTwoGenes.split('')[ind])
                : [];
        const arrLength = differentGenesOne.length;
        const animals = [differentGenesOne.join(''), differentGenesTwo.join('')];
        for (let i = 0; i < Math.pow(2, arrLength); i++) {
            // we represent a byte i as a bit mask
            for (let j = 0; j < arrLength; j++) {
                // bit position in byte
                differentGenesOne[arrLength - 1 - j] = animals[(i >> j) & 1][arrLength - 1 - j];
            }
            const gene = [...sameGenes, ...differentGenesOne].join('');
            _genes.push(`${animalType}-${gene}-${newGeneration}B`);
        }
        return _genes;
    };

    /**
     * Given two different duck genotypes, calculates the different possible breeds
     * and probabilities of the resulting ducks.
     *
     *
     */
    getPossibleAnimals = async (firstAnimalName: string, secondAnimalName: string): Promise<PossibleAnimal[]> => {
        const { getGenotypePattern } = this.helperService;
        const possibleAnimalNames = this.getPossibleAnimalsChildrenNames(firstAnimalName, secondAnimalName);
        const possibleAnimals = possibleAnimalNames.map((name) => ({
            name,
            issuer: this.INCUBATOR_DAPP_ADDRESS,
            genotype: getGenotypePattern(name),
        }));
        let genoTypeList = {};
        possibleAnimals.forEach((animal) => {
            if (animal.genotype in genoTypeList) {
                genoTypeList[animal.genotype] = genoTypeList[animal.genotype] + 1;
            } else {
                genoTypeList[animal.genotype] = 1;
            }
        });

        const uniqueAnimalsMap = new Map<string, { name: string; issuer: string; genotype: string }>();

        possibleAnimals.forEach((animal) => {
            if (!uniqueAnimalsMap.has(animal.genotype)) {
                uniqueAnimalsMap.set(animal.genotype, animal);
            }
        });

        const possibilities = Array.from(uniqueAnimalsMap.values()).map((animal) => ({
            ...animal,
            probability: (genoTypeList[animal.genotype] / possibleAnimalNames.length) * 100,
        }));

        return possibilities;
    };

    getGenotypeAmounts = withCache(
        () => this.fetchDataMatch<GenotypeAmount<ANIMAL_PREFIXES>>('stats_.*?_amount'),
        60_000,
    );

    /**
     * Calculates the total probability to get each rarity.
     *
     * @param {Array} buckets
     * @param {Integer} rarity
     * @param {Float} probability
     */
    calculateRarityOdds = (buckets: any, rarity: number, probability: string): void => {
        if (rarity in buckets) {
            const totalProbability = buckets[rarity].totalProbability;
            // eslint-disable-next-line no-param-reassign
            buckets[rarity].totalProbability = parseFloat(totalProbability) + parseFloat(probability);
        } else {
            const bucket = {
                rarity,
                totalProbability: parseFloat(probability),
            };
            // eslint-disable-next-line no-param-reassign
            buckets[bucket.rarity] = bucket;
        }
    };

    /**
     * @param {Set} mergedGenotypesWithCount
     * @returns An object including two lists:
     *  - List of genotype and its rarity and probability to get it
     *  - List of rarity and the total sum of probabilities to get that rarity
     */
    calculateGenotypeRarities = (mergedGenotypesWithCount: any): { rarities: any[]; buckets: any[] } => {
        const uniqueRarity = 100;
        const totalPossibleGenotypes = 256;
        const genotypeRarities: any[] = [];
        const rarityBuckets = [];

        Object.keys(mergedGenotypesWithCount).forEach((genotypeId) => {
            const probability = (
                (parseInt(mergedGenotypesWithCount[genotypeId]) / totalPossibleGenotypes) *
                100
            ).toFixed(2);

            let genotypeRarity = {};
            if (genotypeId in this.genotypeFamilies.data) {
                const genotype = this.genotypeFamilies.data[genotypeId];
                const rarity = Math.round(Math.sqrt(1 / (parseInt(genotype.quantity) + 1)) * 100);

                genotypeRarity = {
                    id: genotypeId,
                    rarity,
                    probability,
                };
                this.calculateRarityOdds(rarityBuckets, rarity, probability);
            } else {
                genotypeRarity = {
                    id: genotypeId,
                    rarity: uniqueRarity,
                    probability,
                };
                this.calculateRarityOdds(rarityBuckets, uniqueRarity, probability);
            }
            genotypeRarities.push(genotypeRarity);
        });
        return {
            rarities: genotypeRarities,
            buckets: rarityBuckets,
        };
    };

    /**
   * Reduce the genes string to the unordered version format:
   - 3A2C3F
   * @param {*} genes The 8 letter genes string
   * @returns The newly reduced genes string
   */
    reduceToGenesFamily = (genes: string): string => {
        const counts = {};
        Array.from(genes).forEach((gene: string) => {
            counts[gene] = (counts[gene] || 0) + 1;
        });

        let genFamily = '';
        Object.keys(counts)
            .sort()
            .forEach((key) => {
                genFamily += counts[key] + key;
            });

        return genFamily;
    };
}

export default CommonAnimalsBreedingService;
