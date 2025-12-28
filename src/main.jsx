import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';
import { inject } from '@vercel/analytics';
import { HelmetProvider } from 'react-helmet-async';

inject();

// API UTAMA WEBSITE
window.apiMain = axios.create({
  baseURL: "https://kaai-api.akadev.me",
  headers: { "Content-Type": "application/json" }
});

/**
 * 🔗 KONEKSI KE BACKEND PYTHON
 * Pastikan URL ini bisa dibuka di browser dan muncul pesan {"status": "online"}
 */
window.apiYtdl = axios.create({
  baseURL: "https://api-ytdlpy.akadev.me", 
  headers: { "Content-Type": "application/json" },
  timeout: 60000 // Tambah timeout jadi 60 detik (backend prosesnya agak lama)
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
