export const isBirthdayEvent = (): boolean => {
    const now = new Date();
    const start = new Date('2022-04-08T09:00:00Z');
    const end = new Date('2022-04-11T09:00:00Z');

    return now > start && now < end;
};
