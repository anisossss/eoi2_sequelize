/**
 * Database Seeder
 * CSIR EOI No. 8121/10/02/2026
 *
 * Populates the database with sample data for demonstration:
 * - 5 Sensors (various types)
 * - 50 Readings (10 per sensor)
 * - 1 Admin user, 1 Regular user
 *
 * Uses Sequelize transactions for data integrity.
 * Run: node src/seeders/seed.js
 */

const { sequelize, Sensor, Reading, User } = require('../models');

// ── Sample sensor data ──────────────────────────────────────────────
const sensorData = [
  {
    name: 'Lab Temperature Sensor A',
    type: 'temperature',
    location: 'CSIR Research Lab - Room 101',
    status: 'active',
    description: 'Primary temperature monitor for the main research laboratory',
  },
  {
    name: 'Server Room Humidity',
    type: 'humidity',
    location: 'CSIR Data Centre - Server Room B',
    status: 'active',
    description: 'Monitors humidity levels to protect server equipment',
  },
  {
    name: 'Atmospheric Pressure Unit',
    type: 'pressure',
    location: 'CSIR Weather Station - Rooftop',
    status: 'active',
    description: 'Barometric pressure sensor for weather monitoring',
  },
  {
    name: 'Office Light Sensor',
    type: 'light',
    location: 'CSIR Admin Building - Open Plan Office',
    status: 'inactive',
    description: 'Ambient light level sensor for energy management',
  },
  {
    name: 'Motion Detector Entrance',
    type: 'motion',
    location: 'CSIR Main Building - Reception',
    status: 'active',
    description: 'Motion detection for security and occupancy tracking',
  },
];

// ── Unit mapping per sensor type ────────────────────────────────────
const unitMap = {
  temperature: '°C',
  humidity: '%',
  pressure: 'hPa',
  light: 'lux',
  motion: 'events',
  gas: 'ppm',
};

// ── Value range per sensor type (for realistic random data) ─────────
const rangeMap = {
  temperature: { min: 18, max: 32 },
  humidity: { min: 30, max: 80 },
  pressure: { min: 990, max: 1030 },
  light: { min: 100, max: 1500 },
  motion: { min: 0, max: 20 },
  gas: { min: 300, max: 600 },
};

/**
 * Generate a random float between min and max, rounded to 1 decimal
 */
function randomValue(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

/**
 * Main seeder function
 */
async function seed() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Syncing database schema...');
    await sequelize.sync({ force: true }); // Drop and recreate all tables

    console.log('Seeding sensors...');
    const sensors = await Sensor.bulkCreate(sensorData, { transaction });
    console.log(`  Created ${sensors.length} sensors`);

    console.log('Seeding readings...');
    const readingsData = [];
    const now = Date.now();

    for (const sensor of sensors) {
      const range = rangeMap[sensor.type];
      const unit = unitMap[sensor.type];

      // Generate 10 readings per sensor, spread over the last 24 hours
      for (let i = 0; i < 10; i++) {
        const hoursAgo = Math.random() * 24;
        readingsData.push({
          sensorId: sensor.id,
          value: randomValue(range.min, range.max),
          unit,
          timestamp: new Date(now - hoursAgo * 3600 * 1000),
        });
      }
    }

    await Reading.bulkCreate(readingsData, { transaction });
    console.log(`  Created ${readingsData.length} readings`);

    console.log('Seeding users...');
    await User.create(
      {
        name: 'Admin User',
        email: 'admin@csir.co.za',
        password: 'admin123',
        role: 'admin',
      },
      { transaction }
    );
    await User.create(
      {
        name: 'Demo User',
        email: 'user@csir.co.za',
        password: 'user1234',
        role: 'user',
      },
      { transaction }
    );
    console.log('  Created 2 users (admin + user)');

    await transaction.commit();
    console.log('\nSeeding complete!');
  } catch (err) {
    await transaction.rollback();
    console.error('Seeding failed:', err);
    throw err;
  }
}

// Run if executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Done. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seed;
