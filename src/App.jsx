import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Home from './pages/Home';
import Ytdl from './pages/Ytdl';
import Docs from './pages/Docs';
import NotFound from './pages/NotFound';

function App() {
  const assets = {
    logo: "https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg",
    favicon: "https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.ico"
  };

  return (
    <HelmetProvider>
      <Router>
        {/* SEO Management */}
        <Helmet>
          <title>KAAI - Modern YouTube Downloader & AI Tools</title>
          <meta name="description" content="Download Video YouTube MP3/MP4 gratis tanpa iklan mengganggu dengan desain Neobrutalism." />
          <link rel="icon" type="image/x-icon" href={assets.favicon} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>

        {/* Notifikasi Toast Global */}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              border: '2px solid black',
              boxShadow: '4px 4px 0px 0px black',
              borderRadius: '0px',
              fontWeight: 'bold',
              background: '#fff',
              color: '#000',
            },
            success: {
              iconTheme: { primary: '#A3E635', secondary: 'black' },
            },
            error: {
              iconTheme: { primary: '#F87171', secondary: 'black' },
            },
          }}
        />

        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ytdl" element={<Ytdl />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
