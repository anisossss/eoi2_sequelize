/**
 * Header Component
 * CSIR EOI No. 8121/10/02/2026
 *
 * Top navigation bar showing:
 * - Application title
 * - Database connection status indicator
 */

import React from 'react';

function Header({ health }) {
  const isConnected = health?.success && health?.database?.status === 'connected';
  const statusText = health
    ? isConnected
      ? 'Connected'
      : 'Disconnected'
    : 'Checking...';

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-brand">
          <h1 className="header-title">Sequelize Web Stack Demo</h1>
          <span className="header-subtitle">
            Express.js + Sequelize + React
          </span>
        </div>

        <div className="header-status">
          <span
            className={`status-dot ${
              health
                ? isConnected
                  ? 'status-connected'
                  : 'status-disconnected'
                : 'status-checking'
            }`}
          />
          <span className="status-text">
            DB: {statusText}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
