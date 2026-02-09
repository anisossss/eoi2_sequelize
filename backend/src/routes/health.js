/**
 * Health Check Routes
 * CSIR EOI No. 8121/10/02/2026
 *
 * GET /api/health — Returns server status and database connectivity.
 * Useful for Docker health checks and monitoring dashboards.
 */

const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

/**
 * GET /api/health
 * Returns server uptime, timestamp, and database connection status
 */
router.get('/', async (req, res) => {
  const healthCheck = {
    success: true,
    message: 'Sequelize Web Stack Demo — API is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: 'unknown',
      dialect: sequelize.getDialect(),
    },
  };

  try {
    // Test database connectivity with a simple query
    await sequelize.authenticate();
    healthCheck.database.status = 'connected';
  } catch (err) {
    healthCheck.database.status = 'disconnected';
    healthCheck.database.error = err.message;
    healthCheck.success = false;
  }

  const statusCode = healthCheck.success ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

module.exports = router;
