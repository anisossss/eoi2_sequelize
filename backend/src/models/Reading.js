/**
 * Reading Model — Sequelize Definition
 * CSIR EOI No. 8121/10/02/2026
 *
 * Represents a single data reading from a sensor:
 * - Numeric value with unit of measurement
 * - Timestamp of when the reading was taken
 * - Foreign key linking back to the parent Sensor
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reading = sequelize.define('Reading', {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Numeric sensor value (e.g. 23.5 for temperature)
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: 'Value must be a number' },
      },
    },

    // Unit of measurement (e.g. '°C', '%', 'hPa', 'lux')
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Unit cannot be empty' },
      },
    },

    // When the reading was captured (defaults to now)
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    // Foreign key — references Sensor.id
    // (Defined here explicitly; also set via association)
    sensorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id',
      },
    },
  }, {
    tableName: 'readings',
    timestamps: true,
    indexes: [
      { fields: ['sensorId'] },           // Fast lookup by sensor
      { fields: ['timestamp'] },           // Fast time-range queries
      { fields: ['sensorId', 'timestamp'] }, // Composite index
    ],
  });

  return Reading;
};
