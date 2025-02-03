import type { Pagination } from '../api';

export type RentalDuck = {
    assetId: string;
    color: string;
    dailyLimit: number;
    eggProduction: number;
    excluded: boolean;
    generation: string;
    genotype: string;
    issueHeight: number;
    issuer: string;
    lockDuration: number;
    lockedAt: string;
    name: string;
    originTransactionId: string;
    owner: string;
    rewardRatio: number;
    totalCapacity: number;
    type: 'DUCK';
    huntPower?: number;
};

export interface RentalDucksFilters extends Pagination {
    productivityFrom?: number;
    productivityTo?: number;
    rewardFrom?: number;
    rewardTo?: number;
    capacityFrom?: number;
    capacityTo?: number;
    dailyEggFrom?: number;
    dailyEggTo?: number;
    lockTimeInDays?: number;
}
