import type { IEventEmitter } from '../types';

class EventEmitter<Events extends Record<string, any>> implements IEventEmitter<Events> {
    protected listeners: { [K in keyof Events]?: Array<(data: Events[K]) => void> } = {};

    on<K extends keyof Events>(eventName: K, listener: (data: Events[K]) => void): () => void {
        this.listeners[eventName] = [...(this.listeners[eventName] ?? []), listener];

        return () => this.off(eventName, listener);
    }

    once<K extends keyof Events>(eventName: K, listener: (data: Events[K]) => void): () => void {
        const wrapper = (data: Events[K]) => {
            listener(data);
            this.off(eventName, wrapper);
        };
        this.listeners[eventName] = [...(this.listeners[eventName] ?? []), wrapper];

        return () => this.off(eventName, wrapper);
    }

    off<K extends keyof Events>(eventName: K, listener?: (data: Events[K]) => void): this {
        if (!listener) {
            this.listeners[eventName] = [];
            return this;
        }

        this.listeners[eventName] = this.listeners[eventName]?.filter((item) => item !== listener);

        return this;
    }

    emit<K extends keyof Events>(eventName: K, ...[data]: Events[K] extends never ? [never?] : [Events[K]]): this {
        for (const listener of this.listeners[eventName] ?? []) {
            listener(data!);
        }

        return this;
    }
}

export default EventEmitter;
