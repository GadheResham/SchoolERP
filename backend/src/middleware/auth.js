import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Middleware: verifies JWT from the Authorization header.
 * Attaches decoded payload to req.user on success.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized — no token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Unauthorized — invalid or expired token' });
  }
}

/**
 * Middleware factory: restricts access to specific roles.
 * Usage: authorize('admin', 'teacher')
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden — insufficient permissions' });
    }
    next();
  };
}
