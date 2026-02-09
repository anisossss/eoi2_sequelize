/**
 * Test Setup — Jest Configuration
 * CSIR EOI No. 8121/10/02/2026
 *
 * Configures the test environment:
 * - Sets NODE_ENV to 'test' (uses SQLite in-memory)
 * - Syncs the database before all tests
 * - Closes the connection after all tests
 */

// Force test environment
process.env.NODE_ENV = 'test';

const { sequelize } = require('../src/models');

// Before all test suites: sync database schema
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// After all test suites: close database connection
afterAll(async () => {
  await sequelize.close();
});
