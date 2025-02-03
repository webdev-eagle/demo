export type RecordByEnv<V> = {
    DEVELOPMENT: V;
    PRODUCTION: V;
    TEST: V;
};

export interface IEventEmitter<Events extends Record<string, any> = Record<string, any>> {
    events?: Events;
    on<K extends keyof Events>(eventName: K, listener: (data: Events[K]) => void): () => void;
    once<K extends keyof Events>(eventName: K, listener: (data: Events[K]) => void): () => void;
    off<K extends keyof Events>(eventName: K, listener?: (data: Events[K]) => void): this;
    emit<K extends keyof Events>(eventName: K, ...[data]: Events[K] extends never ? [never?] : [Events[K]]): this;
}
