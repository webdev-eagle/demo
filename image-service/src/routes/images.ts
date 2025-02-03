import express from 'express';
import type { ParsedQs } from 'qs';

import { CANINE_COLORS, DUCK_COLORS, FELINE_COLORS, TURTLE_COLORS, possibleGenes } from '$shared/constants';
import { getAddress } from '$shared/domain/constants';
import { Worlds } from '$shared/enums';
import type { CacheApi, DuckConnections } from '$shared/types';
import { limit } from '$shared/utils';

import { MUTANT_COLORS } from '$shared/constants/mutants';
import { getCanineColor, onFarmingCanines } from '../domain/canines';
import { getDruckParam, getDuckColor, onFarming, onVeggFarming } from '../domain/ducks';
import { getFelineColor, onFarmingFelines } from '../domain/felines';
import { getMutantColor, onFarmingMutants } from '../domain/mutants';
import { getTurtleColor, onFarmingTurtles } from '../domain/turtles';
import cacheService from '../services/CacheService';
import wearablesService from '../services/WearablesService';
import * as generator from '../services/imageGenerator';
import { render } from '../utils';

const WORLD = {
    [getAddress('HUNT_DAPP')]: Worlds.Hunt,
    [getAddress('GAME_DAPP')]: Worlds.Wars,
};

const imageRoutes = express.Router();

const generateDucksImage = async (duckName: string, params: ParsedQs): Promise<string> => {
    const grayscale = params.grayscale?.toString().toLowerCase() === 'true';
    const items: DuckConnections = wearablesService.collect(params.items?.toString().split(',') ?? []);

    let perchColor = null;
    const genotype = duckName.split('.')[0].toUpperCase();

    if (genotype.length !== 8) {
        throw new Error('Filename is not 8 genes');
    }

    if (params.onPerch && (params.onPerch as any).toLowerCase() === 'true') {
        if (params.color && DUCK_COLORS.hasOwnProperty((params.color as any).toUpperCase())) {
            perchColor = (params.color as any).toUpperCase();
        } else {
            throw new Error('Bad color type for perch');
        }
    }

    if (params.onVPerch && (params.onVPerch as any).toLowerCase() === 'true') {
        // TODO: VPerches are ALWAYS pink for now, so we dont have to check if color exists in duck colors. We just say it is pink
        // example url http://localhost:8010/api/images/DUCK-LLLLLLLL-GG.svg?onVPerch=true
        perchColor = 'P';
    }

    for (let k = 0; k < genotype.length; k++) {
        if (possibleGenes.indexOf(genotype[k]) === -1) {
            throw new Error('Not existing duck genome');
        }
    }

    let world = Worlds.None;

    if (params.jedi === 'true') {
        world = Worlds.Wars;
    } else if (params.world === 'hunt') {
        world = Worlds.Hunt;
    }

    return generator.generateDuckFromGenotype(genotype, {
        perchColor,
        world,
        druck: params.druck?.toString(),
        items,
        grayscale,
    });
};

const generateTurtleImage = async (turtleName: string, params: ParsedQs): Promise<string> => {
    const grayscale = params.grayscale?.toString().toLowerCase() === 'true';
    const items: DuckConnections = wearablesService.collect(params.items?.toString().split(',') ?? []);

    let beachColor = null;
    const genotype = turtleName.split('.')[0].toUpperCase();

    if (genotype.length !== 8) {
        throw new Error('Filename is not 8 genes');
    }

    if (params.onPerch && (params.onPerch as any).toLowerCase() === 'true') {
        if (params.color && TURTLE_COLORS.hasOwnProperty((params.color as any).toUpperCase())) {
            beachColor = (params.color as any).toUpperCase();
        } else {
            throw new Error('Bad color type for perch');
        }
    }

    for (let k = 0; k < genotype.length; k++) {
        if (possibleGenes.indexOf(genotype[k]) === -1) {
            throw new Error('Not existing duck genome');
        }
    }

    let world = Worlds.None;

    if (params.jedi === 'true') {
        world = Worlds.Wars;
    } else if (params.world === 'hunt') {
        world = Worlds.Hunt;
    }
    return generator.generateTurtleFromGenotype(genotype, {
        beachColor,
        world,
        items,
        grayscale,
    });
};

const generateCaninesImage = async (canineName: string, params: ParsedQs): Promise<string> => {
    const grayscale = params.grayscale?.toString().toLowerCase() === 'true';
    const items: DuckConnections = wearablesService.collect(params.items?.toString().split(',') ?? []);

    let dockingColor = null;
    const genotype = canineName.split('.')[0].toUpperCase();

    if (genotype.length !== 8) {
        throw new Error('Filename is not 8 genes');
    }

    if (params.onPerch && (params.onPerch as any).toLowerCase() === 'true') {
        if (params.color && CANINE_COLORS.hasOwnProperty((params.color as any).toUpperCase())) {
            dockingColor = (params.color as any).toUpperCase();
        } else {
            throw new Error('Bad color type for perch');
        }
    }

    for (let k = 0; k < genotype.length; k++) {
        if (possibleGenes.indexOf(genotype[k]) === -1) {
            throw new Error('Not existing duck genome');
        }
    }

    let world = Worlds.None;

    if (params.jedi === 'true') {
        world = Worlds.Wars;
    } else if (params.world === 'hunt') {
        world = Worlds.Hunt;
    }

    return generator.generateCanineFromGenotype(genotype, {
        dockingColor,
        world,
        items,
        grayscale,
    });
};

const generateFelinesImage = async (felineName: string, params: ParsedQs): Promise<string> => {
    const grayscale = params.grayscale?.toString().toLowerCase() === 'true';
    const items: DuckConnections = wearablesService.collect(params.items?.toString().split(',') ?? []);

    let battlegroundColor = null;
    const genotype = felineName.split('.')[0].toUpperCase();

    if (genotype.length !== 8) {
        throw new Error('Filename is not 8 genes');
    }

    if (params.onPerch && (params.onPerch as any).toLowerCase() === 'true') {
        if (params.color && FELINE_COLORS.hasOwnProperty((params.color as any).toUpperCase())) {
            battlegroundColor = (params.color as any).toUpperCase();
        } else {
            throw new Error('Bad color type for perch');
        }
    }

    for (let k = 0; k < genotype.length; k++) {
        if (possibleGenes.indexOf(genotype[k]) === -1) {
            throw new Error('Not existing duck genome');
        }
    }

    let world = Worlds.None;

    if (params.jedi === 'true') {
        world = Worlds.Wars;
    } else if (params.world === 'hunt') {
        world = Worlds.Hunt;
    }

    return generator.generateFelineFromGenotype(genotype, {
        battlegroundColor,
        world,
        items,
        grayscale,
    });
};

const generateMutantImage = async (mutantName: string, params: ParsedQs): Promise<string> => {
    const grayscale = params.grayscale?.toString().toLowerCase() === 'true';

    let mutariumColor = null;
    const genotype = mutantName.split('.')[0];

    if (params.onFarming && (params.onFarming as any).toLowerCase() === 'true') {
        if (params.color && MUTANT_COLORS.hasOwnProperty((params.color as any).toUpperCase())) {
            mutariumColor = (params.color as any).toUpperCase();
        } else {
            throw new Error(`Bad color type for Mutariums ${mutariumColor}`);
        }
    }

    for (let k = 0; k < genotype.length; k++) {
        if (possibleGenes.indexOf(genotype[k].toUpperCase()) === -1) {
            throw new Error('Not existing mutant genome');
        }
    }

    let world = Worlds.None;

    if (params.jedi === 'true') {
        world = Worlds.Wars;
    } else if (params.world === 'hunt') {
        world = Worlds.Hunt;
    }
    return generator.generateMutantFromGenotype(genotype, {
        mutariumColor,
        world,
        // items,
        grayscale,
    });
};

const isMutarium = (name: string): boolean => name.startsWith('ART-MUTARIUM');

const getWorld = (locks: CacheApi.Lock[]): Worlds => {
    const lock = locks.find(({ dApp }) => dApp in WORLD);
    return WORLD[lock?.dApp] ?? Worlds.None;
};

const getSvg = async (name: string, queryParams: ParsedQs): Promise<string> => {
    if (name === 'DUCK-MANTLE-0' || name === 'ACCESS-RACE' || name === 'ACCESS-HUNT' || name.startsWith('ART')) {
        return generator.generateItem(name);
    }
    if (name.startsWith('TRTL')) {
        const [, genotype] = name.split('-');

        return generateTurtleImage(genotype, queryParams);
    }
    if (name.startsWith('DUCK')) {
        const [, genotype] = name.split('-');
        return generateDucksImage(genotype, queryParams);
    }
    if (name.startsWith('MTNT')) {
        const [, genotype] = name.split('-');
        return generateMutantImage(genotype, queryParams);
    }
    if (name.startsWith('BABY')) {
        return generator.generateDuckling(name, {
            stage: parseInt(queryParams.stage?.toString() ?? '1', 10),
        });
    }
    if (name.startsWith('CANI')) {
        const [, genotype] = name.split('-');
        return generateCaninesImage(genotype, queryParams);
    }
    if (name.startsWith('FELI')) {
        const [, genotype] = name.split('-');
        return generateFelinesImage(genotype, queryParams);
    }

    throw new Error('Not supported NFT type');
};

imageRoutes.get('/ducks/:assetId.:type', async (req, res) => {
    const { assetId, type } = req.params;

    try {
        const duck = await cacheService.fetchDuck(assetId);
        const { name, connections, locks, exists } = duck;
        const grayscale = exists === false || req.query.filter === 'grayscale';
        const genotype = name.split('-')[1];
        const items = connections.reduce((res: DuckConnections, { item, type }) => ({ ...res, [type]: item.name }), {});
        const isVeggFarming = onVeggFarming(duck) ? 'P' : null;
        const perchColor = onFarming(duck) ? getDuckColor(duck) : isVeggFarming;
        const druck = getDruckParam(assetId);
        const world = getWorld(locks);

        const svgBody = generator.generateDuckFromGenotype(genotype, {
            perchColor,
            world,
            druck,
            items,
            grayscale,
        });

        await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

// TODO: turtles
imageRoutes.get('/turtles/:assetId.:type', async (req, res) => {
    const { assetId, type } = req.params;

    try {
        const turtle = await cacheService.fetchTurtle(assetId);
        const { name, connections, locks, exists } = turtle;
        const grayscale = exists === false || req.query.filter === 'grayscale';
        const genotype = name.split('-')[1];
        const items = connections.reduce((res: DuckConnections, { item, type }) => ({ ...res, [type]: item.name }), {});
        const beachColor = onFarmingTurtles(turtle) ? getTurtleColor(turtle) : null;
        const world = getWorld(locks);

        const svgBody = generator.generateTurtleFromGenotype(genotype, {
            beachColor,
            world,
            items,
            grayscale,
        });

        await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

imageRoutes.get('/mutants/:assetId.:type', async (req, res) => {
    const { assetId, type } = req.params;
    try {
        const mutant = await cacheService.fetchMutant(assetId);
        const { connections, locks, name } = mutant;
        // const grayscale = exists === false || req.query.filter === 'grayscale';
        const genotype = name.split('-')[1];
        const items = connections.reduce((res: DuckConnections, { item, type }) => ({ ...res, [type]: item.name }), {});
        const mutariumColor = onFarmingMutants(mutant) ? getMutantColor(mutant) : null;
        const world = getWorld(locks);

        const svgBody = generator.generateMutantFromGenotype(genotype, {
            mutariumColor,
            world,
            items,
            grayscale: false,
        });

        await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

imageRoutes.get('/felines/:assetId.:type', async (req, res) => {
    const { assetId, type } = req.params;

    try {
        const felines = await cacheService.fetchFelines(assetId);
        const { name, connections, locks, exists } = felines;
        const grayscale = exists === false || req.query.filter === 'grayscale';
        const genotype = name.split('-')[1];
        const items = connections.reduce((res: DuckConnections, { item, type }) => ({ ...res, [type]: item.name }), {});
        const battlegroundColor = onFarmingFelines(felines) && getFelineColor(felines);
        const world = getWorld(locks);
        const svgBody = generator.generateFelineFromGenotype(genotype, {
            battlegroundColor,
            world,
            items,
            grayscale,
        });

        await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

imageRoutes.get('/canines/:assetId.:type', async (req, res) => {
    const { assetId, type } = req.params;

    try {
        const canines = await cacheService.fetchCanines(assetId);
        const { name, connections, locks, exists } = canines;
        const grayscale = exists === false || req.query.filter === 'grayscale';
        const genotype = name.split('-')[1];
        const items = connections.reduce((res: DuckConnections, { item, type }) => ({ ...res, [type]: item.name }), {});
        const isVeggFarming = onVeggFarming(canines) ? 'P' : null;
        const dockingColor = onFarmingCanines(canines) ? getCanineColor(canines) : isVeggFarming;
        const world = getWorld(locks);

        const svgBody = generator.generateCanineFromGenotype(genotype, {
            dockingColor,
            world,
            items,
            grayscale,
        });

        await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

imageRoutes.get('/ducklings/:assetId.:type', async (req, res) => {
    const { assetId, type } = req.params;

    try {
        const duckling = await cacheService.fetchDuckling(assetId);
        const growPercentage = duckling.growth / duckling.feedNeeded;
        const stage = Math.trunc(growPercentage / 0.25) + 1;
        const svgBody = generator.generateDuckling(duckling.name, { stage: limit(1, 4, stage) });

        await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

imageRoutes.get('/items/:assetId.:type', async (req, res) => {
    const { assetId, type } = req.params;

    try {
        const item = await cacheService.fetchItem(assetId);
        const svgBody = generator.generateItem(item.name);

        await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

imageRoutes.get('/perches/:color.:type', async (req, res) => {
    const { color, type } = req.params;

    const svgBody = generator.getPerch(color);
    await render(svgBody, type, res);
});

imageRoutes.get('/legacy-perches/:color.:type', async (req, res) => {
    const { color, type } = req.params;

    const svgBody = generator.getPerch(color);
    await render(svgBody, type, res);
});

imageRoutes.get('/vperches/:color.:type', async (req, res) => {
    const { type } = req.params;

    const svgBody = generator.getVPerch();
    await render(svgBody, type, res);
});

imageRoutes.get('/beaches/:color.:type', async (req, res) => {
    const { color, type } = req.params;

    const svgBody = generator.getBeach(color);
    await render(svgBody, type, res);
});

imageRoutes.get('/mutariums/:color.:type', async (req, res) => {
    const { color, type } = req.params;

    const svgBody = generator.getMutarium(color);
    await render(svgBody, type, res);
});

imageRoutes.get('/dockings/:color.:type', async (req, res) => {
    const { color, type } = req.params;

    const svgBody = generator.getDocking(color);
    await render(svgBody, type, res);
});

imageRoutes.get('/battlegrounds/:color.:type', async (req, res) => {
    const { color, type } = req.params;

    const svgBody = generator.getBattleground(color);
    await render(svgBody, type, res);
});

imageRoutes.get('/images/:name.:type', async (req, res) => {
    const { name, type } = req.params;
    let svgBody = '';
    try {
        if (isMutarium(name)) {
            svgBody = generator.getMutarium(name.split('-').at(-1));
        } else {
            svgBody = await getSvg(name, req.query);
        }

        return await render(svgBody, type, res);
    } catch (e) {
        return res.status(404).send(e.message);
    }
});

export default imageRoutes;
