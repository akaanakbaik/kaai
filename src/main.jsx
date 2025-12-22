import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';
import { inject } from '@vercel/analytics';
import { HelmetProvider } from 'react-helmet-async';

inject();

axios.defaults.baseURL = "https://kaai-api.akadev.me";
axios.defaults.headers.common['Content-Type'] = 'application/json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
