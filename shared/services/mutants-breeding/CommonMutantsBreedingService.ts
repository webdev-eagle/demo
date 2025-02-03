import { MutariumProb } from '$shared/constants/mutants';
import { isAddress } from '$shared/domain/guards';
import { BreedingMutantParams, PossibleMutant } from '$shared/types/mutants';
import { calculateRarityMutant } from '$shared/utils/calculateRarity';
import { getAddress } from '../../domain/constants';
import { collectContractDataToObject, getDataKeyPart, getKeyPart } from '../../domain/contract-data';
import { isJackpot } from '../../domain/ducks';
import BiMap from '../../structures/BiMap';
import Cache from '../../structures/Cache';
import type { AssetDetails, ContractStringData, ITransaction } from '../../types';
import { split, withCache } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type CommonAssetsService from '../assets';
import CommonHelperService from '../helper';
import type CommonTransactionService from '../transaction';
import type { BreedingMutant, Children, GenotypeAmount, MutantId, MutantsMinted } from './data-types';

//const MUTANTS_INCUBATOR_DAPP_ADDRESS = getAddress('MUTANTS_INCUBATOR_DAPP');
const MUTANTS_BREEDER_DAPP_ADDRESS = getAddress('MUTANTS_BREEDER_DAPP');

const getNftChildrenKey = (nftId) => `asset_${nftId}_children`;
const EGG_BASE = 200000000;
const SPICE_BASE = 1000000000;
abstract class CommonMutantsBreedingService extends AbstractDataFetcher {
    abstract helperService: CommonHelperService;
    protected DAPP_ADDRESS = MUTANTS_BREEDER_DAPP_ADDRESS;
    protected abstract DUXPLORER_URL: string;
    protected abstract assetsService: CommonAssetsService;
    protected abstract transactionService: CommonTransactionService;

    private genotypeFamilies = new Cache({ ttl: 60_000 });
    private hasChildrenCache = new Map<assetId, boolean>();

    fetchActiveBreedingList = async (address: addressId): Promise<BiMap<txId, ducklingId>> => {
        const entries = await this.fetchDataMatch<BreedingMutant>(`${address}_.*?_status`);

        return entries.reduce(
            (bimap, { key, value }) => bimap.set(getKeyPart(key, 1), value),
            new BiMap<txId, ducklingId>(),
        );
    };

    getActiveBreedings = async (address: string): Promise<txId[]> => {
        const { helperService } = this;

        const breedings = await helperService.fetchContractDataByMatch<
            ContractStringData<`${addressId}_${txId}_status`, 'BREEDING_STARTED' | 'BREEDING_FINISHED'>
        >(MUTANTS_BREEDER_DAPP_ADDRESS, `${address}_.*?_status`);

        return breedings.filter((breeding) => breeding.value === 'BREEDING_STARTED').map(getDataKeyPart(1));
    };

    fetchBreedingMutantsParams = async (address: addressId): Promise<BreedingMutantParams[]> => {
        if (!isAddress(address)) {
            return [];
        }

        const params = await this.fetchDataMatch(`${address}_.*?`, {
            avoidCache: true,
        });

        const paramsObject = collectContractDataToObject(params) as any;

        return params.reduce((res: BreedingMutantParams[], { key, value }) => {
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

    fetchMutantIdByHatchTx = async (address: addressId, hatchTxId: txId): Promise<MutantId | undefined> => {
        try {
            const key = `${address}_${hatchTxId}_di`;
            const result = await this.fetchDataByKey<MutantId>(key);
            return result;
        } catch (error) {
            console.error('Error fetching mutant ID:', error);
            return undefined;
        }
    };

    getBreedingFinishHeight = async (address: string, txId: string): Promise<any> => {
        const { fetchData } = this.helperService;
        const { data: breedingFinishHeight } = await fetchData(
            `addresses/data/${MUTANTS_BREEDER_DAPP_ADDRESS}/${address}_${txId}_fh`,
        );

        return parseInt(breedingFinishHeight.value);
    };

    getActiveBreeding = async (
        breedTxId: string,
    ): Promise<{ firstDuck: AssetDetails; secondTurtle: AssetDetails; breedTransaction: ITransaction }> => {
        const breedTransaction = await this.transactionService.getInvokeScriptTransactionInfo(breedTxId);

        if (!breedTransaction) {
            throw new Error(`Transaction ${breedTxId} doesn't exists`);
        }

        const [firstDuck, secondTurtle] = await Promise.all(
            breedTransaction.payment
                .filter(({ assetId }) => assetId != null)
                .map(({ assetId }) => this.assetsService.fetchAssetDetails<AssetDetails>(assetId!)),
        );

        return {
            firstDuck,
            secondTurtle,
            breedTransaction,
        };
    };

    getBreededMutant = async (callerAddress: string, breedTxId: string): Promise<any> => {
        const mutantNftId = await this.fetchDataByKey<ContractStringData>(`${callerAddress}_${breedTxId}_di`, {
            avoidCache: true,
        });

        return this.assetsService.fetchAssetDetails(mutantNftId?.value ?? '');
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

    generateGeneCombinations(parent1: string, parent2: string): string[] {
        const mutantDNA: string[] = [];
        if (parent1.length !== 8 || parent2.length !== 8) {
            throw new Error('The sequence needs to have 8 genes');
        }

        function combineGenes(position: number, currentDNA: string) {
            if (position >= parent1.length * 2) {
                mutantDNA.push(currentDNA);
                return;
            }

            if (position % 2 === 0) {
                combineGenes(position + 1, currentDNA + 'D');
                combineGenes(position + 1, currentDNA + 'T');
            } else {
                const geneIndex = Math.floor(position / 2);
                if (currentDNA[position - 1] === 'D') {
                    combineGenes(position + 1, currentDNA + parent1[geneIndex]);
                } else if (currentDNA[position - 1] === 'T') {
                    combineGenes(position + 1, currentDNA + parent2[geneIndex]);
                }
            }
        }

        combineGenes(0, '');
        return mutantDNA;
    }

    getPossibleMutantChildrenNames = (
        duckOneName: string,
        turtleTwoName: string,
    ): {
        name: string;
        issuer: string;
        genotype: string;
    }[] => {
        const _genes: string[] = [];
        const [, duckOneGenes, generationColorOne] = duckOneName.split('-');
        const [, turtleTwoGenes, generationColorTwo] = turtleTwoName.split('-');
        const animals = [duckOneGenes, turtleTwoGenes];

        this.generateGeneCombinations(animals[0], animals[1]).map((mutantGenes) => {
            _genes.push(`MTNT-${mutantGenes}-GB`);
        });
        const possibleMutants = _genes.map((mtnt) => {
            return {
                name: mtnt,
                issuer: MUTANTS_BREEDER_DAPP_ADDRESS,
                genotype: this.helperService.genotypePatternMutant(this.helperService.getGenotypeMutant(mtnt)),
            };
        });

        return possibleMutants;
    };

    /**
     * one duck and turtles genotypes, calculates the different possible breeds
     * and probabilities of the resulting mutants.
     */
    getPossibleAnimals = async (firstDuckName: string, secondTurtleName: string): Promise<PossibleMutant[]> => {
        const possibleMutantNames = this.getPossibleMutantChildrenNames(firstDuckName, secondTurtleName);

        let genoTypeList = {};
        possibleMutantNames.forEach((mutant) => {
            if (mutant.genotype in genoTypeList) {
                genoTypeList[mutant.genotype] = genoTypeList[mutant.genotype] + 1;
            } else {
                genoTypeList[mutant.genotype] = 1;
            }
        });

        const allMutantsWithProb = possibleMutantNames.map((mutant) => ({
            ...mutant,
            probability: (genoTypeList[mutant.genotype] / possibleMutantNames.length) * 100,
        }));
        return allMutantsWithProb;
    };

    addMutarionProb = (listMutants: PossibleMutant[]) => {
        const totalValue = Object.values(MutariumProb).reduce((acc, val) => acc + val, 0);
        const newProbabilityMutantList = listMutants.flatMap((genotype) => {
            return Object.entries(MutariumProb).map(([key, value]) => {
                const newName = genotype.name.slice(0, -1) + key;
                const newProbability = genotype.probability * (value / totalValue);
                return {
                    name: newName,
                    issuer: genotype.issuer,
                    genotype: `${genotype.genotype}-${key}`,
                    probability: newProbability,
                };
            });
        });
        return newProbabilityMutantList;
    };

    getGenotypeAmounts = withCache(() => this.fetchDataMatch<GenotypeAmount>('stats_.*?_amount'), 60_000);
    getRarityAmounts = withCache(() => this.fetchDataMatch<GenotypeAmount>('stats_.*?_rarity'), 60_000);
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

    addRarityMutants = async (listMutants: any[]): Promise<Array<AssetDetails & { rarity: number }>> => {
        const [allMutantsAmount] = await Promise.all([this.getRarityAmounts()]);
        const countFunc = (list, value) => {
            let count = 1;
            list.forEach((obj) => {
                obj === value;
                count += obj === value ? 1 : 0;
            });
            return count;
        };
        const mutantName = listMutants.map((mutant) => {
            return mutant.name.length < 16 ? mutant.name : mutant.name;
        });

        const mutantNameBc = allMutantsAmount.map((mutant) => {
            return mutant.key.split('_')[1];
        });
        const newAmountMutant = mutantName.map((obj) => {
            const amount = countFunc(mutantNameBc, obj);
            return {
                amount: amount,
                name: obj,
            };
        });
        const updatedMutants = listMutants.map((obj) => {
            const mutantName = obj.name.length < 16 ? obj.name : obj.name;
            const newCalMutant = newAmountMutant.find((mutant) => {
                return mutant.name === mutantName;
            });
            return {
                ...obj,
                name: obj.description, // mutants on transaction get their name with description property
                rarity: calculateRarityMutant(newCalMutant?.amount || 1),
            };
        });

        return updatedMutants;
    };

    getAllMuntantsMinted = withCache(() => this.fetchDataMatch<MutantsMinted>('stats_amount'), 60_000);

    getMutantBreedingPrice = async () => {
        const [allMutantsAmount, mutantsMinted] = await Promise.all([
            this.getGenotypeAmounts(),
            this.getAllMuntantsMinted(),
        ]);

        if (mutantsMinted.length === 0) {
            const eggPrice = EGG_BASE + EGG_BASE / 1000 / 2;
            const spicePrice = SPICE_BASE + SPICE_BASE / 1000 / 2;
            return {
                eggPrice,
                spicePrice,
            };
        }

        const eggPrice = EGG_BASE + (EGG_BASE * (mutantsMinted[0].value + 1)) / 1000 / 2;
        const spicePrice = SPICE_BASE + (SPICE_BASE * (mutantsMinted[0].value + 1)) / 1000 / 2;
        return {
            eggPrice,
            spicePrice,
        };
    };
}

export default CommonMutantsBreedingService;
