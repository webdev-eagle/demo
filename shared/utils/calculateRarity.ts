import { isFakeDuck, isJackpot } from '$shared/domain/ducks';

export const calculateRarity = <T extends { issuer: addressId; name: string }>(amountOfDuck: number, nft: T) => {
    if (isFakeDuck(nft)) {
        return -1; // IT'S FAKE NFT!!!
    } else if (isJackpot(nft)) {
        return 100;
    }
    const rarity = (1 / Math.sqrt(amountOfDuck)) * 100;

    return Number.isNaN(rarity) ? 100 : rarity;
};

export const calculateRarityMutant = <T extends { issuer: addressId; name: string }>(amountOfDuck: number) => {
    const rarity = (1 / Math.sqrt(amountOfDuck)) * 100;

    return Number.isNaN(rarity) ? 100 : rarity;
};
