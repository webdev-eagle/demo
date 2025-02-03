export const calculateFarmPowerMutants = (height, uniqueGenes) => {
    const multplier = Math.floor(
        ((height - Number(process.env.FARMING_CALCULATION_VALUE || 3750000)) * 100) / (60 * 24 * 30 * 3),
    );
    //WE DO IT *97/100 because of rounding and users otherwise cry with wrong rounding
    const output = Math.floor((Math.pow(1.5, uniqueGenes) * 100 * multplier) / 100);
    return output;
};

export const calculateFPWithMtntGenes = (height: integer, name: string) => {
    const multplier = Math.floor(((height - Number(process.env.FARMING_CALCULATION_VALUE)) * 100) / (60 * 24 * 30 * 3));
    const [_, genotype, generation] = name.split('-');
    const calculatableGenes = genotype
        .split('')
        .filter((_, ind) => ind % 2 === 1)
        .join('');
    const uniqueGenes = generation.startsWith('U') ? 8 : new Set(calculatableGenes).size;

    const output = (Math.floor(Math.pow(1.5, uniqueGenes) * 100) * multplier) / 100;
    return Math.floor(output);
};

export const uniqueGenesFromMutants = (turtleGene, duckGene) => {
    let combinedArray: string[] = [...new Set([...turtleGene, ...duckGene])];
    return combinedArray.length;
};

export const calculateFpWithBasePower = (basePower: number, rarity: number) => Math.floor((basePower / 100) * rarity);
