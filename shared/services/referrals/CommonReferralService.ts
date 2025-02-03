import { getAddress } from '../../domain/constants';

import AbstractDataFetcher from '../AbstractDataFetcher';
import type CommonHelperService from '../helper';
import type {
    EarnedRewardAmount,
    ReferralKeyAddress,
    ReferralRanking,
    ReferrerFromReferralAmount,
    UserReference,
} from './data-types';

const REFERRAL_DAPP_ADDRESS = getAddress('REFERRAL_DAPP');

abstract class CommonReferralService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = REFERRAL_DAPP_ADDRESS;
    protected abstract helperService: CommonHelperService;

    getReferrerReward = async (address: addressId): Promise<number> => {
        try {
            const referrerReward = await this.fetchDataByKey<EarnedRewardAmount>(`address_${address}_earnedReward`);

            return referrerReward?.value ?? 0;
        } catch (e) {
            return 0;
        }
    };

    getReferralsCount = async (address: string): Promise<number> => {
        const referrersKeys = await this.fetchDataMatch<ReferrerFromReferralAmount>(
            `referer_${address}_referal_.*?_amount`,
        );

        return referrersKeys.length;
    };

    getAddressFromRefKey = async (referrer: string) => {
        try {
            const referrerAddress = await this.fetchDataByKey<ReferralKeyAddress>(`key_${referrer}_refererAddress`);
            return referrerAddress?.value ?? null;
        } catch (e) {
            return null;
        }
    };

    getReferralsbyReferrer = async (address: string): Promise<Array<UserReference>> => {
        try {
            const referrals = await this.fetchReferrals(address);
            return referrals;
        } catch (error) {
            return [];
        }
    };

    getReferralsRanking = async (): Promise<Array<ReferralRanking>> => {
        try {
            const ranking = await this.fetchReferralsRanking();
            return ranking;
        } catch (error) {
            return [];
        }
    };
}

export default CommonReferralService;
