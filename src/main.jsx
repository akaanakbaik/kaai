import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';
import { inject } from '@vercel/analytics';
import { HelmetProvider } from 'react-helmet-async';

inject();

/**
 * API LAMA (DEFAULT)
 * Dipakai oleh halaman selain YTDL
 */
window.apiMain = axios.create({
  baseURL: "https://kaai-api.akadev.me",
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * API KHUSUS YTDL
 */
window.apiYtdl = axios.create({
  baseURL: "https://api-ytdlpy.akadev.me",
  headers: {
    "Content-Type": "application/json"
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
