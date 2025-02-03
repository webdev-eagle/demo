import type CommonAssetsService from '../assets';
import type CommonGenesisDucklingService from '../genesis-duckling';
import type CommonHelperService from '../helper';

abstract class CommonBabyDuckService {
    abstract assetsService: CommonAssetsService;
    abstract helperService: CommonHelperService;
    abstract genesisDucklingService: CommonGenesisDucklingService;

    getUserNonceForFeed = async (address: string) => {
        return this.genesisDucklingService.getUserNonceForFeed(address);
    };
}

export default CommonBabyDuckService;
