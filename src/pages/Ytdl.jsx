import React, { useState, useEffect } from 'react';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import {
  Search,
  Download,
  Music,
  Video,
  ArrowLeft,
  Loader,
  CheckCircle,
  AlertTriangle,
  Clipboard,
  Cpu,
  Clock,
  Eye,
  PlayCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const Ytdl = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('mp4'); // mp4 (Video) or mp3 (Audio)
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('idle'); // idle, processing, done, error
  const [data, setData] = useState(null);
  const [engineInfo, setEngineInfo] = useState('');

  // Fitur Auto Paste dari Clipboard (Optional UX Improvement)
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        toast.success('Link ditempel!');
      }
    } catch (err) {
      toast.error('Gagal membaca clipboard');
    }
  };

  const handleProcess = async () => {
    if (!url) {
      toast.error('Mohon masukkan link YouTube');
      return;
    }

    // Validasi URL sederhana
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast.error('Link tidak valid (Harus YouTube)');
      return;
    }

    setLoading(true);
    setStage('processing');
    setData(null);
    setEngineInfo('');

    try {
      // Backend kita menggunakan satu endpoint utama utk Info/Metadata
      // Stream URL akan disesuaikan di Frontend player (Audio/Video tag)
      const endpoint = '/api/ytdl/info';

      // Menggunakan instance axios yang sudah dikonfigurasi di main.jsx
      // Timeout backend kita set 60s, jadi frontend harus sabar menunggu Dual Engine
      const res = await window.apiYtdl.post(endpoint, { url });

      if (!res.data || !res.data.status) {
        throw new Error(res.data?.msg || 'Gagal mengambil data dari server');
      }

      setData(res.data.metadata);
      setEngineInfo(res.data.engine_used || 'Dual Engine System');
      setStage('done');
      toast.success('Berhasil! Video siap diputar/unduh.');

    } catch (err) {
      console.error("YTDL Error:", err);
      setStage('error');
      
      const errMsg = err.response?.data?.msg || err.message || 'Server sedang sibuk, coba lagi.';
      toast.error(errMsg);
      
    } finally {
      setLoading(false);
    }
  };

  // Variabel animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI Dual-Engine YTDL</title>
      </Helmet>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/">
          <NeoButton variant="white" className="h-9 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <ArrowLeft size={14} className="mr-1" /> KEMBALI
          </NeoButton>
        </Link>
        <div className="text-right">
          <h1 className="text-3xl font-black italic tracking-tighter text-black drop-shadow-sm">
            YT<span className="text-[#FF4D4D]">DL</span>
          </h1>
          <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">v3.0 DUAL ENGINE</span>
        </div>
      </div>

      {/* INPUT CARD */}
      <NeoCard
        className="bg-[#A3E635] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
      >
        {/* Dekorasi Background */}
        <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
          <PlayCircle size={150} />
        </div>

        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
           <Video size={24} /> DOWNLOADER
        </h2>

        <div className="space-y-4 relative z-10">
          <div className="relative">
            <NeoInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Tempel Link YouTube disini..."
              disabled={loading}
              className="pr-12 text-sm font-medium"
            />
            <button 
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:bg-black hover:text-white p-1 rounded-md transition-colors"
              title="Paste from Clipboard"
            >
              <Clipboard size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NeoButton
              onClick={() => setType('mp3')}
              variant={type === 'mp3' ? 'dark' : 'white'}
              className={`h-12 border-2 ${type === 'mp3' ? 'border-white' : 'border-black'}`}
            >
              <Music size={18} className={type === 'mp3' ? 'animate-pulse' : ''} /> 
              <span className="ml-2">AUDIO (MP3)</span>
            </NeoButton>
            <NeoButton
              onClick={() => setType('mp4')}
              variant={type === 'mp4' ? 'dark' : 'white'}
              className={`h-12 border-2 ${type === 'mp4' ? 'border-white' : 'border-black'}`}
            >
              <Video size={18} className={type === 'mp4' ? 'animate-pulse' : ''} />
              <span className="ml-2">VIDEO (MP4)</span>
            </NeoButton>
          </div>

          <NeoButton
            onClick={handleProcess}
            disabled={loading}
            className="w-full h-14 text-base font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#FF4D4D] text-white hover:bg-[#ff3333]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin" size={20} />
                MENJALANKAN DUAL ENGINE...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search size={20} />
                PROSES SEKARANG
              </div>
            )}
          </NeoButton>

          {/* STATUS INDICATOR */}
          <AnimatePresence mode='wait'>
            {stage === 'processing' && (
              <motion.div
                key="proc"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/10 p-3 rounded-lg border-2 border-black border-dashed flex items-center justify-center gap-3 text-xs font-bold"
              >
                <Cpu className="animate-spin-slow" size={16} />
                <span>Balapan Engine A vs Engine B...</span>
              </motion.div>
            )}

            {stage === 'error' && (
              <motion.div
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#FF6B6B] text-white p-3 rounded-lg border-2 border-black flex items-center gap-3 font-bold text-xs shadow-sm"
              >
                <AlertTriangle size={18} />
                <span>Gagal. Sistem kami sedang sibuk atau link invalid.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </NeoCard>

      {/* RESULT CARD */}
      <AnimatePresence>
        {data && stage === 'done' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-8"
          >
            <NeoCard
              className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="relative border-b-3 border-black pb-4 mb-4">
                 <img
                  src={data.thumbnail}
                  alt="Thumbnail"
                  className="w-full rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] object-cover aspect-video"
                />
                <div className="absolute top-2 right-2 bg-[#A3E635] text-black text-[10px] font-black px-2 py-1 border border-black shadow-sm rounded">
                   {type.toUpperCase()}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-black leading-tight line-clamp-2">
                  {data.title}
                </h3>

                {/* METADATA BADGES */}
                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  {data.duration && (
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-black">
                      <Clock size={12} /> {data.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded border border-black text-blue-800">
                    <Cpu size={12} /> {engineInfo}
                  </span>
                  {data.metadata?.view_count && (
                     <span className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded border border-black">
                      <Eye size={12} /> {Number(data.metadata.view_count).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* PLAYER */}
                <div className="bg-black p-1 rounded-lg mt-4">
                  {type === 'mp3' ? (
                     <audio controls className="w-full h-10 block" src={data.url} />
                  ) : (
                     <video controls className="w-full rounded border border-gray-700 bg-[#1a1a1a]" src={data.url} />
                  )}
                </div>

                {/* DOWNLOAD BUTTON */}
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="block mt-4"
                >
                  <NeoButton 
                    variant="primary" 
                    className="w-full h-12 text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#3B82F6] text-white"
                  >
                    <Download size={18} className="mr-2" />
                    DOWNLOAD FILE ({type.toUpperCase()})
                  </NeoButton>
                </a>
                
                <p className="text-[10px] text-center text-gray-500 font-medium mt-2">
                  *File di-stream melalui Proxy Server Aman (Cloudflare Tunnel)
                </p>
              </div>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Ytdl;
