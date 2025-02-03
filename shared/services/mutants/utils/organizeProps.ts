import { AssetDetails, IMutantDetails } from '$shared/types';

function isAssetDetailKey(key: string): key is keyof AssetDetails {
    const assetProps = [
        'owner',
        'assetId',
        'decimals',
        'description',
        'issueHeight',
        'issueTimestamp',
        'issuer',
        'issuerPublicKey',
        'name',
        'originTransactionId',
        'quantity',
        'reissuable',
        'scripted',
    ];
    return assetProps.includes(key);
}

export function organizeItemProps(item: { key: string }) {
    const assetDetails = {};
    const remainingProps = {};

    for (const key in item) {
        if (isAssetDetailKey(key)) {
            assetDetails[key] = item[key];
        } else {
            remainingProps[key] = item[key];
        }
    }

    return {
        ...remainingProps,
        assetDetails: assetDetails as AssetDetails,
    } as IMutantDetails;
}
