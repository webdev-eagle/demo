export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const attempt = <R>(
    fn: () => Promise<R>,
    {
        isResultSatisfies = () => true,
        interAttemptsSleepTime = 1,
        maxAttempts = 0,
        maxTimeout = 0,
    }: {
        isResultSatisfies?: (res: R) => boolean;
        interAttemptsSleepTime?: number;
        maxAttempts?: number;
        maxTimeout?: number;
    } = {},
): Promise<R | undefined> => {
    return new Promise<R | undefined>((res, rej) => {
        const status: { error: unknown | null; rejected: boolean } = { error: null, rejected: false };
        const timerId = setTimeout(() => {
            if (maxTimeout) {
                status.error = status.error ?? new Error('Attempts timeout');
                reject();
            }
        }, maxTimeout);

        async function resolve(result: Promise<R | undefined>) {
            const value = await result;
            clearTimeout(timerId);
            res(value);
        }

        function reject() {
            status.rejected = true;
            clearTimeout(timerId);
            rej(status.error);
        }

        const oneAttempt = async (attemptNumber = 1) => {
            if ((maxAttempts && attemptNumber >= maxAttempts) || status.rejected) {
                return;
            }

            try {
                const result = await fn();

                if (isResultSatisfies(result)) {
                    return result;
                }

                await sleep(interAttemptsSleepTime);

                return oneAttempt(attemptNumber + 1);
            } catch (e) {
                status.error = e;
                if ((maxAttempts && attemptNumber + 1 >= maxAttempts) || status.rejected) {
                    return reject();
                }

                await sleep(interAttemptsSleepTime);

                return oneAttempt(attemptNumber + 1);
            }
        };

        return resolve(oneAttempt());
    });
};
