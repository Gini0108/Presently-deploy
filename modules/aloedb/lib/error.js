"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
const utils_1 = require("./utils");
/**
 * Custom database error.
 */
class DatabaseError extends Error {
    /**
       * Error initialization.
       * @param message Error message.
       * @param cause Cause of the error.
       */
    constructor(message, cause) {
        super(message);
        /** Error name. */
        this.name = 'DatabaseError';
        Error.captureStackTrace(this, DatabaseError);
        this.message = message;
        if (cause)
            this.cause = cause;
        if (utils_1.isString(cause))
            this.message = `${message}: ${cause}`;
        if (utils_1.isError(cause) && utils_1.isString(cause?.message)) {
            this.message = `${message}: ${cause.message}`;
        }
    }
}
exports.DatabaseError = DatabaseError;
