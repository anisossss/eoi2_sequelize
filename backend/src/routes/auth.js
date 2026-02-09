/**
 * Authentication Routes
 * CSIR EOI No. 8121/10/02/2026
 *
 * JWT-based authentication endpoints:
 * - POST /api/auth/register — Create a new user account
 * - POST /api/auth/login    — Authenticate and receive a JWT
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

// Token expiry duration
const TOKEN_EXPIRY = '24h';

/**
 * POST /api/auth/register
 * Register a new user account.
 * Body: { name, email, password }
 * Password is hashed automatically by the User model hook.
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      return next(error);
    }

    // Create user (password hashed via beforeCreate hook)
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toSafeJSON(),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Authenticate with email and password, receive JWT.
 * Body: { email, password }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      return next(error);
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    // Compare password using instance method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeJSON(),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
