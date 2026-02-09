/**
 * Sequelize Database Configuration
 * CSIR EOI No. 8121/10/02/2026
 *
 * Supports multiple environments:
 * - development: local PostgreSQL
 * - test: SQLite in-memory (fast isolated tests)
 * - production: PostgreSQL via environment variables
 */

const { Sequelize } = require('sequelize');

// Environment-based configuration
const config = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'sequelize_demo',
    username: process.env.DB_USER || 'demo_user',
    password: process.env.DB_PASSWORD || 'demo_password',
    logging: console.log,
    define: {
      timestamps: true,       // Adds createdAt and updatedAt
      underscored: false,     // Use camelCase column names
    },
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',      // In-memory for fast tests
    logging: false,           // Silence SQL during tests
    define: {
      timestamps: true,
      underscored: false,
    },
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
};

// Determine current environment
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  currentConfig.database || '',
  currentConfig.username || '',
  currentConfig.password || '',
  {
    host: currentConfig.host,
    port: currentConfig.port,
    dialect: currentConfig.dialect,
    storage: currentConfig.storage,
    logging: currentConfig.logging,
    define: currentConfig.define,
    pool: currentConfig.pool,
  }
);

module.exports = { sequelize, config };
