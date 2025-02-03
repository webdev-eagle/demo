export const convertMarketplaceFee = (feeFromOracle: integer | undefined): number | null =>
    feeFromOracle != null ? feeFromOracle / 10 : null;
