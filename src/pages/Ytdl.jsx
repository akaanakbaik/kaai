import React, { useState } from 'react';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import {
  Search,
  Download,
  Music,
  Video,
  ArrowLeft,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Ytdl = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleProcess = async () => {
    if (!url) {
      toast.error('Link YouTube wajib diisi');
      return;
    }

    setLoading(true);
    setData(null);

    toast.loading('Memproses video…', { id: 'ytdl' });

    try {
      const endpoint =
        type === 'mp3'
          ? '/api/ytdl/mp3'
          : '/api/ytdl/mp4';

      const res = await axios.post(endpoint, { url });

      if (!res.data?.status) {
        throw new Error(res.data?.msg || 'Gagal memproses video');
      }

      setData(res.data.metadata);

      toast.success('Berhasil diproses', { id: 'ytdl' });

    } catch (err) {
      toast.error(
        err.response?.data?.msg ||
        err.message ||
        'Terjadi kesalahan pada server',
        { id: 'ytdl' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI YTDL — Fast YouTube Downloader</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <NeoButton variant="white" className="flex items-center gap-1">
            <ArrowLeft size={14} />
            Kembali
          </NeoButton>
        </Link>

        <h1 className="text-xl font-black tracking-tight">
          YT<span className="text-red-500">DL</span>
        </h1>
      </div>

      <NeoCard title="YouTube Downloader">
        <div className="space-y-4">
          <NeoInput
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-2">
            <NeoButton
              onClick={() => setType('mp3')}
              variant={type === 'mp3' ? 'dark' : 'white'}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <Music size={16} />
              MP3
            </NeoButton>

            <NeoButton
              onClick={() => setType('mp4')}
              variant={type === 'mp4' ? 'dark' : 'white'}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <Video size={16} />
              MP4
            </NeoButton>
          </div>

          <NeoButton
            onClick={handleProcess}
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={16} />
                Memproses…
              </>
            ) : (
              <>
                <Search size={16} />
                Proses Sekarang
              </>
            )}
          </NeoButton>
        </div>
      </NeoCard>

      {data && (
        <NeoCard title="Hasil">
          <div className="space-y-3">
            <img
              src={data.thumbnail}
              alt="Thumbnail"
              className="w-full rounded border"
            />

            <h2 className="font-bold text-sm">
              {data.title}
            </h2>

            {type === 'mp3' ? (
              <audio controls className="w-full mt-2">
                <source src={data.url} />
              </audio>
            ) : (
              <video controls className="w-full mt-2 rounded">
                <source src={data.url} />
              </video>
            )}

            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <NeoButton
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download {type.toUpperCase()}
              </NeoButton>
            </a>
          </div>
        </NeoCard>
      )}
    </PageWrapper>
  );
};

export default Ytdl;
