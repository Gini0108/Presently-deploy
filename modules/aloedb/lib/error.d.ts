/**
 * Custom database error.
 */
export declare class DatabaseError extends Error {
    /** Error name. */
    name: string;
    /** Error message. */
    message: string;
    /** Exectuion stack. */
    stack: string | undefined;
    /** Cause of the error. */
    cause?: string | Error;
    /**
       * Error initialization.
       * @param message Error message.
       * @param cause Cause of the error.
       */
    constructor(message: string, cause?: string | Error);
}
