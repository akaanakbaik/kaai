import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
    Play, Music, Image as ImageIcon, Loader2, Link as LinkIcon, 
    AlertTriangle, Download, X, Copy, CheckCircle, Smartphone 
} from 'lucide-react';
import Layout from '../components/Layout';
import { NeoCard, NeoButton } from '../components/NeoUI'; // Pastikan path ini benar
import { motion, AnimatePresence } from 'framer-motion';

const AllInDL = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0); // Untuk visual loading
    const [statusText, setStatusText] = useState('Idle');
    const [data, setData] = useState(null);

    // Ambil Base URL dari axios defaults (sesuai settingan main.jsx)
    const BASE_URL = axios.defaults.baseURL;

    // Simulasi Progress Bar biar user gak bosan
    useEffect(() => {
        let interval;
        if (loading) {
            setProgress(10);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return 90; // Mentok di 90% sampai selesai beneran
                    return prev + Math.random() * 10;
                });
            }, 800);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleDownload = async (e) => {
        e.preventDefault();
        if (!url) return toast.error('Link-nya mana? Tempel dulu dong!');

        setLoading(true);
        setData(null);
        setStatusText('Menghubungi Server...');
        
        try {
            // Update status text bertahap
            setTimeout(() => setStatusText('Sedang Mengintip URL...'), 1000);
            setTimeout(() => setStatusText('Mendownload ke Server...'), 3000);

            const res = await axios.post('/api/allindl', { url });
            
            if (res.data.status) {
                setProgress(100);
                setStatusText('Selesai!');
                setData(res.data);
                toast.success(`Berhasil! Dapat ${res.data.provider}`, { 
                    icon: '🎉',
                    style: { borderRadius: '0px', border: '2px solid black', background: '#A3E635', color: 'black' }
                });
            } else {
                throw new Error(res.data.msg);
            }
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.msg || error.message || 'Server sibuk / Link private';
            toast.error(errMsg, {
                icon: '💀',
                style: { borderRadius: '0px', border: '2px solid black', background: '#FF90E8', color: 'black' }
            });
            setStatusText('Gagal');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setUrl('');
        setData(null);
        setStatusText('Idle');
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
            toast.success('Link ditempel!');
        } catch (err) {
            toast.error('Gagal paste otomatis');
        }
    };

    return (
        <Layout>
            {/* CONTAINER LEBIH KECIL BIAR ENAK DI HP */}
            <div className="max-w-lg mx-auto pb-20 px-2 space-y-6">
                
                {/* 1. HEADER COMPACT */}
                <div className="text-center space-y-1">
                    <h1 className="text-4xl font-black italic tracking-tighter leading-none transform -rotate-2">
                        ALL-IN-DL
                    </h1>
                    <div className="flex justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <span className="bg-black text-white px-2 py-0.5">TikTok</span>
                        <span className="bg-black text-white px-2 py-0.5">IG</span>
                        <span className="bg-black text-white px-2 py-0.5">FB</span>
                        <span className="bg-black text-white px-2 py-0.5">X</span>
                    </div>
                </div>

                {/* 2. INPUT CARD */}
                <NeoCard className="bg-[#FFDC58] p-4 relative overflow-hidden">
                    {/* Progress Bar Line */}
                    {loading && (
                        <div className="absolute top-0 left-0 h-1.5 bg-black transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    )}

                    <form onSubmit={handleDownload} className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-xs flex items-center gap-1">
                                <LinkIcon size={14} /> URL TARGET
                            </label>
                            {url && !loading && (
                                <button type="button" onClick={handleClear} className="text-[10px] font-bold underline text-red-600">RESET</button>
                            )}
                        </div>

                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Tempel link di sini..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                                className="w-full p-3 pr-20 text-sm font-bold border-2 border-black focus:outline-none focus:ring-2 focus:ring-black rounded-none shadow-[2px_2px_0px_0px_black] placeholder:text-gray-500 bg-white"
                            />
                            {!url && !loading && (
                                <button 
                                    type="button" 
                                    onClick={handlePaste}
                                    className="absolute right-2 top-2 bottom-2 px-2 bg-gray-200 hover:bg-gray-300 text-[10px] font-bold border border-black rounded"
                                >
                                    PASTE
                                </button>
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 font-black text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-2 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={16} /> {statusText}</>
                            ) : (
                                <><Download size={16} /> DOWNLOAD SEKARANG</>
                            )}
                        </button>
                    </form>
                </NeoCard>

                {/* 3. RESULT SECTION */}
                <AnimatePresence>
                    {data && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <NeoCard className="bg-white p-0 overflow-hidden">
                                {/* Header Result */}
                                <div className="bg-black text-white px-4 py-2 flex justify-between items-center border-b-2 border-black">
                                    <span className="font-bold text-xs uppercase flex items-center gap-1">
                                        <CheckCircle size={12} className="text-[#A3E635]"/> {data.provider}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-80">@{data.author || 'Anon'}</span>
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* Caption Kecil */}
                                    {data.caption && (
                                        <div className="bg-gray-50 border border-black p-2 text-[10px] font-mono line-clamp-2">
                                            {data.caption}
                                        </div>
                                    )}

                                    {/* 1. VIDEO */}
                                    {data.media.video && (
                                        <div className="space-y-2">
                                            <div className="border-2 border-black bg-black aspect-video flex items-center justify-center overflow-hidden">
                                                <video 
                                                    src={`${BASE_URL}${data.media.video}`} 
                                                    controls 
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <a 
                                                href={`${BASE_URL}${data.media.video}`} 
                                                download 
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block w-full text-center bg-[#A3E635] border-2 border-black py-2 font-bold text-xs hover:bg-[#86efac] shadow-[2px_2px_0px_0px_black] active:translate-y-0.5 active:shadow-none"
                                            >
                                                DOWNLOAD VIDEO (MP4)
                                            </a>
                                        </div>
                                    )}

                                    {/* 2. AUDIO */}
                                    {data.media.audio && (
                                        <div className="space-y-2 pt-2 border-t border-dashed border-gray-300">
                                            <div className="flex items-center gap-1 font-bold text-xs">
                                                <Music size={14} /> AUDIO ONLY
                                            </div>
                                            <audio 
                                                src={`${BASE_URL}${data.media.audio}`} 
                                                controls 
                                                className="w-full h-8"
                                            />
                                            <a 
                                                href={`${BASE_URL}${data.media.audio}`} 
                                                download 
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block w-full text-center bg-[#60A5FA] text-white border-2 border-black py-2 font-bold text-xs hover:bg-[#3b82f6] shadow-[2px_2px_0px_0px_black] active:translate-y-0.5 active:shadow-none"
                                            >
                                                DOWNLOAD AUDIO (MP3)
                                            </a>
                                        </div>
                                    )}

                                    {/* 3. IMAGES */}
                                    {data.media.images && data.media.images.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-dashed border-gray-300">
                                            <div className="flex items-center gap-1 font-bold text-xs">
                                                <ImageIcon size={14} /> GALLERY ({data.media.images.length})
                                            </div>
                                            
                                            <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-hide">
                                                {data.media.images.map((img, idx) => (
                                                    <div key={idx} className="flex-none w-40 snap-center space-y-1">
                                                        <div className="border-2 border-black h-40 bg-gray-100">
                                                            <img 
                                                                src={`${BASE_URL}${img}`} 
                                                                alt={`Slide ${idx}`} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <a 
                                                            href={`${BASE_URL}${img}`} 
                                                            download
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="block text-center bg-white border border-black py-1 font-bold text-[10px] hover:bg-gray-100"
                                                        >
                                                            SAVE #{idx + 1}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </NeoCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FOOTNOTE */}
                <div className="text-center opacity-50 space-y-1">
                    <p className="text-[10px] font-bold flex items-center justify-center gap-1">
                        <AlertTriangle size={10} /> Support: TikTok, IG, FB, Twitter/X, Pinterest
                    </p>
                    <p className="text-[10px]">Jika error 500/Timeout, coba submit ulang.</p>
                </div>
            </div>
        </Layout>
    );
};

export default AllInDL;
