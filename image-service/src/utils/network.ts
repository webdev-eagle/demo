import { createServer } from 'net';

export const isPortTaken = (port: number): Promise<boolean> =>
    new Promise((resolve, reject) => {
        const tester = createServer()
            .once('error', (err: any) => {
                if (err.code != 'EADDRINUSE') return reject(err);
                resolve(true);
            })
            .once('listening', () => {
                tester.once('close', () => resolve(false)).close();
            })
            .listen(port);
    });
