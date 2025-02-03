import { MutantAchievements } from '$shared/types/scan';
import { Duck, EnrichedDuck, veggEnrichedDuck } from '$shared/types/cache-api';
import type { AssetDetails, DuckAchievements, IMarketPrice, TurtleAchievements } from '../../types';
import { chunkUpBy, urlString } from '../../utils';
import type CommonHelperService from '../helper';
import { mutantId } from '../mutants-farming/data-types';

abstract class CommonScanService {
    protected abstract SCAN_URL: string;

    protected abstract helperService: CommonHelperService;

    abstract fetchAchievementsForDucks: <T extends { assetId: string }>(
        ducks: T[],
    ) => Promise<Record<duckId, DuckAchievements>>;

    abstract fetchAchievementsForTurtles: <T extends { assetId: string }>(
        turtles: T[],
    ) => Promise<Record<turtleId, TurtleAchievements>>;

    abstract fetchAchievementsForMutants: <T extends { assetDetails: AssetDetails } & MutantWithAssetDetails>(
        mutant: T[],
    ) => Promise<Record<mutantId, MutantAchievements>>;

    fetchDuckMarketPrice = async (
        rarity: number,
        canBreed: boolean,
        hasAchievement: boolean,
        gene: string,
    ): Promise<IMarketPrice> => {
        try {
            const { data } = await this.helperService.http.get<IMarketPrice[]>(
                urlString(`${this.SCAN_URL}/market`, {
                    rarities: Math.round(rarity),
                    canbreed: canBreed ? 'true' : 'false',
                    achievement: hasAchievement,
                    genes: gene,
                }),
            );

            return data[0];
        } catch (error: any) {
            console.log('An error occurred in method fetchDuckMarketPrice:', error.message);
            return {
                marketPrice: 0,
                lastTrades: [],
            };
        }
    };

    getDucksMarketPrice = async (
        ducks: EnrichedDuck[] | Duck[] | veggEnrichedDuck[],
    ): Promise<Array<{ marketPrice: number }>> => {
        if (ducks.length === 0) {
            return [];
        }

        const marketPrices = await this.helperService.fetchBatchesSequentially(
            chunkUpBy(100, ducks),
            async (ducksBatch) => {
                const rarities: number[] = [];
                const canBreed: boolean[] = [];
                const hasAchievement: boolean[] = [];
                const genes: string[] = [];

                ducksBatch.forEach((duck) => {
                    rarities.push(Math.round(duck.oldRarity ?? 0));
                    canBreed.push(duck.canBreed ? duck.canBreed : false);
                    hasAchievement.push(duck.achievements.length > 0);
                    genes.push(duck.name.split('-')[1]);
                });

                const { data: price } = await this.helperService.http.get<Array<{ marketPrice: number }>>(
                    urlString(`${this.SCAN_URL}/market`, {
                        rarities: rarities.join(','),
                        canbreed: canBreed.join(','),
                        achievement: hasAchievement.join(','),
                        genes: genes.join(','),
                    }),
                );

                return price;
            },
        );

        return marketPrices.flat(1);
    };
}

export default CommonScanService;
