import { IGameType } from '$shared/types/games';
import type { IDucksStatsItem, IDuckType, IDuckWarsStats, IFarmType, IPlayerState, WarsState } from '../../types';
import { isDevEnv } from '../../utils';
import type CommonHelperService from '../helper/CommonHelperService';

abstract class CommonGameApiService {
    abstract helperService: CommonHelperService;
    abstract API_URL: string;

    get API_PREFIX() {
        return (
            process.env.GAME_SERVER_URL ||
            (isDevEnv() ? `${this.API_URL}/game` : 'https://game-server.wavesducks.com/api')
        );
    }

    fetchAvailableGame = (): Promise<WarsState> =>
        this.helperService.http.get(`${this.API_PREFIX}`).then(({ data }) => data);

    fetchLeaderboardData = (gid: string): Promise<any[]> =>
        this.helperService.http.get(`${this.API_PREFIX}/leaderboard/${gid}`).then(({ data }) => data);

    fetchFarms = (): Promise<IFarmType[]> =>
        this.helperService.http.get(`${this.API_PREFIX}/farms`).then(({ data }) => data);

    chooseFarm = (gameId: string, farmContract: string): Promise<void> =>
        this.helperService.http.patch(`${this.API_PREFIX}/farms/${gameId}/${farmContract}`);

    fetchAvailableDucks = (): Promise<IDuckType[]> =>
        this.helperService.http.get(`${this.API_PREFIX}/ducks/fighter`).then(({ data }) => data);

    tryChooseDuck = (duckId: string): Promise<void[]> =>
        this.helperService.http.put(`${this.API_PREFIX}/ducks/fighter/${duckId}`).then(({ data }) => data);

    fetchDucksCurrentLapStats = (): Promise<IDucksStatsItem[]> =>
        this.helperService.http.get(`${this.API_PREFIX}/ducks/stats`).then(({ data }) => data);

    fetchDucksOverallStats = (): Promise<IDucksStatsItem[]> =>
        this.helperService.http.get(`${this.API_PREFIX}/ducks/stats/overall`).then(({ data }) => data);

    fetchPlayerState = (): Promise<IPlayerState> =>
        this.helperService.http.get(`${this.API_PREFIX}/player/state`).then(({ data }) => data);

    toggleAutoSelectFarm = (farmContract: string | null): Promise<void> =>
        this.helperService.http
            .patch(`${this.API_PREFIX}/player/autoSelectFarm`, { farmContract })
            .then(({ data }) => data);

    fetchDuckAtWarsStats = (duckId: string): Promise<IDuckWarsStats> =>
        this.helperService.http.get(`${this.API_PREFIX}/ducks/stats/${duckId}`).then(({ data }) => data);

    fetchDuckAtWarsDetails = (duckId: string): Promise<IDuckWarsStats> =>
        this.helperService.http.get(`${this.API_PREFIX}/ducks/details/${duckId}`).then(({ data }) => data);

    fetchAllStats = (): Promise<IGameType[]> =>
        this.helperService.http.get(`${this.API_URL}/v1/laps`).then(({ data }) => data);
}

export default CommonGameApiService;
