import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Search, Download, Music, Video, ArrowLeft, Loader, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

/* ===============================
   Helper: Retry Request (Frontend)
================================= */
const requestWithRetry = async (fn, retries = 2, delay = 1200) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(res => setTimeout(res, delay));
    return requestWithRetry(fn, retries - 1, delay * 1.5);
  }
};

const Ytdl = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  /* ===============================
     Main Handler
  ================================= */
  const handleProcess = async () => {
    if (!url) return toast.error('Link wajib diisi!');
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
      return toast.error('Harus link YouTube yang valid!');
    }

    setLoading(true);
    setData(null);

    const toastId = toast.loading('Mengambil metadata...');

    try {
      const res = await requestWithRetry(
        () => axios.post('/api/ytdl/info', { url }),
        2
      );

      if (!res.data || !res.data.status) {
        throw new Error(res.data?.msg || 'Gagal mengambil data');
      }

      const meta = res.data.metadata || {};

      setData({
        id: meta.id || '-',
        title: meta.title || 'Tanpa Judul',
        thumbnail: meta.thumbnail || '',
        duration: meta.duration || '-',
        views: meta.views || null,
        author: meta.author || '-',
        url: meta.url,
        engine: res.data.engine
      });

      toast.success('Siap diputar & diunduh!', { id: toastId });

    } catch (err) {
      console.error(err);

      const msg =
        err.response?.data?.msg ||
        err.response?.data?.error_id ||
        err.message ||
        'Terjadi kesalahan pada server';

      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI YTDL - Fast YouTube Downloader</title>
      </Helmet>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/">
          <NeoButton variant="white" className="h-8 px-3 text-[10px] font-black tracking-widest">
            <ArrowLeft size={12} className="mr-1" /> KEMBALI
          </NeoButton>
        </Link>
        <h1 className="text-3xl font-black italic tracking-tighter">
          YT<span className="text-[#FF4A4A]">DL</span>
          <span className="text-xs ml-1 not-italic font-medium bg-black text-white px-1 rounded">
            v2.5
          </span>
        </h1>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* INPUT CARD */}
        <NeoCard
          className="bg-[#A3E635] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          title="LINK DOWNLOADER"
        >
          <div className="space-y-4">
            <NeoInput
              placeholder="Tempel link YouTube di sini..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-sm font-medium"
            />

            {/* FORMAT SELECTOR */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType('mp3')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-black transition-all font-black text-sm
                  ${type === 'mp3'
                    ? 'bg-black text-white'
                    : 'bg-white hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}
                `}
              >
                <Music size={16} /> AUDIO (MP3)
              </button>
              <button
                onClick={() => setType('mp4')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-black transition-all font-black text-sm
                  ${type === 'mp4'
                    ? 'bg-black text-white'
                    : 'bg-white hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}
                `}
              >
                <Video size={16} /> VIDEO (MP4)
              </button>
            </div>

            <NeoButton
              onClick={handleProcess}
              disabled={loading}
              className="w-full h-12 text-sm font-black tracking-wide"
              variant="dark"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin" size={16} /> MEMPROSES...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search size={16} /> PROSES SEKARANG
                </div>
              )}
            </NeoButton>
          </div>
        </NeoCard>

        {/* RESULT CARD */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <NeoCard
                title="HASIL PENCARIAN"
                className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {/* INFO HEADER */}
                <div className="flex gap-4 mb-4 items-start">
                  <div className="relative shrink-0">
                    <img
                      src={data.thumbnail}
                      className="w-28 aspect-video object-cover rounded border-2 border-black"
                      alt="Thumbnail"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#FF4A4A] text-white text-[10px] font-bold px-1 border border-black">
                      {data.duration}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-black text-sm leading-tight line-clamp-2">
                      {data.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-600">
                      <span className="flex items-center gap-1 bg-gray-100 px-1 rounded border border-black">
                        <Clock size={10} /> {data.duration}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-100 px-1 rounded border border-black">
                        {data.author}
                      </span>
                      {data.views && (
                        <span className="flex items-center gap-1 bg-gray-100 px-1 rounded border border-black">
                          <Eye size={10} /> {Number(data.views).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="pt-1">
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-mono">
                        Engine: {data.engine}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PLAYER */}
                <div className="mb-4 w-full bg-black rounded border-2 border-black overflow-hidden">
                  {data.url ? (
                    type === 'mp3' ? (
                      <div className="h-14 flex items-center justify-center bg-[#1a1a1a]">
                        <audio controls className="w-[95%] h-8">
                          <source src={data.url} type="audio/mp4" />
                        </audio>
                      </div>
                    ) : (
                      <video
                        controls
                        className="w-full aspect-video bg-black"
                        poster={data.thumbnail}
                      >
                        <source src={data.url} type="video/mp4" />
                      </video>
                    )
                  ) : (
                    <div className="text-white text-xs p-4 text-center">
                      Media belum siap atau gagal diproses
                    </div>
                  )}
                </div>

                {/* DOWNLOAD */}
                <a
                  href={data.url}
                  target="_blank"
                  rel="noreferrer"
                  download={`${data.title}.${type}`}
                >
                  <NeoButton
                    variant="primary"
                    className="w-full h-12 text-sm font-black flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> DOWNLOAD {type.toUpperCase()}
                  </NeoButton>
                </a>
              </NeoCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Ytdl;
