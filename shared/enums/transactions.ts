/**
 * {@link https://docs.waves.tech/en/waves-node/node-api/response#introduction}
 */
export enum WAVES_ERORR_CODE {
    UNKNOWN = 0,
    INVALID_JSON = 1,
    WRONG_API_KEY = 2,
    TOO_BIG_SEQUENCES = 10,
    INVALID_SIGNATURE = 101,
    INVALID_ADDRESS = 102,
    INVALID_PUBLIC_KEY = 108,
    INVALID_MESSAGE = 109,
    OVERFLOW = 113,
    INVALID_TX_IDS = 116,
    BLOCK_NOT_EXISTS = 301,
    ALIAS_NOT_EXISTS = 302,
    WRONG_TIMING = 303,
    NO_DATA_FOR_KEY = 304,
    SCRIPT_COMPILATION = 305,
    SCRIPT_EXECUTION = 306,
    TX_DENIED_BY_ACCOUNT = 307,
    TX_DENIED_BY_TOKEN = 308,
    TXS_NOT_EXISTS = 311,
    UNSUPPORTED_TRANSACTION = 312,
    DUPLICATE_USER = 400,
    BALANCE_ERROR = 402,
    VALIDATION = 403,
    WRONG_CHAIN_ID = 404,
    WRONG_PROOFS_AMOUNT = 405,
    INVALID_TX_ID = 4001,
    INVALID_BLOCK_ID = 4002,
    INVALID_ASSET_ID = 4007,
}

/**
 * {@link https://github.com/wavesplatform/signer/blob/master/README.md#error-%D1%81odes}
 */
export enum SIGNER_ERROR_CODE {
    /**
     * validation
     * Invalid signer options: NODE_URL, debug
     */
    OPTIONS_ERROR = 1000,
    /**
     * network
     * Could not fetch network from {NODE_URL}: Failed to fetch
     */
    NETWORK_BYTE_ERROR = 1001,
    /**
     * authorization
     * Can't use method: getBalance. User must be logged in
     */
    AUTH_ERROR = 1002,
    /**
     * network
     * Could not connect the Provider
     */
    PROVIDER_CONNECT_ERROR = 1003,
    /**
     * provider
     * Can't use method: login. Provider instance is missing🛈 Possible reasons: the user is in Incognito mode or has disabled cookies
     */
    ENSURE_PROVIDER_ERROR = 1004,
    /**
     * validation
     * Invalid provider properties: connect
     */
    PROVIDER_INTERFACE_ERROR = 1005,
    /**
     * provider
     * Provider internal error: {...}. This is not error of signer
     */
    PROVIDER_INTERNAL_ERROR = 1006,
    /**
     * validation
     * Validation error for invoke transaction: {...}. Invalid arguments: senderPublicKey
     */
    API_ARGUMENTS_ERROR = 1007,
    /**
     * network
     * Network Error
     */
    NETWORK_ERROR = 1008,
}
