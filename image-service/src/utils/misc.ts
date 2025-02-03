export const assetIdAsFloat = (assetId: string): number => {
    let i = 0;
    let hash = 0;
    if (!assetId) return 0;
    while (i < assetId.length) hash = (hash << 5) + hash + assetId.charCodeAt(i++);

    return Math.abs(((hash * 10) % 0x7fffffff) / 0x7fffffff);
};
