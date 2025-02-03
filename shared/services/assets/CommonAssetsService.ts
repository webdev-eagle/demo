import type { AssetDetails } from '../../types';
import { chunkUpBy, urlString } from '../../utils';
import type CommonHelperService from '../helper';

abstract class CommonAssetsService {
    abstract helperService: CommonHelperService;
    private assetsCache = new Map();

    fetchAssetDetails = async <D = AssetDetails>(nftId: string): Promise<D> => {
        if (this.assetsCache.has(nftId)) {
            return this.assetsCache.get(nftId);
        }
        const { data } = await this.helperService.http.get(`${this.helperService.NODE_URL}/assets/details/${nftId}`);

        this.assetsCache.set(nftId, data);

        return data;
    };

    fetchAssetsDetails = async <T extends AssetDetails>(nftIds: string[]): Promise<T[]> => {
        if (nftIds.length === 0) {
            return [];
        }

        const result: T[] = [];

        const filteredNftIds = nftIds.filter((nftId) => {
            if (this.assetsCache.has(nftId)) {
                result.push(this.assetsCache.get(nftId));
                return false;
            }

            return true;
        });

        const responses = await this.helperService.fetchBatchesSequentially(
            chunkUpBy(100, filteredNftIds),
            (nftIdsChunk) =>
                this.helperService.http
                    .post<T[]>(`${this.helperService.NODE_URL}/assets/details`, { ids: nftIdsChunk })
                    .then(({ data }) =>
                        data.map((asset) => {
                            this.assetsCache.set(asset.assetId, asset);
                            return asset;
                        }),
                    ),
        );

        return [...result, ...responses.flat(1)];
    };

    //WRONG INTERFACE
    fetchAssetDetailsV2 = async <D = AssetDetails>(nftId: string, animalPath: string): Promise<D> => {
        if (this.assetsCache.has(nftId)) {
            return this.assetsCache.get(nftId);
        }
        const { data } = await this.helperService.http.get(
            urlString(`${this.helperService.API_URL}/v2/${animalPath}/${nftId}`),
        );

        this.assetsCache.set(nftId, data.entity);

        return data.entity;
    };
}

export default CommonAssetsService;
