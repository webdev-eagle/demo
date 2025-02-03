export interface AddressAssetBalance {
    address: addressId;
    assetId: assetId;
    balance: integer;
}

export interface AddressWavesBalance {
    id: addressId;
    balance: integer;
}

export interface AssetBalanceResponse {
    data: AddressAssetBalance;
}
