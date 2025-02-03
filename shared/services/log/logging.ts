function checkForEnvId() {
    let envId = '';
    if (process.env.pm_id) {
        envId = `[${process.env.pm_id}]`;
    }
    return envId;
}

function basicLog(...args: any[]): void {
    console.log(...args);
}

function log(...args: any[]): void {
    let envId = checkForEnvId();
    console.log(`${envId}[${new Date().toISOString()}]`, ...args);
}

// Can be used to measure running times
function logTimer(label: string) {
    let envId = checkForEnvId();
    let startTime: number | null = null;

    return {
        start: (...args: any[]): void => {
            startTime = Date.now();
            console.log(`${envId}[${new Date().toISOString()}][${label}:start]`, ...args);
        },
        end: (...args: any[]): void => {
            if (!startTime) {
                throw new Error('Timer is not started');
            }
            console.log(
                `${envId}[${new Date().toISOString()}][${label}:end in ${(Date.now() - startTime) / 1000}s]`,
                ...args,
            );
        },
    };
}

function logError(e: any, ...keys: string[]) {
    log(...keys, e?.toJSON?.() ?? e?.message ?? e);
}

export { basicLog, log, logTimer, logError };
