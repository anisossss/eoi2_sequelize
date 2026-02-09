/**
 * Model Loader & Association Setup
 * CSIR EOI No. 8121/10/02/2026
 *
 * Centralised module that:
 * 1. Imports the Sequelize instance from config
 * 2. Loads all model definitions
 * 3. Establishes associations between models
 * 4. Exports everything for use across the application
 */

const { sequelize } = require('../config/database');

// ── Load Models ─────────────────────────────────────────────────────
const Sensor  = require('./Sensor')(sequelize);
const Reading = require('./Reading')(sequelize);
const User    = require('./User')(sequelize);

// ── Define Associations ─────────────────────────────────────────────

// A Sensor has many Readings (one-to-many)
Sensor.hasMany(Reading, {
  foreignKey: 'sensorId',
  as: 'readings',
  onDelete: 'CASCADE',    // Delete readings when sensor is removed
  onUpdate: 'CASCADE',
});

// Each Reading belongs to exactly one Sensor
Reading.belongsTo(Sensor, {
  foreignKey: 'sensorId',
  as: 'sensor',
});

// ── Export ───────────────────────────────────────────────────────────
module.exports = {
  sequelize,
  Sensor,
  Reading,
  User,
};
