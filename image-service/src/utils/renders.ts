import type { Response } from 'express';
import puppeteer from 'puppeteer';

import { isDevOnlyEnv } from '$shared/utils';

const puppeteerOptions = isDevOnlyEnv() ? {} : { args: ['--no-sandbox', '--disable-setuid-sandbox'] };

export const renderImage = async (html = '', width = 1600, height = 836): Promise<string | Buffer> => {
    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html);
    const content = await page.$('body');
    const imageBuffer = await content.screenshot({ omitBackground: true });
    await page.close();
    await browser.close();

    return imageBuffer;
};

export const render = async (svg: string, type: string, res: Response) => {
    if (type === 'png') {
        const imageBuffer = await renderImage(svg, 512, 512);

        return res.set('Content-Type', 'image/png').send(imageBuffer);
    }

    return res.set('Content-Type', 'image/svg+xml').send(svg);
};
