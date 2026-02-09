/**
 * API Client Service
 * CSIR EOI No. 8121/10/02/2026
 *
 * Axios-based HTTP client for communicating with the Express.js backend.
 * All API calls are centralised here for maintainability.
 */

import axios from 'axios';

// Base URL — uses CRA proxy in dev, or env variable in production
const API_BASE = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Response interceptor: unwrap data ────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Network error';
    console.error('[API Error]', message);
    return Promise.reject(new Error(message));
  }
);

// ── Health ───────────────────────────────────────────────────────
export const fetchHealth = () => api.get('/health');

// ── Sensors ─────────────────────────────────────────────────────
export const fetchSensors = () => api.get('/sensors');

export const fetchSensorById = (id) => api.get(`/sensors/${id}`);

export const createSensor = (data) => api.post('/sensors', data);

// ── Readings ────────────────────────────────────────────────────
export const fetchReadings = (params = {}) =>
  api.get('/readings', { params });

export const createReading = (data) => api.post('/readings', data);

export default api;
