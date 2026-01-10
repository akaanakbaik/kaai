import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NeoButton, PageWrapper } from '../components/NeoUI';
import { 
  ArrowLeft, Terminal, Copy, Check, Code, Zap, ChevronDown, 
  Youtube, Globe, MessageSquare, Download, Layers 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';

// --- COMPONENTS ---

const CodeBlock = ({ label, lang, code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 group">
      <div className="flex justify-between items-center bg-[#111] px-3 py-1.5 rounded-t-lg border-2 border-b-0 border-black">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label} ({lang})</span>
        <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <div className="bg-[#1e1e1e] p-4 rounded-b-lg border-2 border-black overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-[10px] md:text-xs text-green-400 leading-relaxed whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
};

const ServiceCard = ({ id, icon: Icon, title, desc, color, isOpen, onClick, children }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`border-3 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_black] bg-white mb-6 relative group`}
    >
      <div 
        onClick={onClick}
        className={`p-5 flex items-center justify-between cursor-pointer ${color} transition-colors border-b-3 border-black`}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white p-2.5 rounded-xl border-2 border-black shadow-sm group-hover:scale-110 transition-transform">
            <Icon size={24} className="text-black" />
          </div>
          <div>
            <h3 className="font-black text-lg md:text-xl leading-none tracking-tight">{title}</h3>
            <p className="text-[10px] md:text-xs font-bold opacity-70 mt-1 uppercase tracking-wider">{desc}</p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="bg-white p-1.5 rounded-full border-2 border-black shadow-sm"
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white"
          >
            <div className="p-6 space-y-8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MAIN DOCS ---

const Docs = () => {
  const [activeTab, setActiveTab] = useState('ytdl'); // Default open first
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const toggleTab = (id) => setActiveTab(activeTab === id ? null : id);

  return (
    <PageWrapper>
      <Helmet><title>KAAI API Reference</title></Helmet>
      
      <div ref={containerRef} className="w-full max-w-4xl mx-auto px-2 pb-24 pt-8 relative">
        
        {/* PARALLAX HEADER */}
        <motion.div style={{ y }} className="mb-12 text-center relative z-0">
          <Link to="/">
            <NeoButton variant="white" className="h-8 text-[10px] mb-6 mx-auto w-fit rounded-lg px-4 border-2 shadow-sm">
              <ArrowLeft size={12} className="mr-1"/> DASHBOARD
            </NeoButton>
          </Link>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4 leading-none text-black drop-shadow-sm">
            API <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">DOCS</span>
          </h1>
          
          <div className="inline-flex items-center gap-3 bg-white border-2 border-black px-4 py-2 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <code className="font-mono font-bold text-xs md:text-sm text-gray-700">https://kaai.vercel.app/api</code>
          </div>
        </motion.div>

        {/* CONTENT GRID */}
        <div className="relative z-10 space-y-8">
          
          {/* 1. YOUTUBE DOWNLOADER */}
          <ServiceCard 
            id="ytdl"
            icon={Youtube} 
            title="YOUTUBE DL" 
            desc="Audio & Video Converter" 
            color="bg-[#FFDC58]"
            isOpen={activeTab === 'ytdl'}
            onClick={() => toggleTab('ytdl')}
          >
            {/* ENDPOINT MP3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">GET</span>
                <code className="font-mono font-bold text-sm bg-gray-100 px-2 py-0.5 rounded border border-gray-300">/ytdl/mp3</code>
              </div>
              <p className="text-xs text-gray-600 font-bold leading-relaxed">
                Convert YouTube video to high-quality MP3 audio. Includes automatic metadata tagging (cover art, artist, title).
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <CodeBlock label="cURL" lang="bash" code={`curl -X GET "https://kaai.vercel.app/api/ytdl/mp3?url=https://youtu.be/..."`} />
                <CodeBlock label="Node.js" lang="js" code={`const axios = require('axios');
const res = await axios.get('https://kaai.vercel.app/api/ytdl/mp3', { 
  params: { url: 'YT_URL' } 
});`} />
              </div>
            </div>

            <hr className="border-t-2 border-dashed border-gray-300" />

            {/* ENDPOINT MP4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">GET</span>
                <code className="font-mono font-bold text-sm bg-gray-100 px-2 py-0.5 rounded border border-gray-300">/ytdl/mp4</code>
              </div>
              <p className="text-xs text-gray-600 font-bold leading-relaxed">
                Download YouTube video in best available MP4 quality (up to 4K if supported).
              </p>
              
              <CodeBlock label="Python" lang="py" code={`import requests
res = requests.get("https://kaai.vercel.app/api/ytdl/mp4", params={"url": "YT_URL"})
print(res.json())`} />
            </div>

            {/* RESPONSE SCHEMA */}
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <h4 className="font-black text-xs text-blue-800 mb-2 flex items-center gap-2"><Zap size={14}/> RESPONSE OBJECT</h4>
              <pre className="font-mono text-[10px] text-blue-900 whitespace-pre-wrap">
{`{
  "status": true,
  "author": "aka",
  "metadata": {
    "title": "Video Title",
    "thumbnail": "https://img...",
    "duration": "03:45",
    "download_url": "https://cdn..."
  }
}`}
              </pre>
            </div>
          </ServiceCard>

          {/* 2. ALL IN ONE */}
          <ServiceCard 
            id="aio"
            icon={Layers} 
            title="ALL-IN-ONE" 
            desc="Social Media Downloader" 
            color="bg-[#60A5FA]"
            isOpen={activeTab === 'aio'}
            onClick={() => toggleTab('aio')}
          >
            <div className="text-center py-8">
              <Terminal size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">Documentation Coming Soon</p>
            </div>
          </ServiceCard>

          {/* 3. SSWEB */}
          <ServiceCard 
            id="ssweb"
            icon={Globe} 
            title="SSWEB PRO" 
            desc="Website Screenshot" 
            color="bg-[#FF90E8]"
            isOpen={activeTab === 'ssweb'}
            onClick={() => toggleTab('ssweb')}
          >
            <div className="text-center py-8">
              <Terminal size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">Documentation Coming Soon</p>
            </div>
          </ServiceCard>

          {/* 4. AI CHAT */}
          <ServiceCard 
            id="ai"
            icon={MessageSquare} 
            title="KAAI AI" 
            desc="Smart Assistant" 
            color="bg-[#A3E635]"
            isOpen={activeTab === 'ai'}
            onClick={() => toggleTab('ai')}
          >
            <div className="text-center py-8">
              <Terminal size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">Documentation Coming Soon</p>
            </div>
          </ServiceCard>

        </div>

        {/* FOOTER CTA */}
        <div className="mt-16 text-center">
          <p className="text-xs font-bold text-gray-400 mb-4">NEED CUSTOM INTEGRATION?</p>
          <a href="mailto:akaanakbaik17@proton.me" className="inline-block transition-transform hover:-translate-y-1">
            <button className="bg-black text-white px-6 py-3 font-black text-xs uppercase rounded-xl hover:bg-gray-800 transition-colors shadow-[0px_8px_16px_rgba(0,0,0,0.2)]">
              Contact Developer
            </button>
          </a>
        </div>

      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #22c55e; border-radius: 4px; }
      `}</style>
    </PageWrapper>
  )
}

export default Docs
