/**
 * Express.js Server — Entry Point
 * CSIR EOI No. 8121/10/02/2026
 *
 * Sequelize Web Stack Demo
 * Demonstrates: Express middleware chain, Sequelize ORM, REST API design
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ── Import Routes ──────────────────────────────────────────────────
const healthRoutes   = require('./routes/health');
const sensorRoutes   = require('./routes/sensors');
const readingRoutes  = require('./routes/readings');
const authRoutes     = require('./routes/auth');

// ── Create Express App ─────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware Chain ────────────────────────────────────────────────
// 1. Security headers (Helmet)
app.use(helmet());

// 2. CORS — allow frontend origin
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Request logging (simple, development-friendly)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} — ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// ── API Routes ─────────────────────────────────────────────────────
app.use('/api/health',   healthRoutes);
app.use('/api/sensors',  sensorRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/auth',     authRoutes);

// ── Root endpoint ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Sequelize Web Stack Demo API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      sensors: 'GET|POST /api/sensors',
      sensorById: 'GET /api/sensors/:id',
      readings: 'GET|POST /api/readings',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
    },
  });
});

// ── Error Handling ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────
// Only start listening if this file is run directly (not imported for tests)
if (require.main === module) {
  const startServer = async () => {
    try {
      // Sync all Sequelize models with the database
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully');

      app.listen(PORT, () => {
        console.log(`\n════════════════════════════════════════════`);
        console.log(`  Sequelize Web Stack Demo`);
        console.log(`  Server running on http://localhost:${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`════════════════════════════════════════════\n`);
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  };

  startServer();
}

// Export app for testing with Supertest
module.exports = app;
