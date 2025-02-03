export interface AnnouncementLink {
    key: string;
    external: boolean;
}

export interface Announcement {
    key: string;
    imageUri: string;
    releaseDateTime: Date;
    expireDateTime: Date;
    isActive: boolean;
    links: AnnouncementLink[];
}
