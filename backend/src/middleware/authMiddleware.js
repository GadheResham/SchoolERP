import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * authenticate — verifies JWT from Authorization: Bearer <token>
 * Attaches decoded payload to req.user on success.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized — no token provided', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, config.jwtSecret);
  req.user = decoded;
  next();
});

/**
 * authorize(...roles) — restricts access to specific roles.
 * Must be used AFTER authenticate.
 * @example  router.delete('/:id', authenticate, authorize('admin'), handler)
 */
export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    throw new AppError('Forbidden — insufficient permissions', 403);
  }
  next();
};
