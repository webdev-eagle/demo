export const isAddress = (address: unknown): address is addressId => {
    return (
        typeof address === 'string' &&
        (address.indexOf('3P') === 0 || address.indexOf('3M') === 0 || address.indexOf('3N') === 0)
    );
};
