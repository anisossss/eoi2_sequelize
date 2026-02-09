/**
 * Model Unit Tests
 * CSIR EOI No. 8121/10/02/2026
 *
 * Tests Sequelize model definitions, validations, and associations
 * directly (without HTTP layer).
 */

process.env.NODE_ENV = 'test';

const { sequelize, Sensor, Reading, User } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Sensor Model', () => {
  it('should create a valid sensor', async () => {
    const sensor = await Sensor.create({
      name: 'Model Test Sensor',
      type: 'humidity',
      location: 'Model Test Lab',
    });

    expect(sensor.id).toBeDefined();
    expect(sensor.name).toBe('Model Test Sensor');
    expect(sensor.type).toBe('humidity');
    expect(sensor.status).toBe('active'); // Default value
    expect(sensor.createdAt).toBeDefined();
    expect(sensor.updatedAt).toBeDefined();
  });

  it('should reject a sensor with an empty name', async () => {
    await expect(
      Sensor.create({
        name: '',
        type: 'temperature',
        location: 'Somewhere',
      })
    ).rejects.toThrow();
  });
});

describe('Reading Model', () => {
  it('should create a reading linked to a sensor', async () => {
    const sensor = await Sensor.create({
      name: 'Reading Test Sensor',
      type: 'pressure',
      location: 'Reading Test Lab',
    });

    const reading = await Reading.create({
      sensorId: sensor.id,
      value: 1013.25,
      unit: 'hPa',
    });

    expect(reading.id).toBeDefined();
    expect(reading.sensorId).toBe(sensor.id);
    expect(reading.value).toBe(1013.25);
    expect(reading.timestamp).toBeDefined();
  });
});

describe('Sensor-Reading Association', () => {
  it('should retrieve a sensor with its readings', async () => {
    const sensor = await Sensor.create({
      name: 'Assoc Test Sensor',
      type: 'light',
      location: 'Assoc Test Room',
    });

    await Reading.bulkCreate([
      { sensorId: sensor.id, value: 500, unit: 'lux' },
      { sensorId: sensor.id, value: 520, unit: 'lux' },
      { sensorId: sensor.id, value: 480, unit: 'lux' },
    ]);

    // Eager load readings via the association
    const sensorWithReadings = await Sensor.findByPk(sensor.id, {
      include: [{ model: Reading, as: 'readings' }],
    });

    expect(sensorWithReadings.readings).toBeDefined();
    expect(sensorWithReadings.readings.length).toBe(3);
    expect(sensorWithReadings.readings[0].unit).toBe('lux');
  });
});

describe('User Model', () => {
  it('should hash password on creation', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'plaintext123',
    });

    // Password should be hashed, not plaintext
    expect(user.password).not.toBe('plaintext123');
    expect(user.password.length).toBeGreaterThan(20); // bcrypt hash is ~60 chars

    // comparePassword should return true for correct password
    const isMatch = await user.comparePassword('plaintext123');
    expect(isMatch).toBe(true);

    // comparePassword should return false for wrong password
    const isWrong = await user.comparePassword('wrongpassword');
    expect(isWrong).toBe(false);
  });
});
