import type { AuthSignature } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const authParams = (authSignature: AuthSignature): { s: string; t: number; k: string } => ({
    s: authSignature.signature,
    t: authSignature.timestamp,
    k: authSignature.publicKey,
});
