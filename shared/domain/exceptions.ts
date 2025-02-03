import type { SIGNER_ERROR_CODE, WAVES_ERORR_CODE } from '../enums';
import type { HttpServerResponse, SignerError, WavesError } from '../types';

export const isWavesError = (e: unknown): e is WavesError =>
    typeof e === 'object' && e !== null && 'error' in e && 'message' in e && 'transaction' in e;

export const isWavesErrorByCode = (e: unknown, errorCode: WAVES_ERORR_CODE): e is WavesError => {
    if (!isWavesError(e)) {
        return false;
    }

    return e.error === errorCode;
};

export const isSignerError = (e: unknown): e is SignerError =>
    typeof e === 'object' && e !== null && 'code' in e && 'title' in e && 'type' in e;

export const isSignerErrorByCode = (e: unknown, errorCode: SIGNER_ERROR_CODE): e is SignerError => {
    if (!isSignerError(e)) {
        return false;
    }

    return e.code === errorCode;
};

export const formatHttpError = ({
    code,
    message,
    layer,
    stack,
    origin,
}: {
    code?: string | number;
    message: string;
    layer: string;
    stack?: string;
    origin?: any;
}) => ({
    code: code ?? 500,
    message,
    layer,
    stack,
    origin,
});

export const httpClientErrorHandler = (err: any, res: HttpServerResponse): HttpServerResponse => {
    const errorJSON = err?.toJSON?.();
    const data = err?.response?.data;

    if (errorJSON) {
        return res.status(errorJSON.status ?? 500).json({
            code: errorJSON.status ?? 500,
            layer: data?.error?.layer ?? 'backend',
            message: data?.error?.message ?? data?.message ?? errorJSON.message ?? 'Unknown error',
            stack: errorJSON.stack,
            origin: data?.origin,
            config: {
                url: errorJSON?.config?.url,
                method: errorJSON?.config?.method,
                data: errorJSON?.config?.data,
                headers: errorJSON?.config?.headers,
            },
        });
    }

    return res.status(err?.status ?? 500).json({
        code: err?.status ?? 500,
        layer: err?.layer ?? 'backend',
        message: data?.error?.message ?? data?.message ?? err?.message?.toString() ?? 'Unknown error',
        stack: err?.stack,
        origin: data?.origin ?? { message: err?.message, stack: err?.stack, layer: data?.error?.layer },
    });
};
