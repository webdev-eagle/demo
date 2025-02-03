import { isDevOnlyEnv } from '../utils';

abstract class CommonUrlRecord {
    abstract get DOMAIN_HOST(): string;
    abstract get API_URL(): string;
    abstract get IMAGES_SERVICE_URI(): string;
    abstract get APP_URL(): string;
    abstract get SCAN_URL(): string;
    abstract get BLOCKCHAIN_URL(): string;
    abstract get CACHE_READER_URL(): string;

    STATICS_URL = 'https://static.wavesducks.com';

    get DUXPLORER_URL() {
        return process.env.DUXPLORER_URL || 'https://node2.duxplorer.com';
    }

    get RESERVE_DUXPLORER_URL() {
        return process.env.RESERVE_DUXPLORER_URL || 'https://duxplorer.com';
    }

    get BACKEND_SWOPFI_URL() {
        return process.env.BACKEND_SWOPFI_URL || 'https://backend.swop.fi';
    }

    get ROUTING_SWOPFI_URL() {
        return process.env.ROUTING_SWOPFI_URL || 'https://routing.swop.fi';
    }

    get DATA_SERVICE_URL() {
        return process.env.DATA_SERVICE_URL || 'https://api.wavesplatform.com/v0';
    }

    get SWOP_EXCHANGE_URL() {
        return process.env.SWOP_EXCHANGE_URL || 'https://swop.fi/exchange';
    }

    get DEPOSIT_WAVES_URL() {
        return process.env.DEPOSIT_WAVES_URL || 'https://waves.exchange/deposit/WAVES';
    }

    get NODE_URL() {
        if (!process.env.NODE_URL) {
            if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
                return 'https://cluster.node.turtlenetwork.eu';
            }
            return 'https://testnet.node.blackturtle.eu';
        }
        return process.env.NODE_URL;
    }

    get IMAGES_SERVICE_URL() {
        return (
            process.env.IMAGES_SERVICE_URL ||
            (isDevOnlyEnv() ? `http://${this.DOMAIN_HOST}:8010` : `https://images.${this.DOMAIN_HOST}`)
        );
    }
}

export default CommonUrlRecord;
