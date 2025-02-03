import { headersJson, possibleGenes } from '../../constants';
import { getAddress } from '../../domain/constants';
import { isAddress } from '../../domain/guards';
import CacheMap from '../../structures/CacheMap';
import type { AssetDetails, ContractData, HttpClient, ILastBlockHeader } from '../../types';
import { chunkUpBy, int, urlString, withCache } from '../../utils';

const COUPONS_DAPP_ADDRESS = getAddress('COUPONS_DAPP');

abstract class CommonHelperService {
    abstract http: HttpClient;
    abstract API_URL: string;
    abstract BACKEND_URL: string;
    abstract NODE_URL: string;
    abstract CACHE_READER_URL: string;

    private nftsCache = new CacheMap<addressId, Promise<AssetDetails[]>>({ ttl: 10_000 });

    fetchBatchesSequentially = async <T, R>(list: T[], query: (batch: T) => Promise<R>): Promise<R[]> => {
        const batches = chunkUpBy(6, list);
        const result: R[] = [];

        for (const batch of batches) {
            const batchResult = await Promise.all(batch.map(query));

            result.push(...batchResult);
        }

        return result;
    };

    /**
     * Returns strings stripped of html
     * @param {string} input - text with html
     * @return string
     */
    plainText = (input: string): string => {
        const REGEX = /(<([^>]+)>)/gi;
        return input.replace(REGEX, '');
    };

    /**
     * Returns a promise with the correct url
     * @param {string} url
     * @param {boolean} tryNode
     * @return Promise<{ data: any }>
     */
    fetchData = async <D = any>(url: string, tryNode = true): Promise<{ data: D }> => {
        if (!tryNode) {
            return this.http.get(`${this.NODE_URL}/${url}`, headersJson);
        }
        try {
            return await this.http.get(`${this.BACKEND_URL}/${url}`, headersJson);
        } catch (e) {
            return this.http.get(`${this.NODE_URL}/${url}`, headersJson);
        }
    };

    fetchAllContractData = async <D extends ContractData = ContractData>(
        address: addressId,
        { avoidCache = false }: { avoidCache?: boolean } = { avoidCache: false },
    ) => {
        const serviceUrl = avoidCache ? this.NODE_URL : this.BACKEND_URL;

        try {
            const { data } = await this.http.get<D[]>(
                urlString(`${serviceUrl}/addresses/data/${address}`),
                headersJson,
            );

            return data;
        } catch (e) {}

        return [];
    };

    fetchContractDataByKeys = async <D extends ContractData = ContractData>(
        address: addressId,
        keys: string | string[],
        options?: { avoidCache?: boolean; sequentially?: boolean; useCache?: boolean },
    ): Promise<D[]> => {
        const {
            avoidCache = false,
            sequentially = false,
            useCache = false,
        } = options ?? { avoidCache: false, sequentially: false, useCache: false };
        const serviceUrl = avoidCache ? this.NODE_URL : useCache ? this.CACHE_READER_URL : this.BACKEND_URL;
        const DUMB_KEY = '__dumb';
        const omitDumb = <T extends { key: string }>(list: T[]): T[] => list.filter(({ key }) => key !== DUMB_KEY);

        const queries: string[] = [];
        let query = ``;

        for (const key of keys) {
            query += query ? `&key=${key}` : `key=${DUMB_KEY}&key=${key}`;
            if (query.length >= 1800) {
                queries.push(query);
                query = '';
            }
        }
        if (query) {
            queries.push(query);
        }

        if (sequentially) {
            const responses: D[] = [];

            for (query of queries) {
                const { data } = await this.http.get<D[]>(
                    `${serviceUrl}/addresses/data/${address}?${query}`,
                    headersJson,
                );
                responses.push(...omitDumb(data));
            }

            return responses;
        }

        const responses = await Promise.all(
            queries.map((queryString) =>
                this.http.get<D[]>(`${serviceUrl}/addresses/data/${address}?${queryString}`, headersJson),
            ),
        );

        return responses
            .flat(1)
            .map(({ data }) => omitDumb(data))
            .flat(1);
    };

    fetchContractDataByMatch = async <D extends ContractData = ContractData>(
        address: addressId,
        matchString: string,
        { avoidCache = false }: { avoidCache?: boolean } = { avoidCache: false },
    ): Promise<D[]> => {
        const serviceUrl = avoidCache ? this.NODE_URL : this.BACKEND_URL;
        try {
            const { data } = await this.http.get<D[]>(
                urlString(`${serviceUrl}/addresses/data/${address}`, { matches: matchString }),
                headersJson,
            );
            return data;
        } catch (e) {}

        return [];
    };

    /**
     * Returns the block number of the current state of the blockchain.
     * @return Promise<ILastBlockHeader>
     */
    getBlockchainLastBlockHeader = async (): Promise<ILastBlockHeader> => {
        const { data: lastBlock } = await this.http.get(`${this.NODE_URL}/blocks/headers/last`);
        return lastBlock;
    };

    /**
     * @deprecated {@link http://nodes.wavesnodes.com/api-docs/index.html#/assets/getAssetDistributionOld Deprecated}
     *
     * TODO: Найти альтернативу
     */
    getNftOwner = async (nftId: nftId): Promise<addressId> => {
        const { data: tokenHolders } = await this.http.get(`${this.NODE_URL}/assets/${nftId}/distribution`);
        const assetHolder = Object.keys(tokenHolders);
        return assetHolder[0];
    };

    getAnimalFarmPower = async (name: string) => {
        const gene = name.startsWith('CANI-') || name.startsWith('FELI-') ? name.split('-')[1] : name;
        const generation = name.split('-')[2][0];
        if (generation === 'J') {
            return 2700;
        } else {
            const uniqueGenes: number = new Set(gene).size;
            const height = await this.getBlockchainHeight();
            const multplier =
                ((height - Number(process.env.FARMING_CALCULATION_VALUE || 3750000)) * 100) / (60 * 24 * 30 * 3);
            const farmPower = (((Math.pow(1.5, uniqueGenes) * 100 * multplier) / 100) * 99) / 100;
            return Math.floor(farmPower);
        }
    };

    numberFormatter = (num: number, digits = 0) => {
        const lookup = [
            { value: 1, symbol: '' },
            { value: 1e3, symbol: 'k' },
            { value: 1e6, symbol: 'M' },
            { value: 1e9, symbol: 'G' },
            { value: 1e12, symbol: 'T' },
            { value: 1e15, symbol: 'P' },
            { value: 1e18, symbol: 'E' },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        const item = lookup
            .slice()
            .reverse()
            .find((item) => num >= item.value);
        return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
    };

    /**
     * Returns the genotype pattern
     * @param {string} name
     * @return {string}
     */
    getGenotypePattern = (name: string): string => {
        const [, genotype, generationColor] = name.split('-');
        const generation = !generationColor ? 'N' : generationColor[0];
        const uniqueGenes = new Set(possibleGenes);
        return `${[...uniqueGenes]
            .map((type) => {
                const matchResult = genotype.match(new RegExp(`${type}`, 'igm'));
                const occurrences = matchResult ? matchResult.length : 0;
                if (occurrences > 0) {
                    return `${occurrences}${type}`;
                }
                return '';
            })
            .join('')}–${generation}`;
    };

    batchEntries = (data: any[], chunkSize: number): any[] => {
        const batches: any[] = [];
        let i;
        let j;
        for (i = 0, j = data.length; i < j; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            batches.push(chunk);
        }
        return batches;
    };

    assetIdAsFloat = (assetId: string): number => {
        let i = 0;
        let hash = 0;
        if (!assetId) return 0;
        while (i < assetId.length) hash = (hash << 5) + hash + assetId.charCodeAt(i++);

        return Math.abs(((hash * 10) % 0x7fffffff) / 0x7fffffff);
    };

    // 3P44yqcpfhPF2iC1nptm2ZJCTaN7VYhz9og
    /**
     * Returns nft from user at address
     * @param {string} address
     * @return Promise<IAsset[]>
     */
    getNftsOnAddress = async (address: addressId): Promise<AssetDetails[]> => {
        if (!isAddress(address)) {
            return [];
        }

        return this.nftsCache.getOr(address, async () => {
            let allNfts: AssetDetails[] = [];
            let nfts: AssetDetails[] = [];
            let after: null | string = null;
            do {
                let url = urlString(`${this.NODE_URL}/assets/nft/${address}/limit/1000`, {
                    after: after || null,
                });
                nfts = (await this.http.get<AssetDetails[]>(url)).data;
                if (nfts.length === 1000) {
                    after = nfts[nfts.length - 1].assetId;
                }
                allNfts = allNfts.concat(nfts);
            } while (nfts.length === 1000);
            return allNfts;
        });
    };

    getBlockchainHeight = withCache(async (): Promise<blocksHeight> => {
        const { data: blockchainHeight } = await this.fetchData<{ height: number }>(`blocks/height`);

        return int(blockchainHeight.height);
    }, 40_000);

    getUserExperience = async (address: addressId) => {
        const { data: experience } = await this.http.get(
            `${this.NODE_URL}/addresses/data/${COUPONS_DAPP_ADDRESS}?matches=.%2A${address}_experience`,
            headersJson,
        );

        if (experience === undefined || experience.length === 0) {
            return 0;
        }

        return experience[0].value;
    };

    getDaysPassed = (startTimer: number) => {
        const timestampMs: number = new Date().getTime();
        let diff = timestampMs - startTimer;
        let daysPassed = Math.floor(diff / (86400 * 1000));
        return daysPassed;
    };
    getConvertedDay = (startTimer: number, daysPassed: number) => {
        const utcTime = startTimer + daysPassed * 86400 * 1000;
        return utcTime;
    };

    getGenotypeMutant = (name: string): [string[], string[], string] => {
        const genotype = name.split('-')[1];
        const duckGenes: string[] = [];
        const turtleGenes: string[] = [];
        for (let i = 0; i < 15; i++) {
            if (i % 2 === 0) {
                if (genotype[i] === 'D') {
                    duckGenes.push(genotype[i + 1]);
                }
                if (genotype[i] === 'T') {
                    turtleGenes.push(genotype[i + 1]);
                }
            }
        }

        return [turtleGenes, duckGenes, name.split('-')[2].split('')[1]];
    };

    genotypePatternMutant = (animalGenes) => {
        const genotypePatternMutant = `T:${this.joinChar(this.getCountChar(animalGenes[0]))}_D:${this.joinChar(
            this.getCountChar(animalGenes[1]),
        )}`;
        return genotypePatternMutant;
    };

    rarityPatternMutant = (animalGenes) => {
        const allGenes = [...animalGenes[0], ...animalGenes[1]];
        const joinedGenes = this.joinChar(this.getCountChar(allGenes));
        const addColor = `${joinedGenes}-${animalGenes[2]}`;
        return addColor;
    };

    getCountChar(genes: string[]): { [char: string]: number } {
        const count: { [char: string]: number } = {};
        for (const gene of genes) {
            for (const char of gene) {
                if (count[char]) {
                    count[char]++;
                } else {
                    count[char] = 1;
                }
            }
        }

        const charRepeated: { [char: string]: number } = {};
        for (const char in count) {
            charRepeated[char] = count[char];
        }
        return charRepeated;
    }

    joinChar = (objGenes) => {
        let result = '';
        for (const char in objGenes) {
            result += `${objGenes[char]}${char}`;
        }
        return result;
    };
}

export default CommonHelperService;
