import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Search, Download, Music, Video, ArrowLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Ytdl = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleProcess = async () => {
    if (!url) return toast.error('Link wajib diisi!');
    if (!url.includes('youtu')) return toast.error('Bukan link YouTube!');

    setLoading(true);
    setData(null);

    try {
      const res = await window.apiYtdl.post(
        '/api/ytdl',
        { url },
        { timeout: 300000 }
      );

      if (!res.data?.status) {
        throw new Error(res.data?.msg || 'Gagal memproses video');
      }

      setData({
        ...res.data.metadata,
        engine: res.data.engine,
        type
      });

      toast.success('Selesai!');
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || 'Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>YouTube DL - KAAI</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <NeoButton variant="white" className="h-8 text-[10px]">
            <ArrowLeft size={12} /> KEMBALI
          </NeoButton>
        </Link>

        <h1 className="text-2xl font-black italic tracking-tighter">
          YT<span className="text-red-600">DL</span>
        </h1>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <NeoCard className="bg-[#FFDC58]" title="CONVERTER">
          <div className="space-y-3">
            <NeoInput
              placeholder="https://youtu.be/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mp3', label: 'MP3 (AUDIO)', icon: <Music size={16} /> },
                { id: 'mp4', label: 'MP4 (VIDEO)', icon: <Video size={16} /> }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border-2 border-black transition-all
                    ${type === t.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}
                  `}
                >
                  {t.icon}
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              ))}
            </div>

            <NeoButton
              onClick={handleProcess}
              disabled={loading}
              className="w-full h-12 text-sm"
              variant="dark"
            >
              {loading ? <Loader className="animate-spin" /> : <><Search size={16} /> PROSES</>}
            </NeoButton>
          </div>
        </NeoCard>

        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <NeoCard title="HASIL" className="bg-white">
                <div className="flex gap-4 mb-4">
                  <img
                    src={data.thumbnail}
                    className="w-24 h-24 object-cover rounded border-2 border-black bg-gray-200"
                    alt="Thumbnail"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">
                      {data.title}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">
                      {data.author}
                    </p>
                    <p className="text-[10px] mt-1">
                      Engine: <b>{data.engine}</b>
                    </p>
                  </div>
                </div>

                {/* PREVIEW LANGSUNG */}
                <div className="mb-4 w-full bg-black rounded-lg overflow-hidden border-2 border-black">
                  {type === 'mp3' ? (
                    <audio controls className="w-full h-10 mt-1">
                      <source src={data.url} />
                    </audio>
                  ) : (
                    <video controls className="w-full aspect-video bg-black">
                      <source src={data.url} />
                    </video>
                  )}
                </div>

                {/* DOWNLOAD LANGSUNG */}
                <a href={data.url} target="_blank" rel="noreferrer">
                  <NeoButton variant="primary" className="w-full h-12 text-sm">
                    <Download size={18} /> DOWNLOAD FILE {type.toUpperCase()}
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
