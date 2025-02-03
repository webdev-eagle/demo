import { Lap, OracleName, Player } from '$shared/types/warsStats';
import CommonHelperService from '../helper/CommonHelperService';

abstract class CommonGameStatsService {
    abstract helperService: CommonHelperService;
    abstract API_URL: string;
    abstract NODE_URL: string;

    async getOracleNames(): Promise<OracleName[]> {
        const ROBS_NAMES_ORACLE = '3PCYuFbjds2dqwWKDqpHXu8H65nNC4ebGTa';
        const regex = 'farm_.%2A_name';
        const url = this.NODE_URL + '/addresses/data/' + ROBS_NAMES_ORACLE + '?matches=' + regex;

        const farms = [];
        try {
            const { data: res } = await this.helperService.http.get(url);
            return res;
        } catch {
            console.error('Error');
        }
        return farms;
    }

    async sortLapsDetails(laps: { [key: string]: any }) {
        const farmNames = await this.getOracleNames();
        const orderedList: { [key: string]: any } = {};
        if ('farmsStats' in laps) {
            const sortedItems = Object.entries(laps['farmsStats']).sort((a, b) => {
                const arrA = Array(a);
                const arrB = Array(b);
                return (arrB[1]['wins'] || 0) - (arrA[1]['wins'] || 0);
            });
            sortedItems.forEach(([key, value]) => {
                const objValue = value as object;
                objValue['name'] = this.setFarmsStatsItemName(farmNames, key);
            });
            orderedList['farmsStats'] = Object.fromEntries(sortedItems);
        }
        return { laps, orderedList };
    }

    async getLapsDetails(lapid: string) {
        const url = `${this.API_URL}/v1/laps/${lapid}`;
        const { data: lap } = await this.helperService.http.get<Lap>(url);
        const oracleNames = await this.getOracleNames();
        return this.complementDetails(lap, oracleNames);
    }

    async getPlayers(lapid: string, loadedOracleNames: OracleName[] | null = null) {
        const url = `${this.API_URL}/v1/laps/${lapid}/players/`;
        const { data: players = [] } = await this.helperService.http.get<Player[]>(url);
        players.sort((a, b) => a.wins - b.wins);
        const oracleNames = loadedOracleNames || (await this.getOracleNames());
        return this.complementPlayerDetails(players, oracleNames);
    }

    checkIfPlayerInLap(players: Player[], playerAddress: string) {
        return players.some((player) => player.address === playerAddress);
    }

    async getLaps() {
        const url = `${this.API_URL}/v1/laps/`;
        const { data: laps = [] } = await this.helperService.http.get<Lap[]>(url);
        const lapsWithGet = laps.map((lap) => {
            lap.getId = () => lap._id;
            return lap;
        });
        lapsWithGet.sort((a, b) => new Date(b.startDate).getDate() - new Date(a.startDate).getDate());
        return lapsWithGet;
    }

    async getLastXLapsFromLap(lapid: string, int: number) {
        const laps = await this.getLaps();
        let index = 1;
        const winsLaps = laps.filter((lap) => lap.wins !== 0);
        for (const lap of winsLaps) {
            if (lap._id !== lapid) index += 1;
            else break;
        }
        return winsLaps[index + int];
    }

    private setFarmsStatsItemName(farmNames: any[], item: string) {
        const foundFarm = farmNames.find((x) => x['key'] === `farm_${item}_name`);
        return foundFarm ? foundFarm['value'] : null;
    }

    private complementDetails(lap: Lap, oracleNames: OracleName[]): Lap {
        const farmStats = lap.farmsStats || {};
        const farmStatsNames = oracleNames.filter((on) => {
            const key = on.key.split('_')[1];
            const farmStatsKeys = Object.keys(farmStats);
            return farmStatsKeys.some((farmStatsKey) => farmStatsKey === key);
        });
        if (lap.farmsStats) {
            Object.keys(farmStats).forEach((key) => {
                const name = farmStatsNames.find((fsn) => {
                    const fsnKey = fsn.key.split('_')[1];
                    return fsnKey === key;
                });
                farmStats[key].name = name?.value;
            });
            lap.farmsStats = farmStats;
        }
        return lap;
    }

    private complementPlayerDetails(players: Player[], oracleNames: OracleName[]): Player[] {
        const playerFarmContract = players.map((player) => player.farmContract);
        const farmStatsNames = oracleNames.filter((on) => {
            const key = on.key.split('_')[1];
            return playerFarmContract.some((farmContract) => farmContract === key);
        });
        players.forEach((player) => {
            const farmContract = farmStatsNames.find((obj) => {
                const key = obj.key.split('_')[1];
                return player.farmContract === key;
            });
            player.farm = farmContract?.value;
        });
        return players;
    }
}

export default CommonGameStatsService;
