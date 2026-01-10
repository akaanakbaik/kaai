import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NeoButton, PageWrapper } from '../components/NeoUI';
import { 
  ArrowLeft, Terminal, Copy, Check, Code, Zap, ChevronDown, 
  Youtube, Globe, MessageSquare, Layers
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';

const CodeBlock = ({ label, code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-2 group">
      <div className="flex justify-between items-center bg-[#0a0a0a] px-3 py-1 rounded-t-md border border-black/20">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <button 
          onClick={handleCopy} 
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-[4px] text-[8px] font-bold active:scale-95"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? 'COPIED' : 'SALIN'}
        </button>
      </div>
      <div className="bg-[#1e1e1e] p-2 rounded-b-md border border-t-0 border-black/20 overflow-auto max-h-[250px] custom-scrollbar">
        <pre className="font-mono text-[9px] md:text-[10px] text-green-400 leading-relaxed whitespace-pre min-w-max">
          {code}
        </pre>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, desc, color, isOpen, onClick, children }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`border-2 border-black rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_black] bg-white mb-3 relative`}
    >
      <div 
        onClick={onClick}
        className={`p-3 flex items-center justify-between cursor-pointer ${color} border-b-2 border-black active:bg-opacity-90`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-md border-2 border-black shadow-sm">
            <Icon size={16} className="text-black" />
          </div>
          <div>
            <h3 className="font-black text-xs leading-none uppercase tracking-wide">{title}</h3>
            <p className="text-[8px] font-bold opacity-70 mt-0.5 uppercase tracking-wider">{desc}</p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="bg-white p-0.5 rounded-full border-2 border-black shadow-sm"
        >
          <ChevronDown size={12} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-white overflow-hidden"
          >
            <div className="p-3 space-y-4 text-xs">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Docs = () => {
  const [activeTab, setActiveTab] = useState('ytdl');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const toggleTab = (id) => setActiveTab(activeTab === id ? null : id);

  return (
    <PageWrapper>
      <Helmet><title>API Docs</title></Helmet>
      
      <div ref={containerRef} className="w-full max-w-2xl mx-auto px-2 pb-10 pt-4 relative">
        
        <motion.div style={{ y }} className="mb-6 relative z-0">
          <div className="flex justify-start mb-3">
            <Link to="/">
              <NeoButton variant="white" className="h-6 text-[9px] px-3 border-2 shadow-[2px_2px_0px_0px_black] rounded-md hover:bg-black hover:text-white transition-colors uppercase font-bold">
                <ArrowLeft size={10} className="mr-1"/> KEMBALI
              </NeoButton>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-1 leading-none text-black drop-shadow-sm">
              API <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">DOCS</span>
            </h1>
            <div className="inline-flex items-center gap-2 bg-white border border-black px-2 py-0.5 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <code className="font-mono font-bold text-[9px] text-gray-700">base: https://kaai.vercel.app/api</code>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 space-y-3">
          
          <ServiceCard 
            icon={Youtube} 
            title="YOUTUBE DL" 
            desc="MP3 & MP4 Converter" 
            color="bg-[#FFDC58]"
            isOpen={activeTab === 'ytdl'}
            onClick={() => toggleTab('ytdl')}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Terminal size={12} className="text-blue-600" />
                <span className="font-black text-[9px] uppercase">cURL Command</span>
              </div>
              <CodeBlock label="GET MP3" code={`curl -X GET "https://kaai.vercel.app/api/ytdl/mp3?url=https://youtu.be/..."`} />
              <CodeBlock label="GET MP4" code={`curl -X GET "https://kaai.vercel.app/api/ytdl/mp4?url=https://youtu.be/..."`} />
            </div>

            <div className="space-y-1 pt-2 border-t border-dashed border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={12} className="text-yellow-600" />
                <span className="font-black text-[9px] uppercase">JSON Response</span>
              </div>
              <CodeBlock label="OUTPUT" code={`{
  "status": true,
  "author": "aka",
  "metadata": {
    "title": "Song Title",
    "thumbnail": "https://img...",
    "duration": "03:45",
    "download_url": "https://cdn...",
    "preview_url": "https://cdn...",
    "engine": "Engine A (Audio/Pure)"
  }
}`} />
            </div>

            <div className="space-y-1 pt-2 border-t border-dashed border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <Code size={12} className="text-purple-600" />
                <span className="font-black text-[9px] uppercase">Node.js Scraper</span>
              </div>
              <CodeBlock label="SCRAPER.JS" code={`const axios = require('axios');

// Function Utama
async function kaaiDownload(url, type = 'mp3') {
  try {
    const endpoint = type === 'mp3' ? 'mp3' : 'mp4';
    const { data } = await axios.get(\`https://kaai.vercel.app/api/ytdl/\${endpoint}\`, {
      params: { url },
      timeout: 300000 // Wajib 5 Menit
    });
    return data;
  } catch (e) {
    return { status: false, msg: e.message };
  }
}

// --- CONTOH MP3 ---
kaaiDownload('https://youtu.be/...', 'mp3').then(res => {
  console.log('🎵 Audio:', res.metadata.download_url);
});

// --- CONTOH MP4 ---
kaaiDownload('https://youtu.be/...', 'mp4').then(res => {
  console.log('🎬 Video:', res.metadata.download_url);
});`} />
            </div>
          </ServiceCard>

          <ServiceCard 
            icon={Layers} 
            title="ALL-IN-ONE" 
            desc="Social Media" 
            color="bg-[#60A5FA]"
            isOpen={activeTab === 'aio'}
            onClick={() => toggleTab('aio')}
          >
            <div className="text-center py-4 opacity-50 font-bold text-[9px] bg-gray-50 rounded border border-gray-200">
              Coming Soon...
            </div>
          </ServiceCard>

          <ServiceCard 
            icon={Globe} 
            title="SSWEB PRO" 
            desc="Screenshot Tool" 
            color="bg-[#FF90E8]"
            isOpen={activeTab === 'ssweb'}
            onClick={() => toggleTab('ssweb')}
          >
            <div className="text-center py-4 opacity-50 font-bold text-[9px] bg-gray-50 rounded border border-gray-200">
              Coming Soon...
            </div>
          </ServiceCard>

          <ServiceCard 
            icon={MessageSquare} 
            title="KAAI AI" 
            desc="Smart Bot" 
            color="bg-[#A3E635]"
            isOpen={activeTab === 'ai'}
            onClick={() => toggleTab('ai')}
          >
            <div className="text-center py-4 opacity-50 font-bold text-[9px] bg-gray-50 rounded border border-gray-200">
              Coming Soon...
            </div>
          </ServiceCard>

        </div>

      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #22c55e; border-radius: 2px; }
      `}</style>
    </PageWrapper>
  )
}

export default Docs;
