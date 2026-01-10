import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';
import { inject } from '@vercel/analytics';
import { HelmetProvider } from 'react-helmet-async';

inject();

/**
 * API GENERAL (SSWEB, AI, ALLINDL, CONTACT)
 * Menggunakan Proxy Vercel ("/") yang diarahkan ke kaai-api.akadev.me
 */
window.apiMain = axios.create({
  baseURL: "/", 
  headers: { "Content-Type": "application/json" }
});

/**
 * API YTDL (PYTHON)
 * Menggunakan Proxy Vercel ("/") yang diarahkan ke api-ytdlpy.akadev.me
 */
window.apiYtdl = axios.create({
  baseURL: "/", 
  headers: { 
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  timeout: 600000 
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
