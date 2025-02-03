class Cache<D = any> {
    private readonly ttl: number;
    private timerId: any;
    private _updated: null | number = null;
    private _data: null | D = null;

    /**
     *
     * @param {object} [options]
     * @property {number} [options.ttl] time to live
     */
    constructor(options: { ttl?: number } = {}) {
        this.ttl = options.ttl || 0;
    }

    get updated() {
        return this._updated;
    }

    get data(): D | null {
        return this._data;
    }

    set data(data: D | null) {
        this._data = data;
        this._updated = Date.now();
        this.rewind();
    }

    private rewind() {
        if (this.ttl) {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => this.flush(), this.ttl);
        }
    }

    flush() {
        this._data = null;
        this._updated = Date.now();
        clearTimeout(this.timerId);
    }

    destroy() {
        this._data = null;
        clearTimeout(this.timerId);
    }
}

export default Cache;
