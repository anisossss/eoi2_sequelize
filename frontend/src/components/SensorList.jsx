/**
 * SensorList Component
 * CSIR EOI No. 8121/10/02/2026
 *
 * Fetches and displays all sensors from the API.
 * Each sensor is rendered as a SensorCard.
 */

import React, { useState, useEffect } from 'react';
import SensorCard from './SensorCard';
import { fetchSensors } from '../services/api';

function SensorList({ selectedId, onSelect }) {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sensors on mount
  useEffect(() => {
    const loadSensors = async () => {
      try {
        setLoading(true);
        const result = await fetchSensors();
        setSensors(result.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSensors([]);
      } finally {
        setLoading(false);
      }
    };
    loadSensors();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading sensors...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load sensors</p>
        <small>{error}</small>
      </div>
    );
  }

  // Empty state
  if (sensors.length === 0) {
    return (
      <div className="empty-state">
        <p>No sensors found</p>
        <small>Add sensors via the API to see them here.</small>
      </div>
    );
  }

  return (
    <div className="sensor-list">
      {sensors.map((sensor) => (
        <SensorCard
          key={sensor.id}
          sensor={sensor}
          isSelected={sensor.id === selectedId}
          onClick={() => onSelect(sensor)}
        />
      ))}
    </div>
  );
}

export default SensorList;
