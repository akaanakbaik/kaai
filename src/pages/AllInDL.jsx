import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Play, Music, Image as ImageIcon, Loader2, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';

const AllInDL = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // ✅ AMBIL URL DARI SETTINGAN MAIN.JSX
    // Ini otomatis membaca "https://kaai-api.akadev.me"
    const BASE_URL = axios.defaults.baseURL;

    const handleDownload = async (e) => {
        e.preventDefault();
        if (!url) return toast.error('URL nya mana bos?');

        setLoading(true);
        setData(null);
        
        try {
            toast.loading('Sedang mengintip server...', { id: 'dl-proc' });
            
            // ✅ REQUEST API (Otomatis ikut domain main.jsx)
            const res = await axios.post('/api/allindl', { url });
            
            if (res.data.status) {
                setData(res.data);
                toast.success('Berhasil diculik!', { id: 'dl-proc' });
            } else {
                toast.error(res.data.msg || 'Gagal mengambil data', { id: 'dl-proc' });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.msg || 'Server error / URL tidak valid', { id: 'dl-proc' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* HEADLINE SECTION */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter transform -rotate-2">
                        ALL-IN-DL
                    </h1>
                    <p className="text-lg font-bold bg-black text-white inline-block px-4 py-1 transform rotate-1">
                        TikTok • Instagram • Facebook • Twitter/X
                    </p>
                </div>

                {/* INPUT CARD */}
                <div className="bg-[#FFDC58] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_black]">
                    <form onSubmit={handleDownload} className="flex flex-col gap-4">
                        <label className="font-bold text-xl flex items-center gap-2">
                            <LinkIcon className="w-6 h-6" /> Tempel Link Di Sini:
                        </label>
                        <div className="flex flex-col md:flex-row gap-0">
                            <input 
                                type="text" 
                                placeholder="https://..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full p-4 text-lg font-bold border-4 border-black border-b-0 md:border-b-4 md:border-r-0 focus:outline-none focus:bg-white bg-gray-50 placeholder-gray-400"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-8 py-4 font-black text-xl hover:bg-[#F472B6] border-4 border-black transition-all active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'GAS!'}
                            </button>
                        </div>
                        <p className="text-xs font-bold opacity-60 mt-2 text-center md:text-left">
                            *Pastikan link publik dan bukan akun private.
                        </p>
                    </form>
                </div>

                {/* RESULT SECTION */}
                {data && (
                    <div className="animate-in slide-in-from-bottom-10 fade-in duration-500">
                        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#F472B6] overflow-hidden">
                            
                            {/* Header Result */}
                            <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                                <span className="font-black uppercase text-xl tracking-widest">{data.provider}</span>
                                <span className="text-xs font-mono bg-[#A3E635] text-black px-2 py-1 font-bold rounded">SUCCESS</span>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Caption / Info */}
                                {data.caption && (
                                    <div className="bg-gray-100 border-2 border-black p-4 font-mono text-sm mb-4">
                                        <p className="line-clamp-3">{data.caption}</p>
                                    </div>
                                )}

                                {/* 1. VIDEO PLAYER */}
                                {data.media.video && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 font-black text-lg">
                                            <Play className="fill-black" /> VIDEO
                                        </div>
                                        <div className="border-4 border-black bg-black">
                                            {/* Gabungkan BASE_URL + path video dari backend */}
                                            <video 
                                                src={`${BASE_URL}${data.media.video}`} 
                                                controls 
                                                className="w-full max-h-[500px]"
                                            />
                                        </div>
                                        <a 
                                            href={`${BASE_URL}${data.media.video}`} 
                                            download 
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-full text-center bg-[#A3E635] border-4 border-black py-3 font-black hover:bg-[#86efac] shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none transition-all"
                                        >
                                            DOWNLOAD VIDEO (MP4)
                                        </a>
                                    </div>
                                )}

                                {/* 2. AUDIO PLAYER */}
                                {data.media.audio && (
                                    <div className="space-y-3 pt-4 border-t-2 border-dashed border-gray-300">
                                        <div className="flex items-center gap-2 font-black text-lg">
                                            <Music className="fill-black" /> AUDIO
                                        </div>
                                        <audio 
                                            src={`${BASE_URL}${data.media.audio}`} 
                                            controls 
                                            className="w-full border-2 border-black rounded-none"
                                        />
                                        <a 
                                            href={`${BASE_URL}${data.media.audio}`} 
                                            download 
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-full text-center bg-[#60A5FA] border-4 border-black py-3 font-black text-white hover:bg-[#3b82f6] shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none transition-all"
                                        >
                                            DOWNLOAD AUDIO (MP3)
                                        </a>
                                    </div>
                                )}

                                {/* 3. IMAGES (CAROUSEL) */}
                                {data.media.images && data.media.images.length > 0 && (
                                    <div className="space-y-3 pt-4 border-t-2 border-dashed border-gray-300">
                                        <div className="flex items-center gap-2 font-black text-lg">
                                            <ImageIcon className="fill-black" /> IMAGES ({data.media.images.length})
                                        </div>
                                        
                                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
                                            {data.media.images.map((img, idx) => (
                                                <div key={idx} className="flex-none w-64 snap-center space-y-2">
                                                    <div className="border-4 border-black h-64 bg-gray-200">
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
                                                        className="block text-center bg-white border-2 border-black py-2 font-bold text-sm hover:bg-gray-100"
                                                    >
                                                        Download #{idx + 1}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white border-2 border-black p-4 flex items-start gap-3 opacity-80">
                    <AlertTriangle className="flex-shrink-0" />
                    <p className="text-sm font-bold">
                        Tips: Jika download gagal, coba klik tombol titik tiga di player video dan pilih "Download" atau klik kanan "Save As".
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default AllInDL;
