import type { ContractIntegerData, ContractStringData } from '../../types';

export type AccBoosterAddress = ContractStringData<'static_accBoosterAddress', addressId>;
export type AuctionsAddress = ContractStringData<'static_auctionsAddress', addressId>;
export type BabyDuckAddress = ContractStringData<'static_babyDuckAddress', addressId>;
export type BreederAddress = ContractStringData<'static_breederAddress', addressId>;
export type CfMasterAddress = ContractStringData<'static_cfMasterAddress', addressId>;
export type CouponsAddress = ContractStringData<'static_couponsAddress', addressId>;
export type DuckWrapper = ContractStringData<'static_duckWrapper', addressId>;
export type EggAssetId = ContractStringData<'static_eggAssetId', assetId>;
export type FarmingAddress = ContractStringData<'static_farmingAddress', addressId>;
export type GameDappAddress = ContractStringData<'static_gameDappAddress', addressId>;
export type IncubatorAddress = ContractStringData<'static_incubatorAddress', addressId>;
export type ItemsAddress = ContractStringData<'static_itemsAddress', addressId>;
export type Maintenance = ContractStringData<'static_maintenance'>;
export type MarketPlaceProxyAddress = ContractStringData<'static_marketPlaceProxyAddress', addressId>;
export type MarketplaceAddress = ContractStringData<'static_marketplaceAddress', addressId>;
export type FeeAggregatorAddress = ContractStringData<'static_feeAggregator', addressId>;
export type MarketPlaceFee = ContractIntegerData<'static_marketPlaceFee'>;
export type MarketPlaceFeeArtefacts = ContractIntegerData<'static_marketPlaceFeeArtefacts'>;
export type RebirthAddress = ContractStringData<'static_rebirthAddress', addressId>;
export type RefContractAddress = ContractStringData<'static_refContractAddress', addressId>;
export type SeaGateway = ContractStringData<'static_seaGateway', addressId>;
//export type SwopPromoAddress = ContractStringData<'static_swopPromoAddress', addressId>;
export type TrustedContracts = ContractStringData<'static_trustedContracts'>;
export type WearablesAddress = ContractStringData<'static_wearablesAddress', addressId>;
export type DucklingPrice = ContractIntegerData<'static_ducklingPrice'>;
export type ExtraFee = ContractIntegerData<'static_extraFee'>;
export type PotionFee = ContractIntegerData<'static_potionFee'>;
export type DuplicatorFee = ContractIntegerData<'static_duplicatorFee'>;
export type ExtraFeeRemove = ContractIntegerData<'static_extraFeeRemove'>;
export type TurtleIncubationFee = ContractIntegerData<'static_turtleIncubationFee'>;
export type CanineIncubationFee = ContractIntegerData<'static_canineIncubationFee'>;
export type FelineIncubationFee = ContractIntegerData<'static_felineIncubationFee'>;
export type TurtleSpiceRebirthPrice = ContractIntegerData<'static_turtleSpiceRebirthPrice'>;
export type TurtleWavesRebirthPrice = ContractIntegerData<'static_turtleWavesRebirthPrice'>;
export type TurtleEggRebirthPrice = ContractIntegerData<'static_turtleEggRebirthPrice'>;
export type CanineWavesRebirthPrice = ContractIntegerData<'static_canineWavesRebirthPrice'>;
export type FelinePeteRebirthPrice = ContractIntegerData<'static_felinePeteRebirthPrice'>;
export type VeggPerchPrice = ContractIntegerData<'static_veggPerchFee'>;
export type PerchPrice = ContractIntegerData<'static_perchFee'>;
export type MutariumPrice = ContractIntegerData<'static_mutariumFee'>;
export type PerchPriceCanine = ContractIntegerData<'static_caninePerchFee'>;
export type PerchPriceFeline = ContractIntegerData<'static_felinePerchFee'>;
export type AllData =
    | AccBoosterAddress
    | AuctionsAddress
    | BabyDuckAddress
    | BreederAddress
    | CfMasterAddress
    | CouponsAddress
    | DuckWrapper
    | EggAssetId
    | FarmingAddress
    | GameDappAddress
    | IncubatorAddress
    | ItemsAddress
    | Maintenance
    | MarketPlaceProxyAddress
    | MarketplaceAddress
    | FeeAggregatorAddress
    | MarketPlaceFee
    | MarketPlaceFeeArtefacts
    | RebirthAddress
    | RefContractAddress
    | SeaGateway
    //    | SwopPromoAddress
    | TrustedContracts
    | WearablesAddress
    | DucklingPrice
    | ExtraFee
    | PotionFee
    | DuplicatorFee
    | ExtraFeeRemove
    | TurtleIncubationFee
    | CanineIncubationFee
    | FelineIncubationFee
    | TurtleSpiceRebirthPrice
    | TurtleWavesRebirthPrice
    | TurtleEggRebirthPrice
    | CanineWavesRebirthPrice
    | FelinePeteRebirthPrice
    | VeggPerchPrice
    | PerchPrice
    | MutariumPrice
    | PerchPriceCanine
    | PerchPriceFeline;

type GetKey<T> = T extends `static_${infer K}` ? K : never;

export type AllDataMap = { [T in AllData as GetKey<T['key']>]: T['value'] };

export type StaticKey = keyof AllDataMap;
