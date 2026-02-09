/**
 * React Entry Point
 * CSIR EOI No. 8121/10/02/2026
 *
 * Mounts the root App component into the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
