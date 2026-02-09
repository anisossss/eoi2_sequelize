/**
 * SensorCard Component
 * CSIR EOI No. 8121/10/02/2026
 *
 * Displays a single sensor as a clickable card.
 * Shows: name, type, location, status, and readings count.
 */

import React from 'react';

// Type-to-icon mapping for visual identification
const typeIcons = {
  temperature: '🌡️',
  humidity: '💧',
  pressure: '🌀',
  light: '💡',
  motion: '🔔',
  gas: '🌫️',
};

function SensorCard({ sensor, isSelected, onClick }) {
  const icon = typeIcons[sensor.type] || '📡';

  return (
    <div
      className={`sensor-card ${isSelected ? 'sensor-card-selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="sensor-card-icon">{icon}</div>

      <div className="sensor-card-info">
        <h3 className="sensor-card-name">{sensor.name}</h3>
        <p className="sensor-card-location">{sensor.location}</p>

        <div className="sensor-card-meta">
          <span className="badge badge-type">{sensor.type}</span>
          <span
            className={`badge badge-status badge-${sensor.status}`}
          >
            {sensor.status}
          </span>
          {sensor.readingsCount !== undefined && (
            <span className="readings-count">
              {sensor.readingsCount} readings
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SensorCard;
