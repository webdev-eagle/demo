import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Ensure to call this before importing any other modules!
if ((process.env.NODE_ENV === 'production' && !process.env.LOCAL_PROD) || process.env.SENTRY === 'enabled') {
    Sentry.init({
        dsn: 'https://b91d3b7d0f6b71fa65739fcdc41dfa1a@sentry.blackturtle.eu/2',
        integrations: [
            // Add our Profiling integration
            nodeProfilingIntegration(),
            Sentry.captureConsoleIntegration({
                levels: ['error'],
            }),
            Sentry.debugIntegration(),
            Sentry.extraErrorDataIntegration(),
            Sentry.sessionTimingIntegration(),
        ],
        debug: process.env.NODE_ENV !== 'production',
        environment: process.env.NODE_ENV,
        attachStacktrace: true,
        tracesSampleRate: 1.0,
        initialScope: {
            tags: {
                service: 'hunt',
            },
        },
        // Set sampling rate for profiling
        // This is relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });
}
