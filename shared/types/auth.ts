export type AuthSignature = {
    publicKey: string;
    signature: string;
    timestamp: number;
};

export type RequireSignatureResult = {
    signature: string;
    timestamp: integer;
};
