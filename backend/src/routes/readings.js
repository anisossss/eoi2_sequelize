/**
 * Reading Routes
 * CSIR EOI No. 8121/10/02/2026
 *
 * Endpoints for sensor reading data:
 * - POST /api/readings                — Record a new reading
 * - GET  /api/readings?sensorId=X&limit=50 — Query readings
 */

const express = require('express');
const router = express.Router();
const { Reading, Sensor } = require('../models');

/**
 * POST /api/readings
 * Record a new sensor reading.
 * Body: { sensorId, value, unit, timestamp? }
 */
router.post('/', async (req, res, next) => {
  try {
    const { sensorId, value, unit, timestamp } = req.body;

    // Verify the sensor exists before creating a reading
    const sensor = await Sensor.findByPk(sensorId);
    if (!sensor) {
      const error = new Error(`Sensor with ID ${sensorId} not found`);
      error.statusCode = 404;
      return next(error);
    }

    const reading = await Reading.create({
      sensorId,
      value,
      unit,
      timestamp: timestamp || new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Reading recorded successfully',
      data: reading,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/readings
 * Query readings with optional filters:
 *   - sensorId: filter by sensor (required or optional based on use case)
 *   - limit: max number of results (default 50, max 500)
 *   - offset: pagination offset
 */
router.get('/', async (req, res, next) => {
  try {
    const { sensorId, limit = 50, offset = 0 } = req.query;

    // Build dynamic where clause
    const where = {};
    if (sensorId) {
      where.sensorId = parseInt(sensorId, 10);
    }

    // Clamp limit to 500
    const safeLimit = Math.min(parseInt(limit, 10) || 50, 500);
    const safeOffset = parseInt(offset, 10) || 0;

    const { rows: readings, count: total } = await Reading.findAndCountAll({
      where,
      limit: safeLimit,
      offset: safeOffset,
      order: [['timestamp', 'DESC']],
      include: [
        {
          model: Sensor,
          as: 'sensor',
          attributes: ['id', 'name', 'type'],
        },
      ],
    });

    res.json({
      success: true,
      total,
      limit: safeLimit,
      offset: safeOffset,
      data: readings,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
