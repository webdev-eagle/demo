import { Announcement } from './announcements';

export interface UserAnnouncement {
    id: string;
    userAddress: string;
    announcement: Announcement;
    isAnnouncementNew: boolean;
    isViewed: boolean;
}
