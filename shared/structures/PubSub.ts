import BiMap from './BiMap';

abstract class PubSub<E> {
    private lastId = 0;
    private readonly handlers: BiMap<string, (message: E) => void> = new BiMap();

    protected handleMessage = (message: E) => {
        this.handlers.forEach((handler) => {
            handler(message);
        });
    };

    subscribe(handler: (message: E) => void): () => void {
        const id = this.lastId++;
        this.handlers.set(id.toString(), handler);

        return () => {
            this.handlers.deleteByKey(id.toString());
        };
    }

    unsubscribe(handler: (message: E) => void) {
        this.handlers.deleteByValue(handler);
    }

    unsubscribeAll() {
        this.lastId = 0;
        this.handlers.clear();
    }
}

export default PubSub;
