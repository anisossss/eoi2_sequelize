/**
 * Health Endpoint Tests
 * CSIR EOI No. 8121/10/02/2026
 *
 * Tests the GET /api/health endpoint using Supertest.
 */

process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/server');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/health', () => {
  it('should return 200 and health status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('API is running');
    expect(res.body.database).toBeDefined();
    expect(res.body.database.status).toBe('connected');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.uptime).toBeDefined();
  });

  it('should include environment info', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.environment).toBe('test');
    expect(res.body.database.dialect).toBe('sqlite');
  });
});

describe('GET /', () => {
  it('should return API information at root', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Sequelize Web Stack Demo');
    expect(res.body.endpoints).toBeDefined();
  });
});
