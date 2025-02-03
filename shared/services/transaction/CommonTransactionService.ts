import { IInvokeScriptTransaction, ITransaction } from '../../types';
import CommonHelperService from '../helper';

abstract class CommonTransactionService {
    abstract NODE_URL: string;

    abstract API_URL: string;

    abstract helperService: CommonHelperService;

    /**
     * @deprecated
     * Returns information about a transaction
     * @param {string} txId - transaction id
     * @return ITransaction
     */
    getTransactionInfo = (txId: string): Promise<ITransaction> => {
        return this.helperService.http
            .get(`${this.NODE_URL}/transactions/info/${txId}`)
            .then((result) => result.data)
            .catch((error) => {
                console.log('An error occurred in method getTransactionInfo:', error.message);
                return 0;
            });
    };

    getInvokeScriptTransactionInfo = async (txId: string): Promise<IInvokeScriptTransaction | null> => {
        const tx = await this.getTransactionInfo(txId);

        if (tx.type !== 16) {
            return null;
        }

        return tx;
    };
}

export default CommonTransactionService;
