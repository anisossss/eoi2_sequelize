/**
 * Error Handling Middleware
 * CSIR EOI No. 8121/10/02/2026
 *
 * Centralised error handler that:
 * - Catches Sequelize validation errors
 * - Catches Sequelize unique constraint errors
 * - Handles JWT authentication errors
 * - Returns consistent JSON error responses
 */

const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * Not-found handler — catches requests that don't match any route
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler — Express error middleware (4 params)
 */
const errorHandler = (err, req, res, _next) => {
  // Default status code
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // ── Sequelize Validation Error ──────────────────────────────────
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
  }

  // ── Sequelize Unique Constraint Error ───────────────────────────
  if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = 'Duplicate Entry';
    errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ── JWT Errors ──────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // ── Log in development ──────────────────────────────────────────
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${statusCode} — ${message}`, err.stack || '');
  }

  // ── Send JSON response ──────────────────────────────────────────
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
