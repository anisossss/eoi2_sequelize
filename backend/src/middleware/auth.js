/**
 * JWT Authentication Middleware
 * CSIR EOI No. 8121/10/02/2026
 *
 * Verifies JSON Web Tokens from the Authorization header.
 * Attaches the decoded user payload to req.user on success.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'csir-eoi-demo-jwt-secret-2026';

/**
 * Middleware: authenticate — verifies Bearer token
 */
const authenticate = (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Authentication required — no token provided');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }

    next();
  } catch (err) {
    next(err); // Handled by errorHandler (JsonWebTokenError / TokenExpiredError)
  }
};

/**
 * Middleware: authorise — checks user role
 * Usage: authorise('admin')
 */
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      return next(error);
    }
    if (!roles.includes(req.user.role)) {
      const error = new Error('Insufficient permissions');
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

module.exports = { authenticate, authorise, JWT_SECRET };
