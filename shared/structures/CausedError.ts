/**
 * An error class that supports error chaining.
 * If there is built-in support for .cause, it uses it.
 * Otherwise, it creates this property itself.
 *
 * @see https://github.com/tc39/proposal-error-cause
 */
class CausedError extends Error {
    cause?: Error | string;

    constructor(message: string, options: { cause: any }) {
        super(message);
        if (options !== null && typeof options === 'object' && 'cause' in options && !('cause' in this)) {
            // .cause was specified but the superconstructor
            // did not create an instance property.
            const cause = options.cause;
            this.cause = cause;
            if ('stack' in cause) {
                this.stack = this.stack + '\nCAUSE: ' + cause.stack;
            }
        }
    }
}

export default CausedError;
