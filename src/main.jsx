import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';
import { inject } from '@vercel/analytics';
import { HelmetProvider } from 'react-helmet-async';

inject();

// API UTAMA WEBSITE (Tetap Direct ke Server KAAI API)
window.apiMain = axios.create({
  baseURL: "https://kaai-api.akadev.me",
  headers: { "Content-Type": "application/json" }
});

/**
 * 🔗 KONEKSI KE BACKEND YTDL (SECURE PROXY)
 * Khusus untuk YTDL (Python), kita lewatkan proxy Vercel ("/") 
 * agar URL asli Cloudflare Tunnel (api-ytdlpy...) TIDAK BOCOR ke user.
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
