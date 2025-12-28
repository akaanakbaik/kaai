import React, { useState } from 'react';
import axios from 'axios';
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
    if (!url) return toast.error('Link wajib diisi');

    setLoading(true);
    setData(null);

    try {
      const endpoint =
        type === 'mp3' ? '/api/ytdl/mp3' :
        type === 'mp4' ? '/api/ytdl/mp4' :
        '/api/ytdl/info';

      const res = await axios.post(endpoint, { url });

      if (!res.data?.status) {
        throw new Error(res.data?.msg || 'Gagal');
      }

      setData(res.data.metadata);
      toast.success('Berhasil');

    } catch (e) {
      toast.error(e.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet><title>KAAI YTDL</title></Helmet>

      <Link to="/">
        <NeoButton variant="white"><ArrowLeft size={12}/> Kembali</NeoButton>
      </Link>

      <NeoCard title="YTDL">
        <NeoInput
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://youtube.com/..."
        />

        <div className="grid grid-cols-2 gap-2 mt-3">
          <NeoButton onClick={() => setType('mp3')} variant={type==='mp3'?'dark':'white'}>
            <Music size={16}/> MP3
          </NeoButton>
          <NeoButton onClick={() => setType('mp4')} variant={type==='mp4'?'dark':'white'}>
            <Video size={16}/> MP4
          </NeoButton>
        </div>

        <NeoButton onClick={handleProcess} disabled={loading} className="w-full mt-4">
          {loading ? <Loader className="animate-spin"/> : <Search size={16}/> }
          PROSES
        </NeoButton>
      </NeoCard>

      {data && (
        <NeoCard title="HASIL">
          <img src={data.thumbnail} className="w-full rounded"/>
          <p>{data.title}</p>

          <video controls className="w-full mt-2">
            <source src={data.url} />
          </video>

          <a href={data.url} target="_blank" rel="noreferrer">
            <NeoButton variant="primary" className="w-full mt-2">
              <Download size={16}/> DOWNLOAD
            </NeoButton>
          </a>
        </NeoCard>
      )}
    </PageWrapper>
  );
};

export default Ytdl;
