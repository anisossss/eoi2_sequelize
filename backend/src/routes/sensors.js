/**
 * Sensor CRUD Routes
 * CSIR EOI No. 8121/10/02/2026
 *
 * Demonstrates Sequelize CRUD operations:
 * - GET  /api/sensors       — List all sensors (with readings count)
 * - POST /api/sensors       — Create a new sensor
 * - GET  /api/sensors/:id   — Get sensor by ID (with recent readings)
 */

const express = require('express');
const router = express.Router();
const { Sensor, Reading, sequelize } = require('../models');

/**
 * GET /api/sensors
 * List all sensors with their reading counts.
 * Uses Sequelize attributes and subquery to include count.
 */
router.get('/', async (req, res, next) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: {
        include: [
          // Subquery: count of readings per sensor
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM readings WHERE readings."sensorId" = "Sensor"."id")'
            ),
            'readingsCount',
          ],
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: sensors.length,
      data: sensors,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sensors
 * Create a new sensor. Body: { name, type, location, description? }
 * Sequelize model validation runs automatically.
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, type, location, description } = req.body;

    const sensor = await Sensor.create({
      name,
      type,
      location,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Sensor created successfully',
      data: sensor,
    });
  } catch (err) {
    next(err); // Validation errors handled by errorHandler middleware
  }
});

/**
 * GET /api/sensors/:id
 * Get a single sensor by ID, including its 10 most recent readings.
 * Demonstrates Sequelize eager loading with include and limit.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id, {
      include: [
        {
          model: Reading,
          as: 'readings',
          limit: 10,
          order: [['timestamp', 'DESC']],
          separate: true, // Required for limit inside include
        },
      ],
    });

    if (!sensor) {
      const error = new Error('Sensor not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: sensor,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
