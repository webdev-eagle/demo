export interface ILastBlockHeader {
    'version': number;
    'timestamp': number;
    'reference': string;
    'nxt-consensus': {
        'base-target': number;
        'generation-signature': string;
    };
    'transactionsRoot': string;
    'id': string;
    'features': [];
    'desiredReward': number;
    'generator': string;
    'generatorPublicKey': string;
    'signature': string;
    'blocksize': number;
    'transactionCount': number;
    'height': number;
    'totalFee': number;
    'reward': number;
    'VRF': string;
}
