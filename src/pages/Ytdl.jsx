import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Search, Download, Music, Video, Youtube, ArrowLeft, Loader, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Ytdl = () => {
    const [url, setUrl] = useState('');
    const [type, setType] = useState('mp3');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // Helper Link Proxy yang Aman
    const getStreamUrl = (download = false) => {
        if (!data || !data.download_url) return '';
        const targetUrl = encodeURIComponent(data.download_url);
        const title = encodeURIComponent(data.title || 'kaai_media');
        // Arahkan ke Proxy Backend
        return `${axios.defaults.baseURL}/api/stream?url=${targetUrl}&type=${data.type}&title=${title}${download ? '&download=true' : ''}`;
    };

    const handleProcess = async () => {
        if (!url) return toast.error('Link wajib diisi!');
        if (!url.includes('youtu')) return toast.error('Bukan link YouTube!');

        setLoading(true); setData(null);

        try {
            const endpoint = type === 'mp3' ? '/api/ytdl/mp3' : '/api/ytdl/mp4';
            const res = await axios.get(endpoint, { 
                params: { url: url },
                timeout: 300000 // 5 menit timeout
            });
            
            if (res.data.status) {
                setData({ ...res.data, type: type });
                toast.success('Selesai!');
            } else {
                throw new Error(res.data.msg || "Gagal");
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || err.message || "Server Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <Helmet><title>YouTube DL - KAAI</title></Helmet>
            
            <div className="flex items-center justify-between mb-6">
                <Link to="/"><NeoButton variant="white" className="h-8 text-[10px]"><ArrowLeft size={12}/> KEMBALI</NeoButton></Link>
                <div className="text-right">
                    <h1 className="text-2xl font-black italic tracking-tighter leading-none flex items-center justify-end gap-1">
                        YT<span className="text-red-600">DL</span>
                    </h1>
                </div>
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
                            {[{id:'mp3',l:'MP3 (AUDIO)',i:<Music size={16}/>},{id:'mp4',l:'MP4 (VIDEO)',i:<Video size={16}/>}].map(t=>(
                                <button 
                                    key={t.id} onClick={()=>setType(t.id)} 
                                    className={`flex items-center justify-center gap-2 p-3 rounded-md border-2 border-black transition-all ${type===t.id?'bg-black text-white':'bg-white hover:bg-gray-50'}`}
                                >
                                    {t.i}<span className="text-xs font-bold">{t.l}</span>
                                </button>
                            ))}
                        </div>

                        <NeoButton onClick={handleProcess} disabled={loading} className="w-full h-12 text-sm" variant="dark">
                            {loading ? <Loader className="animate-spin"/> : <><Search size={16}/> PROSES</>}
                        </NeoButton>
                    </div>
                </NeoCard>

                <AnimatePresence>
                    {data && (
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
                            <NeoCard title="HASIL" className="bg-white">
                                <div className="flex gap-4 mb-4">
                                    <img src={data.thumbnail} className="w-24 h-24 object-cover rounded border-2 border-black bg-gray-200" alt="Thumb"/>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">{data.title}</h3>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">{data.channel}</p>
                                        <div className="flex gap-2 mt-2 text-[10px] font-bold">
                                            <span className="bg-gray-100 px-2 py-1 rounded border border-black">{data.quality}</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded border border-black">{data.duration}s</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PLAYER MENGGUNAKAN PROXY */}
                                <div className="mb-4 w-full bg-black rounded-lg overflow-hidden border-2 border-black">
                                    {data.type === 'mp3' ? (
                                        <audio controls className="w-full h-10 mt-1" src={getStreamUrl(false)}>
                                            Audio Error
                                        </audio>
                                    ) : (
                                        <video controls className="w-full aspect-video bg-black" src={getStreamUrl(false)}>
                                            Video Error
                                        </video>
                                    )}
                                </div>

                                {/* TOMBOL DOWNLOAD VIA PROXY */}
                                <a href={getStreamUrl(true)} target="_blank" rel="noreferrer">
                                    <NeoButton variant="primary" className="w-full h-12 text-sm animate-pulse">
                                        <Download size={18} /> DOWNLOAD FILE {data.type.toUpperCase()}
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
