export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // to know that its our custom error
        Error.captureStackTrace(this, this.constructor);
    }
}