import type { ContractBooleanData, ContractIntegerData, ContractStringData } from '../../types';

export type StatsAmount = ContractIntegerData<'stats_amount'>;
export type GlobalIssuedTimestamp = ContractIntegerData<'global_issued_timestamp'>;

export type TotalFeed = ContractIntegerData<`duckling_${ducklingId}_feed`, eggint>;
export type DucklingBlacklisted = ContractBooleanData<`duckling_${ducklingId}_blacklisted`>;
//TODO: see if anything breaks if we disable this to later clean up and filter out.
//export type DucklingFedTimestamp = ContractIntegerData<`duckling_${ducklingId}_fedTs`, eggint>;
export type DucklingLevel = ContractStringData<`duckling_${ducklingId}_level`, stringed<integer>>;
//export type DucklingFedLastTimestamp = ContractIntegerData<`duckling_${ducklingId}_fedLastTs`>;
export type DucklingStartPercentage = ContractIntegerData<`duckling_${ducklingId}_startPercentage`>;
export type DucklingIssuedByFeedCall = ContractBooleanData<`duckling_${ducklingId}_issuedByFeedCall`>;
export type IssuedByFeedCall = ContractBooleanData<`duckling_${assetId}_issuedByFeedCall`>;
export type FeedTxStats = ContractIntegerData<`duckling_${ducklingId}_stat_${timestamp}`, eggint>;
export type FeedTxStatsDebug = ContractStringData<`duckling_${ducklingId}_stat_${timestamp}_debug`>;

export type AddressNonce = ContractIntegerData<`address_${addressId}_nonce`>;
export type IssuedDuckling = ContractStringData<`${addressId}_${txId}_di`, assetId>;
export type DucklingGrown = ContractBooleanData<`duckling_${ducklingId}_grown`>;

export type AllData =
    | StatsAmount
    | GlobalIssuedTimestamp
    | TotalFeed
    | DucklingBlacklisted
    //| DucklingFedTimestamp
    | DucklingLevel
    //| DucklingFedLastTimestamp
    | DucklingStartPercentage
    | DucklingIssuedByFeedCall
    | IssuedByFeedCall
    | FeedTxStats
    | FeedTxStatsDebug
    | AddressNonce
    | IssuedDuckling
    | DucklingGrown;
