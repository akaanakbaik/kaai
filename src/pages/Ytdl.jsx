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
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const Ytdl = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('idle');
  const [data, setData] = useState(null);

  const handleProcess = async () => {
    if (!url) {
      toast.error('Link wajib diisi');
      return;
    }

    setLoading(true);
    setStage('request');
    setData(null);

    try {
      const endpoint =
        type === 'mp3'
          ? '/api/ytdl/mp3'
          : type === 'mp4'
          ? '/api/ytdl/mp4'
          : '/api/ytdl/info';

      setStage('processing');

      const res = await window.apiYtdl.post(endpoint, { url });

      if (!res.data || !res.data.status) {
        throw new Error(res.data?.msg || 'Gagal memproses video');
      }

      setData(res.data.metadata);
      setStage('done');
      toast.success('Berhasil diproses');

    } catch (err) {
      console.error(err);
      setStage('error');
      toast.error(
        err.response?.data?.msg ||
        err.message ||
        'Terjadi kesalahan pada server'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI YTDL</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <NeoButton variant="white" className="h-8 text-[10px]">
            <ArrowLeft size={12} /> KEMBALI
          </NeoButton>
        </Link>
        <h1 className="text-2xl font-black italic tracking-tight">
          YT<span className="text-red-600">DL</span>
        </h1>
      </div>

      <NeoCard
        title="YOUTUBE DOWNLOADER"
        className="bg-[#FFE066] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="space-y-4">
          <NeoInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/..."
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-2">
            <NeoButton
              onClick={() => setType('mp3')}
              variant={type === 'mp3' ? 'dark' : 'white'}
            >
              <Music size={16} /> MP3
            </NeoButton>
            <NeoButton
              onClick={() => setType('mp4')}
              variant={type === 'mp4' ? 'dark' : 'white'}
            >
              <Video size={16} /> MP4
            </NeoButton>
          </div>

          <NeoButton
            onClick={handleProcess}
            disabled={loading}
            className="w-full h-12 text-sm"
            variant="dark"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin" size={16} />
                MEMPROSES...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search size={16} />
                PROSES
              </div>
            )}
          </NeoButton>

          <AnimatePresence>
            {stage === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-bold text-gray-700 flex items-center gap-2"
              >
                <Loader className="animate-spin" size={14} />
                Engine sedang bekerja (dual-engine aktif)...
              </motion.div>
            )}

            {stage === 'done' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-green-700 flex items-center gap-2"
              >
                <CheckCircle size={14} />
                Proses selesai
              </motion.div>
            )}

            {stage === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-red-700 flex items-center gap-2"
              >
                <AlertTriangle size={14} />
                Gagal memproses video
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </NeoCard>

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <NeoCard
              title="HASIL"
              className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <img
                src={data.thumbnail}
                alt="thumbnail"
                className="w-full rounded border-2 border-black mb-3"
              />

              <h3 className="font-black text-sm mb-1">
                {data.title}
              </h3>

              {type === 'mp3' ? (
                <audio controls className="w-full mt-2">
                  <source src={data.url} />
                </audio>
              ) : (
                <video controls className="w-full mt-2">
                  <source src={data.url} />
                </video>
              )}

              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="block mt-3"
              >
                <NeoButton variant="primary" className="w-full h-11">
                  <Download size={16} />
                  DOWNLOAD
                </NeoButton>
              </a>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Ytdl;
