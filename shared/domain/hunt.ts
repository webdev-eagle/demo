const SALT = '01GC16TJYQSMA9XG8R0F3K0SCF01GC16VNYMF924BHPAK24ZZMJK01GC16W47T4WJSC7TMMFKSF0Q3';

export const encodeHuntShot = (image: string): string => {
    const left = image.slice(0, 100);
    const right = image.slice(100);

    return `${left}${SALT}${right}`;
};

export const decodeHuntShot = (image: string): { hadSalt: boolean; image: string } => {
    if (image.includes(SALT, 99)) {
        return {
            hadSalt: true,
            image: image.replace(SALT, ''),
        };
    }

    return {
        hadSalt: false,
        image,
    };
};
