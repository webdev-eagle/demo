export const calculateSuspensionTime = (suspendedTime: number) => {
    const difference = new Date().getTime() - suspendedTime;
    return Math.round(30 - difference / 60000);
};
