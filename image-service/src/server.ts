import './sentry';

import express from 'express';

import { log } from '$shared/services/log';
import * as Sentry from '@sentry/node';

import imageRoutes from './routes/images';

const app = express();
const port = process.env.PORT || 8010;

app.use('/api', imageRoutes);

export const startServer = (): void => {
    Sentry.setupExpressErrorHandler(app);
    app.listen(port, () => {
        log(`Image service at http://localhost:${port}`);
    });
};
