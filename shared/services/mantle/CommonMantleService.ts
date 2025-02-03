class CommonMantleService {
    calculatePriceForLevel = (level: number): number => Math.ceil(((level - 1) / 10) ** (1 / 0.6) * 100) / 100;

    calculateLevelForInvestment = (eggsInvested: number): number => Math.floor(1 + 10 * eggsInvested ** 0.6);
}

export default CommonMantleService;
