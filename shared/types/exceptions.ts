import type { WAVES_ERORR_CODE } from '../enums';

//{
//    "error": 306,
//    "message": "Error while executing account-script: You are already staking ART-XMISTL",
//    "transaction": {
//        "type": 16,
//        "id": "FBs1f7uh7oTvV2v25hDiWZR1VVLh4XjQc9seFXHhq7Uv",
//        "sender": "3P44yqcpfhPF2iC1nptm2ZJCTaN7VYhz9og",
//        "senderPublicKey": "9x9Usb3uqom5rSsgxshtmEtZ9zxAgK9QwFe2kmS2X3Z1",
//        "fee": 500000,
//        "feeAssetId": null,
//        "timestamp": 1647913486094,
//        "proofs": [
//            "5UXFnSsNA9K6UnbdXEXT4iNnquW8JYUDsTahRwkm8bqPwM8dCuUEoEQB42EhukEVJAGFmHCGpBacu8cVEvQN1euR"
//        ],
//        "version": 2,
//        "chainId": 87,
//        "dApp": "3PAi1ePLQrYrY3jj9omBtT6isMkZsapbmks",
//        "payment": [
//            {
//                "amount": 1,
//                "assetId": "RVjnrPQCHpnxyYE7R1v7zLdWgNYV9MJDtLFRNPbi3tx"
//            }
//        ],
//        "call": {
//            "function": "stakeItem",
//            "args": []
//        }
//    }
//}

export interface WavesError {
    error: WAVES_ERORR_CODE;
    message: string;
    transaction: any; // Transaction type
}

export interface SignerError {
    code: number;
    title: string;
    type: string;
    details?: string;
    errorArgs?: any;
}
