/**
 * Custom operational error.
 * Throw this anywhere to produce a structured JSON error response.
 *
 * @example
 *   throw new AppError('Student not found', 404);
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
