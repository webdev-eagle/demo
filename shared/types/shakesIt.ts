export type ShakesItProps = {
    initTx: txId | string[];
    assetId?: assetId;
    assetRarity?: integer;
    finishBlock?: integer;
    result?: '' | assetId;
    status?: 'open' | 'finish';
    win0: string;
    win1?: string;
    win2?: string;
    win3?: string;
    win4?: string;
    win5?: string;
};
