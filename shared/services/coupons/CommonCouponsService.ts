import { ContractIntegerData } from '$shared/types';
import { getAddress } from '../../domain/constants';
import { int, urlString } from '../../utils';
import AbstractDataFetcher from '../AbstractDataFetcher';
import type { Available } from './data-types';

const COUPONS_DAPP_ADDRESS = getAddress('COUPONS_DAPP');

abstract class CommonCouponsService extends AbstractDataFetcher {
    protected DAPP_ADDRESS = COUPONS_DAPP_ADDRESS;
    startTimerTasks = 1695427200000;
    fetchAvailableCoupons = async (userAddress: addressId): Promise<integer> => {
        const available = await this.fetchDataByKey<Available>(`${userAddress}_active`);

        return available?.value ?? int(0);
    };

    calculateDiscountedPrice = (price: integer, availableCoupons: integer): integer => {
        return Math.max(price - availableCoupons, 0) as integer;
    };

    calculateDiscountedPriceTurtles = (price: integer, availableCoupons: integer): integer => {
        const halfPrice = price / 2;
        return (halfPrice + Math.max(halfPrice - availableCoupons, 0)) as integer;
    };

    calculateSpentCoupons = (price: integer, availableCoupons: integer): integer => {
        return Math.min(price, availableCoupons) as integer;
    };

    calculateSpentCouponsTurtles = (price: integer, availableCoupons: integer): integer => {
        const halfPrice = price / 2;
        return (halfPrice + Math.max(halfPrice - availableCoupons, 0)) as integer;
    };

    getActionsCheckDay = async (userAddress: addressId) => {
        const { data } = await this.helperService.fetchData<Array<ContractIntegerData<`.*_actions_check_day`>>>(
            urlString(`addresses/data/${this.DAPP_ADDRESS}`, { matches: `.*_${userAddress}_actions_check_day` }),
        );
        const tasksList: { name: string; value: number }[] = [];

        Object.keys(data).forEach((task) => {
            const taskCompleted = data[task];
            const num = this.filteredTaskNumberUnderscore(taskCompleted.key);
            if (num === 5) {
                const nameAction = taskCompleted.key.split('_')[0] + '_' + taskCompleted.key.split('_')[1];
                const valueAction = taskCompleted.value;
                const action = {
                    name: nameAction,
                    value: valueAction,
                };
                tasksList.push(action);
            }
        });
        return tasksList;
    };

    organizeDailyTasksCompleted = (tasks: { [x: string]: any }) => {
        const tasksList: { name: string; value: number }[] = [];
        Object.keys(tasks).forEach((task) => {
            const taskCompleted = tasks[task];
            const nameAction = taskCompleted.key.split('_')[1];
            const valueAction = taskCompleted.value;
            const action = {
                name: nameAction,
                value: valueAction,
            };
            tasksList.push(action);
        });
        return tasksList;
    };

    filteredTaskNumberUnderscore = (task: string) => {
        const taskSplited: string[] = task.split('_');
        const numberOfUnderscore: number = taskSplited.length - 1;
        return numberOfUnderscore;
    };
    checkSeventhDay = (task: { value: number }, checkLastDayTask: { name: string; value: number }) => {
        if (this.getTimeForTasks() - checkLastDayTask.value === 0 && task.value === 0) {
            return true;
        } else return false;
    };
    organizeWeeklyTasksCompleted = (
        tasks: { [x: string]: any },
        actionsCheckDayList: { name: string; value: number }[],
    ) => {
        const tasksList: { name: string; value: number }[] = [];
        Object.keys(tasks).forEach((task) => {
            const taskCompleted = tasks[task];
            const num = this.filteredTaskNumberUnderscore(taskCompleted.key);
            if (num === 6) {
                const nameAction = taskCompleted.key.split('_')[0] + '_' + taskCompleted.key.split('_')[1];
                const actionLastChecked = actionsCheckDayList.find((item) => item.name === nameAction);
                const valueAction = this.checkSeventhDay(taskCompleted, actionLastChecked!) ? 7 : taskCompleted.value;
                const action = {
                    name: nameAction,
                    value: valueAction,
                };
                tasksList.push(action);
            }
        });

        return tasksList;
    };
    getTimeForTasks = () => {
        const timestampMs: number = new Date().getTime();
        const startTimer = 1695427200000;
        let diff = timestampMs - startTimer;
        let daysPassed = Math.floor(diff / (86400 * 1000));
        return daysPassed;
    };
    getDailyTasks = async (userAddress: addressId) => {
        const daysPassed = this.helperService.getDaysPassed(this.startTimerTasks);
        const data = await this.helperService.fetchData<Array<ContractIntegerData<`.*_*_actions`>>>(
            urlString(`addresses/data/${this.DAPP_ADDRESS}`, { matches: `.*_${userAddress}_${daysPassed}_actions` }),
        );
        const organizedTasks = this.organizeDailyTasksCompleted(data.data);
        return organizedTasks;
    };

    getWeeklyTasks = async (userAddress: addressId) => {
        const { data } = await this.helperService.fetchData<Array<ContractIntegerData<`.*_*_actions_amount_in_row`>>>(
            urlString(`addresses/data/${this.DAPP_ADDRESS}`, { matches: `.*_${userAddress}_actions_amount_in_row` }),
        );
        const actionsCheckDayList = await this.getActionsCheckDay(userAddress);
        const organizedTasks = this.organizeWeeklyTasksCompleted(data, actionsCheckDayList);
        return organizedTasks;
    };

    getRewardTasks = async () => {
        const { data } = await this.helperService.fetchData<Array<ContractIntegerData<`TASK_.*_.*`>>>(
            urlString(`addresses/data/${this.DAPP_ADDRESS}`, { matches: `TASK_.*_.*` }),
        );
        if (data === undefined) {
            return [];
        }
        return data;
    };
}

export default CommonCouponsService;
