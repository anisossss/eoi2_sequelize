/**
 * ReadingChart Component
 * CSIR EOI No. 8121/10/02/2026
 *
 * Displays recent readings for a selected sensor.
 * Shows data as a clean table with timestamp, value, and unit.
 * Also includes a simple visual bar representation of values.
 */

import React, { useState, useEffect } from 'react';
import { fetchReadings } from '../services/api';

function ReadingChart({ sensorId }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch readings whenever sensorId changes
  useEffect(() => {
    const loadReadings = async () => {
      try {
        setLoading(true);
        const result = await fetchReadings({ sensorId, limit: 20 });
        setReadings(result.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setReadings([]);
      } finally {
        setLoading(false);
      }
    };

    if (sensorId) {
      loadReadings();
    }
  }, [sensorId]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading readings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load readings</p>
        <small>{error}</small>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="empty-state">
        <p>No readings recorded yet</p>
      </div>
    );
  }

  // Calculate min/max for the simple bar chart
  const values = readings.map((r) => r.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  return (
    <div className="readings-section">
      {/* Summary stats */}
      <div className="readings-stats">
        <div className="stat">
          <span className="stat-label">Total</span>
          <span className="stat-value">{readings.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Min</span>
          <span className="stat-value">
            {minVal.toFixed(1)} {readings[0]?.unit}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Max</span>
          <span className="stat-value">
            {maxVal.toFixed(1)} {readings[0]?.unit}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg</span>
          <span className="stat-value">
            {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}{' '}
            {readings[0]?.unit}
          </span>
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="bar-chart">
        {readings.map((reading, index) => {
          const pct = ((reading.value - minVal) / range) * 100;
          return (
            <div key={reading.id || index} className="bar-row">
              <span className="bar-label">
                {new Date(reading.timestamp).toLocaleTimeString()}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.max(pct, 5)}%` }}
                />
              </div>
              <span className="bar-value">
                {reading.value} {reading.unit}
              </span>
            </div>
          );
        })}
      </div>

      {/* Data table */}
      <h3 className="table-title">Raw Data</h3>
      <div className="table-wrapper">
        <table className="readings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Timestamp</th>
              <th>Value</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading, index) => (
              <tr key={reading.id || index}>
                <td>{index + 1}</td>
                <td>{new Date(reading.timestamp).toLocaleString()}</td>
                <td className="value-cell">{reading.value}</td>
                <td>{reading.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReadingChart;
