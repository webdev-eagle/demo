export type TotalValues = {
    totalBreedings: number;
};

export interface StatisticsTimeSeriesFilter {
    from: string;
    to: string;
}

export type TimeSeriesResultItem = { date: string; count: number };

export type StatisticsTimeSeriesResult = {
    hatches: TimeSeriesResultItem[];
    rebirths: TimeSeriesResultItem[];
    breedings: TimeSeriesResultItem[];
};

export interface StatisticsTotalValuesResult {
    breedingCount: number;
    hatchesCount: number;
    rebirthsCount: number;
}

export interface AuctionEntity {
    auctionId: string;
    assetId: string;
    currency: string;
    description: string;
    instantPrice: number;
    startPrice: number;
    startedAt: number;
    status: string;
    type: string;
}

export interface NftStatistic {
    type: string;
    totalValues: StatisticsTotalValuesResult;
    totalValuesLastMonth: StatisticsTotalValuesResult;
    timeSeries: StatisticsTimeSeriesResult;
}
