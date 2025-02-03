import type { QR_HUNT_WIN_TYPE } from '../enums';

export interface QRHuntParticipant {
    redeemedAmount: number;
    prize?: QR_HUNT_WIN_TYPE;
    isVerified?: boolean;
}
