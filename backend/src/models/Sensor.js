/**
 * Sensor Model — Sequelize Definition
 * CSIR EOI No. 8121/10/02/2026
 *
 * Represents an IoT sensor device with:
 * - Unique name, type classification, physical location
 * - Active/inactive status tracking
 * - One-to-many relationship with Reading model
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sensor = sequelize.define('Sensor', {
    // Primary key — auto-incrementing integer
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Sensor name — must be unique and non-empty
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Sensor name cannot be empty' },
        len: {
          args: [2, 100],
          msg: 'Sensor name must be between 2 and 100 characters',
        },
      },
    },

    // Sensor type — categorises the sensor
    type: {
      type: DataTypes.ENUM('temperature', 'humidity', 'pressure', 'light', 'motion', 'gas'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['temperature', 'humidity', 'pressure', 'light', 'motion', 'gas']],
          msg: 'Invalid sensor type',
        },
      },
    },

    // Physical location description
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Location cannot be empty' },
      },
    },

    // Operational status
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
      defaultValue: 'active',
      allowNull: false,
    },

    // Optional description / notes
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'sensors',
    timestamps: true,  // createdAt + updatedAt managed by Sequelize
  });

  return Sensor;
};
