export type DuckConnectionType =
    | 'BACK'
    | 'HEAD'
    | 'HELMET'
    | 'MASK'
    | 'ACCESSORY'
    | 'TOP'
    | 'HOUSE'
    | 'LEFT_WING'
    | 'RIGHT_WING'
    | 'PET'
    | 'TAIL';

export type DuckConnections = Partial<Record<DuckConnectionType, `ART-${string}`>>;

export type AnimalsConnectionType = 'PET'; // Except Duck all other animals just accept Pets for now.

export type AnimalsConnections = Partial<Record<AnimalsConnectionType, `ART-${string}`>>;
