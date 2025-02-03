export interface DuckImageProperties {
    bodyParts: string;
    duckStyle?: string;
    firstLayer?: string;
}

export interface PerchProperties {
    styles: string;
    front: string;
    back: string;
}

export interface BeachProperties {
    styles: string;
    image: string;
}

export interface MutariumProperties {
    styles: string;
    image: string;
}

export type StakingItemProperties = ImageProp | FrontBackProp;
export interface ImageProp {
    styles: string;
    image: string;
    back?: never;
    front?: never;
}
export interface FrontBackProp {
    styles: string;
    image?: never;
    back: string;
    front: string;
}
