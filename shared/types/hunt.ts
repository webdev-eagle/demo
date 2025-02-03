import type { PointLocation } from './geolocation';
import { RentalDuckStatus } from './marketplaces';

export type HuntDuck = {
    assetId: assetId;
    currentDistance: number;
    currentLocation: PointLocation;
    name: `DUCK-${string}-${string}`;
    own: boolean;
    owner: addressId;
};

export type HuntEgg = {
    id: string;
    location: [long: number, lat: number];
    realLocation?: [long: number, lat: number]; // location before rope
    nearestLocations: Array<[long: number, lat: number]>;
    validTill: string;
    catchable: boolean;
    own: boolean;
    ropeStatus: RopeStatusEnum;
    ropePrice: number;
    isFromRentalDuck: boolean;
    isFreeze: boolean;
    farm?: {
        title: string;
        address: string;
        imageUrl: string;
    };
};

export type HuntObjects = {
    ducks: HuntDuck[];
    eggs: HuntEgg[];
    isBlocked?: boolean;
};

export type HuntReward =
    | {
          id: string;
          type: RewardTypesEnum.SPICE;
          amount: integer;
      }
    | {
          id: string;
          type: RewardTypesEnum.DUCK | RewardTypesEnum.ITEM;
          amount: integer;
          meta: {
              name: string;
          };
      };

export type HuntUserStats = {
    maxEggsPerDay: integer;
    openedEggsLast24h: integer;
    totalEarned: integer;
    totalCapacity: integer;
    totalOpened: integer;
};

export type RangeInfo = {
    baseRange: integer;
    range: integer;
};

export type WithHuntParams = {
    hunt: {
        dailyLimit: integer;
        totalCapacity: integer;
        rechargeBonusCapacity?: number;
        initialTotalCapacity: integer;
        laidEggs: integer;
        laidEggLast24h: integer;
        maxRadius: number;
        canBeUnstakenAt: integer;
    };
    huntPower: integer;
};

export type WithRentalParams = {
    rental: {
        lockDuration?: number;
        lockedAt?: Date;
        owner?: string;
        rewardRatio?: number;
        rentedAt?: Date;
        rentedBy?: string;
        deposit?: number;
        status?: RentalDuckStatus;
    };
};

export enum RewardTypesEnum {
    EGG = '$EGG',
    SPICE = '$SPICE',
    DUCK = 'DUCK',
    ITEM = 'ITEM',
}

export type TReward = {
    type: RewardTypesEnum;
    amount: number;
    meta?: Object;
    receiverAddress?: string;
    receiverDeviceId?: string;
    paid: boolean;
    paymentDate?: Date;
    paymentTransactionId?: string;
};

export type TRewardPreview = Pick<TReward, 'amount' | 'type'> & {
    meta: { name: string };
    multiplier: number;
    id: string;
};

export enum LocationTypesEnum {
    Point = 'Point',
}

export type TLocation = {
    type: LocationTypesEnum;
    coordinates: [lng: number, lat: number];
};

export type AdminEgg = {
    eggId: string;
    eggUrl: string;
    location: TLocation;
    userLocation?: TLocation;
    openedAt: Date;
    createdByDuckId: string;
    validTill: Date;
    own?: boolean;
    reward?: TReward;
    createdAt: Date;
    openedByUserAddress: string;
    ropeUsed?: boolean;
};

export enum RopeStatusEnum {
    Available = 'Available',
    ComeCloserToRope = 'ComeCloserToRope',
    NotAvailable = 'NotAvailable',
    Roped = 'Roped',
}

export enum CheatReasonsEnum {
    BigSpeed = 'bigSpeed',
    NoPhotos = 'noPhotos',
    TooMuchTime = 'tooMuchTime',
    ZeroCoordinates = 'zeroCoordinates',
    FakeLocation = 'fakeLocation',
}

export interface ICheat {
    _id?: string;
    userAddress?: string;
    deviceId?: string;
    reason: CheatReasonsEnum;
    meta: any;
    submitted?: boolean;
}

export interface ICheatAdmin {
    _id?: string;
    userAddress?: string;
    reasons: string[];
    cheatIds: string[];
    submittedCheatsCount: number;
}
