import React, { useState } from 'react';
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
  PlayCircle,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const Ytdl = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('mp4'); // State: 'mp4' (Video) atau 'mp3' (Audio)
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('idle'); // idle, processing, done, error
  const [data, setData] = useState(null);
  
  // Fitur Paste Otomatis
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

    // Validasi URL
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
      toast.error('Link harus URL YouTube valid');
      return;
    }

    setLoading(true);
    setStage('processing');
    setData(null);

    try {
      // Mapping type frontend (mp4/mp3) ke backend (video/audio)
      const backendType = type === 'mp3' ? 'audio' : 'video';

      // Request ke Backend Backend (Local Buffer System)
      // Endpoint: /api/ytdl/info
      // Body: { url: "...", type: "video" }
      const res = await window.apiYtdl.post('/api/ytdl/info', { 
        url: url,
        type: backendType
      });

      if (!res.data || !res.data.status) {
        throw new Error(res.data?.msg || 'Gagal memproses data');
      }

      // Backend sekarang mengembalikan { preview_url, download_url, ... }
      setData(res.data.metadata);
      setStage('done');
      toast.success('Berhasil! File siap di-stream dari server.');

    } catch (err) {
      console.error("YTDL Error:", err);
      setStage('error');
      
      const errMsg = err.response?.data?.msg || err.message || 'Server timeout atau sibuk.';
      toast.error(errMsg);
      
    } finally {
      setLoading(false);
    }
  };

  // Variabel Animasi
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI YTDL - Local Buffer</title>
      </Helmet>

      {/* HEADER NAVIGATION */}
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
          <div className="flex items-center gap-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-gray-600">SERVER BUFFER SYSTEM</span>
          </div>
        </div>
      </div>

      {/* INPUT SECTION */}
      <NeoCard className="bg-[#A3E635] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden z-10">
        {/* Hiasan Background */}
        <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none rotate-12">
          <Server size={140} />
        </div>

        <h2 className="text-xl font-black mb-4 flex items-center gap-2 relative z-10">
           <Video size={24} className="text-black" /> DOWNLOADER
        </h2>

        <div className="space-y-4 relative z-10">
          {/* Input Field */}
          <div className="relative group">
            <NeoInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Tempel Link YouTube disini..."
              disabled={loading}
              className="pr-12 text-sm font-medium border-2 focus:ring-0 focus:border-black transition-all"
            />
            <button 
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black p-1.5 rounded-md hover:bg-black/5 transition-all"
              title="Paste from Clipboard"
            >
              <Clipboard size={18} />
            </button>
          </div>

          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-3">
            <NeoButton
              onClick={() => setType('mp3')}
              variant={type === 'mp3' ? 'dark' : 'white'}
              className={`h-12 border-2 relative overflow-hidden ${type === 'mp3' ? 'border-white ring-2 ring-black/20' : 'border-black'}`}
            >
              <Music size={18} className={`relative z-10 ${type === 'mp3' ? 'animate-bounce' : ''}`} /> 
              <span className="ml-2 relative z-10 font-black">AUDIO (MP3)</span>
            </NeoButton>

            <NeoButton
              onClick={() => setType('mp4')}
              variant={type === 'mp4' ? 'dark' : 'white'}
              className={`h-12 border-2 relative overflow-hidden ${type === 'mp4' ? 'border-white ring-2 ring-black/20' : 'border-black'}`}
            >
              <Video size={18} className={`relative z-10 ${type === 'mp4' ? 'animate-bounce' : ''}`} />
              <span className="ml-2 relative z-10 font-black">VIDEO (MP4)</span>
            </NeoButton>
          </div>

          {/* Process Button */}
          <NeoButton
            onClick={handleProcess}
            disabled={loading}
            className="w-full h-14 text-base font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#FF4D4D] text-white hover:bg-[#ff3333] disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader className="animate-spin" size={20} />
                <span>BUFFERING KE SERVER...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search size={20} />
                <span>PROSES SEKARANG</span>
              </div>
            )}
          </NeoButton>

          {/* Status Indicator */}
          <AnimatePresence mode='wait'>
            {stage === 'processing' && (
              <motion.div
                key="proc"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-black/10 p-3 rounded-lg border-2 border-black border-dashed flex items-center justify-center gap-3 text-xs font-bold mt-2">
                  <Cpu className="animate-spin-slow text-black" size={16} />
                  <span>Dual Engine sedang mendownload file ke buffer...</span>
                </div>
              </motion.div>
            )}

            {stage === 'error' && (
              <motion.div
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#FF6B6B] text-white p-3 rounded-lg border-2 border-black flex items-center gap-3 font-bold text-xs shadow-sm mt-2"
              >
                <AlertTriangle size={18} />
                <span>Terjadi kesalahan saat memproses data.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </NeoCard>

      {/* RESULT SECTION */}
      <AnimatePresence>
        {data && stage === 'done' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-8 pb-10"
          >
            <NeoCard className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Thumbnail Header */}
              <div className="relative border-b-3 border-black pb-4 mb-4">
                 <img
                  src={data.thumbnail}
                  alt="Thumbnail"
                  className="w-full rounded-lg border-2 border-black shadow-sm object-cover aspect-video bg-gray-200"
                />
                <div className="absolute top-3 right-3 bg-[#A3E635] text-black text-[10px] font-black px-2 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                   {type.toUpperCase()}
                </div>
              </div>

              {/* Info & Metadata */}
              <div className="space-y-4">
                <h3 className="text-lg font-black leading-tight line-clamp-2 uppercase">
                  {data.title}
                </h3>

                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  {data.duration && (
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-black">
                      <Clock size={12} /> {data.duration}
                    </span>
                  )}
                  {data.engine && (
                    <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded border border-black text-blue-800">
                      <Cpu size={12} /> {data.engine}
                    </span>
                  )}
                  {data.author && (
                     <span className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded border border-black">
                      <CheckCircle size={12} /> {data.author}
                    </span>
                  )}
                </div>

                {/* MEDIA PLAYER (BUFFERED) */}
                <div className="bg-black p-1.5 rounded-lg border-2 border-black shadow-sm">
                  {type === 'mp3' ? (
                     <audio controls className="w-full h-10 block rounded" src={data.preview_url}>
                        Browser Anda tidak mendukung elemen audio.
                     </audio>
                  ) : (
                     <video controls className="w-full rounded bg-[#1a1a1a] aspect-video" src={data.preview_url}>
                        Browser Anda tidak mendukung elemen video.
                     </video>
                  )}
                </div>

                {/* DOWNLOAD BUTTON */}
                <a
                  href={data.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={data.filename || 'download'} // Hint filename ke browser
                  className="block group"
                >
                  <NeoButton 
                    variant="primary" 
                    className="w-full h-12 text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#3B82F6] text-white"
                  >
                    <Download size={18} className="mr-2 group-hover:animate-bounce" />
                    SIMPAN KE PERANGKAT
                  </NeoButton>
                </a>
                
                <div className="text-[10px] text-center text-gray-400 font-medium flex items-center justify-center gap-1">
                   <Server size={10} />
                   <span>File disimpan sementara di buffer server (3 Jam)</span>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Ytdl;
