/**
 * User Model — Sequelize Definition
 * CSIR EOI No. 8121/10/02/2026
 *
 * Stores user accounts for API authentication:
 * - Email-based login with bcrypt password hashing
 * - Role-based access (admin / user)
 * - Sequelize hooks for automatic password hashing
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // User's display name
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' },
        len: {
          args: [2, 100],
          msg: 'Name must be between 2 and 100 characters',
        },
      },
    },

    // Unique email address for login
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
        notEmpty: { msg: 'Email cannot be empty' },
      },
    },

    // Hashed password (never stored in plaintext)
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters',
        },
      },
    },

    // User role for authorization
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false,
    },
  }, {
    tableName: 'users',
    timestamps: true,

    // ── Hooks ─────────────────────────────────────────────────────
    hooks: {
      // Hash password before creating a new user
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Hash password before updating (only if changed)
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // ── Instance method: compare password ───────────────────────────
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  // ── Instance method: safe JSON (exclude password) ───────────────
  User.prototype.toSafeJSON = function () {
    const { password, ...safe } = this.toJSON();
    return safe;
  };

  return User;
};
