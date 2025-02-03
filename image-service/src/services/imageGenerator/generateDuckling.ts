import DucklingImageGenerator from '../DucklingImageGenerator';

const generateDuckling = (name: string, params: { stage: number }): string => {
    const ducklingImageGenerator = new DucklingImageGenerator(name, params);

    return ducklingImageGenerator.getDucklingImage();
};

export default generateDuckling;
