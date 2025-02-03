import { getAddress } from '../../domain/constants';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { AllData } from './data-types';

const ORACLE_DAPP_ADDRESS = getAddress('ORACLE');

abstract class CommonOracleService extends AbstractDataFetcher<AllData> {
    protected DAPP_ADDRESS = ORACLE_DAPP_ADDRESS;

    getStatic = this.createStaticGetter({
        accBoosterAddress: 'static_accBoosterAddress',
        auctionsAddress: 'static_auctionsAddress',
        babyDuckAddress: 'static_babyDuckAddress',
        breederAddress: 'static_breederAddress',
        cfMasterAddress: 'static_cfMasterAddress',
        couponsAddress: 'static_couponsAddress',
        duckWrapper: 'static_duckWrapper',
        eggAssetId: 'static_eggAssetId',
        farmingAddress: 'static_farmingAddress',
        gameDappAddress: 'static_gameDappAddress',
        incubatorAddress: 'static_incubatorAddress',
        itemsAddress: 'static_itemsAddress',
        maintenance: 'static_maintenance',
        marketPlaceProxyAddress: 'static_marketPlaceProxyAddress',
        marketplaceAddress: 'static_marketplaceAddress',
        feeAggregator: 'static_feeAggregator',
        marketPlaceFee: 'static_marketPlaceFee',
        marketPlaceFeeArtefacts: 'static_marketPlaceFeeArtefacts',
        rebirthAddress: 'static_rebirthAddress',
        refContractAddress: 'static_refContractAddress',
        seaGateway: 'static_seaGateway',
        swopPromoAddress: 'static_swopPromoAddress',
        trustedContracts: 'static_trustedContracts',
        wearablesAddress: 'static_wearablesAddress',
        ducklingPrice: 'static_ducklingPrice',
        turtleIncubationFee: 'static_turtleIncubationFee',
        canineIncubationFee: 'static_canineIncubationFee',
        felineIncubationFee: 'static_felineIncubationFee',
        felineBreedingFee: 'static_peteAssetId',
        extraFee: 'static_extraFee',
        potionFee: 'static_potionFee',
        veggPerchFee: 'static_veggPerchFee',
        perchFee: 'static_perchFee',
        caninePerchFee: 'static_caninePerchFee',
        felinePerchFee: 'static_felinePerchFee',
        duplicatorFee: 'static_duplicatorFee',
        extraFeeRemove: 'static_extraFeeRemove',
        turtleSpiceRebirthPrice: 'static_turtleSpiceRebirthPrice',
        turtleWavesRebirthPrice: 'static_turtleWavesRebirthPrice',
        turtleEggRebirthPrice: 'static_turtleEggRebirthPrice',
        mutariumFee: 'static_mutariumFee',
        canineWavesRebirthPrice: 'static_canineWavesRebirthPrice',
        felinePeteRebirthPrice: 'static_felinePeteRebirthPrice',
    } as const);
}

export default CommonOracleService;
