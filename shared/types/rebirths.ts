export type RebirthProps = {
    initTx: txId | string[];
    assetId?: assetId;
    assetRarity?: integer;
    finishBlock?: integer;
    result?: '' | assetId;
    status?: 'open' | 'finish';
    win?: 'gone' | `perch_${'R' | 'G' | 'B' | 'Y'}` | 'phoenix' | 'incubator' | 'duckling';
    result1?: '' | assetId;
    win1?: 'gone' | `perch_${'R' | 'G' | 'B' | 'Y'}` | 'phoenix' | 'incubator' | 'duckling';
};
