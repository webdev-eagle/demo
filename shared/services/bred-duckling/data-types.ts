import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type StatsAmount = ContractIntegerData<'stats_amount'>;
export type GlobalIssuedTimestamp = ContractIntegerData<'global_issued_timestamp'>;

export type TotalFeed = ContractIntegerData<`duckling_${ducklingId}_feed`, eggint>;
export type DucklingBlacklisted = ContractBooleanData<`duckling_${ducklingId}_blacklisted`>;
export type DucklingLevel = ContractStringData<`duckling_${ducklingId}_level`, stringed<integer>>;
//TODO: disabling this to see if something breaks with ducklings, to see if we can filter/remove this from the cache
//export type DucklingFedLastTimestamp = ContractIntegerData<`duckling_${ducklingId}_fedLastTs`>;
export type DucklingStartPercentage = ContractIntegerData<`duckling_${ducklingId}_startPercentage`>;
export type IssuedByFeedCall = ContractBooleanData<`duckling_${assetId}_issuedByFeedCall`>;
export type FeedTxStats = ContractIntegerData<`duckling_${ducklingId}_stat_${timestamp}`, eggint>;

export type IssuedDuckling = ContractStringData<`${addressId}_${txId}_di`, assetId>;
export type DucklingGrown = ContractBooleanData<`duckling_${ducklingId}_grown`>;

export type AllData =
    | StatsAmount
    | GlobalIssuedTimestamp
    | TotalFeed
    | DucklingBlacklisted
    | DucklingLevel
    //| DucklingFedLastTimestamp
    | DucklingStartPercentage
    | IssuedByFeedCall
    | FeedTxStats
    | IssuedDuckling
    | DucklingGrown;
