import * as uuid from 'uuid'

/**
 * Interface to represent a user-friendly error.
 *
 * Should be used for exceptions that can be supplemented by
 * an additional debug message, separate from a user-friendly message.
 */
export default interface UserError {
    /** unique identifier */
    uid: string

    /** User friendly message */
    message: string

    /** Debug message */
    debug?: string
}

/**
 * Error class representing API Response errors
 */
export class GenericUserError extends Error implements UserError {
    public readonly name = 'GenericUserError'
    public readonly uid = uuid.v4()

    debug?: string

    /**
     * Creates a new API Response Error instance
     *
     * @param message User-friendly message
     * @param debug Debug message
     */
    constructor(message: string, debug?: string) {
        super(message)
        this.debug = debug
    }
}
