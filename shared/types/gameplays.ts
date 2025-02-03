import { Poison } from '../../backend/game/FightGameplaySchema';
import type { GameplayActionTarget, GameplayActionType } from '../enums';
import type { DuckAchievements } from './scan';

export interface GameplayAction {
    count?: number;
    factor?: number;
}

export interface GameplayMove {
    key: string;
    actions: Map<string, GameplayAction>;
    isFrozen?: boolean;
}

export interface GameplayPlayerAction {
    type: GameplayActionType;
    targets?: GameplayActionTarget[];
    focus?: number;
}

export interface GameplayPlayerMove {
    moveKey: string;
    time: number;
    actions: GameplayPlayerAction[];
}

export interface GameplayAvailableMoves {
    moves: GameplayMove[];
}

export type GameplayRoundResult = {
    [key in GameplayActionType]?: 'NULL' | string;
};

export interface GameplayRound {
    finishIn: number;
    finishedAt: number | null;
    playersMoves: Map<string, GameplayPlayerMove>;
    availableMoves: Map<string, GameplayAvailableMoves>;
    results: Map<string, GameplayRoundResult>;
}

export interface GameplayPlayerDuck {
    name: string;
    assetId: string;
    rarity: number;
    achievements: DuckAchievements;
    items: string[];
    issueHeight: number;
    lvl: number;
}

export interface GameplayPlayer {
    id: string; // Address
    hp: number;
    max_hp: number;
    duck: GameplayPlayerDuck;
    signed: boolean;
    turnsFrozen: number;
    cardTurnsFrozen: number;
    bonusShield: number;
    farm: string; // Farm contract
    healPerRound: number;
    reduceEffect: { value: number; limitRounds: number };
    bonusDamage: number;
    bonusHeal: number;
    damagePrevention: number;
    ultimateFocus: { value: number; limitRounds: number };
    poison: Poison;
    enchantedProtection: boolean;
}

export interface Gameplay {
    id: string;
    winner: string | null;
    currentRound: number;
    players: Map<string, GameplayPlayer>;
    rounds: GameplayRound[];
    finishedAt: number | null;
    startedAt: number | null;
    createdAt: number | null;
    winnerEarned?: number | null;
}

export interface GameplayTurnState {
    time?: number;
    selectedMove: GameplayMove | null;
    targets: { [key in GameplayActionType]?: GameplayActionTarget[] };
}

export type GameplayTransactionType = {
    data: any[];
    timestamp: number;
    publicKeys: string[];
    signatures: string[];
};
