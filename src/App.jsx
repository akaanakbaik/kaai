import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Ytdl from './pages/Ytdl';
import AIChat from './pages/AIChat';
import SSWeb from './pages/SSWeb';
import Docs from './pages/Docs';
import AllInDL from './pages/AllInDL'; // <--- PASTIKAN INI ADA

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        gutter={8}
        toastOptions={{
            duration: 3000,
            style: { border: '2px solid black', padding: '12px', color: '#000', boxShadow: '4px 4px 0px 0px black', fontWeight: 'bold', borderRadius: '8px', background: '#fff', fontFamily: 'Space Grotesk' },
            success: { style: { background: '#A3E635' }, iconTheme: { primary: 'black', secondary: '#A3E635' } },
            error: { style: { background: '#FF90E8' }, iconTheme: { primary: 'black', secondary: '#FF90E8' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/ytdl" element={<Ytdl />} />
        <Route path="/allindl" element={<AllInDL />} /> {/* <--- INI WAJIB ADA */}
        <Route path="/ai/chat" element={<AIChat />} />
        <Route path="/ssweb" element={<SSWeb />} />
      </Routes>
    </Router>
  );
}

export default App;
