/**
 * Main App Component
 * CSIR EOI No. 8121/10/02/2026
 *
 * Root component that orchestrates the dashboard layout:
 * - Header with app title and health status
 * - Sensor list with drill-down to readings
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SensorList from './components/SensorList';
import ReadingChart from './components/ReadingChart';
import { fetchHealth } from './services/api';

function App() {
  // Health status from the backend
  const [health, setHealth] = useState(null);
  // Currently selected sensor for detail view
  const [selectedSensor, setSelectedSensor] = useState(null);

  // Fetch health status on mount
  useEffect(() => {
    const loadHealth = async () => {
      try {
        const data = await fetchHealth();
        setHealth(data);
      } catch (err) {
        console.error('Health check failed:', err);
        setHealth({ success: false, message: 'API unreachable' });
      }
    };
    loadHealth();
  }, []);

  return (
    <div className="app">
      <Header health={health} />

      <main className="main-content">
        <div className="container">
          {/* Two-column layout: sensor list + detail panel */}
          <div className="dashboard">
            <section className="panel sensor-panel">
              <h2 className="panel-title">Sensors</h2>
              <SensorList
                selectedId={selectedSensor?.id}
                onSelect={setSelectedSensor}
              />
            </section>

            <section className="panel detail-panel">
              {selectedSensor ? (
                <>
                  <h2 className="panel-title">
                    Readings — {selectedSensor.name}
                  </h2>
                  <div className="sensor-meta">
                    <span className="badge badge-type">{selectedSensor.type}</span>
                    <span className="badge badge-status">{selectedSensor.status}</span>
                    <span className="meta-location">{selectedSensor.location}</span>
                  </div>
                  <ReadingChart sensorId={selectedSensor.id} />
                </>
              ) : (
                <div className="placeholder">
                  <div className="placeholder-icon">📊</div>
                  <p>Select a sensor to view its readings</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Sequelize Web Stack Demo — CSIR EOI No. 8121/10/02/2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
