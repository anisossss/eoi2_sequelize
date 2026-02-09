/**
 * Sensor CRUD Tests
 * CSIR EOI No. 8121/10/02/2026
 *
 * Tests Sensor and Reading API endpoints using Supertest.
 * Verifies CRUD operations, validation, and eager loading.
 */

process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/server');
const { sequelize, Sensor } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Sensor API', () => {
  let sensorId;

  // ── POST /api/sensors ──────────────────────────────────────────
  describe('POST /api/sensors', () => {
    it('should create a new sensor', async () => {
      const res = await request(app)
        .post('/api/sensors')
        .send({
          name: 'Test Temperature Sensor',
          type: 'temperature',
          location: 'Test Lab Room 1',
          description: 'A test sensor for unit testing',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Temperature Sensor');
      expect(res.body.data.type).toBe('temperature');
      expect(res.body.data.status).toBe('active'); // Default value
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();

      sensorId = res.body.data.id;
    });

    it('should reject sensor with missing required fields', async () => {
      const res = await request(app)
        .post('/api/sensors')
        .send({ name: 'Incomplete Sensor' }); // Missing type and location

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/sensors ───────────────────────────────────────────
  describe('GET /api/sensors', () => {
    it('should return a list of sensors with readings count', async () => {
      const res = await request(app).get('/api/sensors');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });
  });

  // ── GET /api/sensors/:id ───────────────────────────────────────
  describe('GET /api/sensors/:id', () => {
    it('should return a sensor by ID with readings', async () => {
      const res = await request(app).get(`/api/sensors/${sensorId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(sensorId);
      expect(res.body.data.readings).toBeDefined();
      expect(Array.isArray(res.body.data.readings)).toBe(true);
    });

    it('should return 404 for non-existent sensor', async () => {
      const res = await request(app).get('/api/sensors/99999');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });

  // ── POST /api/readings ─────────────────────────────────────────
  describe('POST /api/readings', () => {
    it('should create a reading for an existing sensor', async () => {
      const res = await request(app)
        .post('/api/readings')
        .send({
          sensorId,
          value: 23.5,
          unit: '°C',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.value).toBe(23.5);
      expect(res.body.data.sensorId).toBe(sensorId);
    });
  });
});
