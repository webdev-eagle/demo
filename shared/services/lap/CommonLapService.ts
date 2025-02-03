class CommonLapService {
    calculatePrize = (
        base: number,
        coefficient: number,
        subSum: number,
        budget: number,
        wins: number,
        factor = 1,
    ): number => {
        let result = 0;

        for (let i = 0; i < factor; i++) {
            const winsFactor = wins ** coefficient;
            result += base ** winsFactor * (budget / subSum);
        }

        return Math.trunc(result * 1e8) / 1e8;
    };

    format = (num: number): number => Math.trunc(num * 1e8) / 1e8;
}

export default CommonLapService;
