import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Global error-handling middleware (must have 4 params).
 * Handles AppError instances, Mongoose validation errors, and unknown errors.
 */
// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, _req, res, _next) {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || 'Internal Server Error';
  let errors     = [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = 'Validation failed';
    errors     = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired'; }

  if (config.nodeEnv !== 'production') {
    logger.error(err.stack);
  } else if (statusCode === 500) {
    logger.error('Unhandled error:', err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(config.nodeEnv !== 'production' && statusCode === 500 && { stack: err.stack }),
  });
}
