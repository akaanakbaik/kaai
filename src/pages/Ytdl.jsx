import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Search, Download, Music, Video, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

const Ytdl = () => {
    const [url, setUrl] = useState('');
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const selectStyle = {
        control: (base, state) => ({
            ...base,
            border: '2px solid black',
            borderRadius: '0px',
            boxShadow: state.isFocused ? '4px 4px 0px 0px black' : '2px 2px 0px 0px black',
            fontWeight: 'bold',
            padding: '6px',
            cursor: 'pointer',
            borderColor: 'black',
            '&:hover': { borderColor: 'black' }
        }),
        menu: (base) => ({
            ...base,
            border: '2px solid black',
            borderRadius: '0px',
            marginTop: '8px',
            boxShadow: '6px 6px 0px 0px black',
            zIndex: 50
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#A3E635' : state.isFocused ? '#f0f0f0' : 'white',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '10px'
        })
    };

    const options = [
        { value: 'mp3', label: <div className="flex items-center gap-2"><Music size={18}/> Audio Only (MP3)</div> },
        { value: 'mp4', label: <div className="flex items-center gap-2"><Video size={18}/> Video HD (MP4)</div> }
    ];

    const handleProcess = async () => {
        // 1. Validasi Input Kosong
        if (!url) return toast.error('⛔ URL Youtube wajib diisi!');
        if (!type) return toast.error('⛔ Pilih format (MP3/MP4) dulu!');
        
        // 2. Validasi URL YouTube (DIPERBAIKI)
        // Menerima: youtube.com, www.youtube.com, m.youtube.com, youtu.be
        const regex = /^(https?:\/\/)?((www\.|m\.)?youtube\.com|youtu\.be)\/.+$/;
        
        // Pengecekan ganda: Regex ATAU string include (agar lebih aman)
        const isYoutube = regex.test(url) || url.includes('youtube.com') || url.includes('youtu.be');

        if (!isYoutube) {
            return toast.error('⛔ Link tidak valid! Pastikan link dari YouTube.');
        }

        setLoading(true);
        setData(null);

        try {
            const endpoint = type.value === 'mp3' ? '/api/ytdl/mp3' : '/api/ytdl/mp4';
            // Request ke Backend
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, { url });
            
            if (res.data.status) {
                setData({ ...res.data, type: type.value });
                toast.success('✅ Data berhasil ditemukan!');
            } else {
                throw new Error(res.data.msg || "Gagal mengambil data");
            }
        } catch (err) {
            console.error(err);
            // Menampilkan pesan error dari backend jika ada
            const msg = err.response?.data?.msg || err.message || "Terjadi kesalahan koneksi";
            toast.error('❌ Gagal: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    const triggerDownload = () => {
        if (data?.download_url) {
            window.open(data.download_url, '_blank');
            toast.success('🚀 Download dimulai...');
        } else {
            toast.error('Link download belum tersedia');
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-block p-4 rounded-full border-2 border-black bg-red-500 text-white shadow-[4px_4px_0px_0px_black] mb-2">
                        <Youtube size={48} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                        YOUTUBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">DOWNLOADER</span>
                    </h1>
                    <p className="font-bold text-gray-600">Paste link, pilih format, langsung gas download.</p>
                </div>

                {/* INPUT CARD */}
                <NeoCard className="bg-[#FFDC58]" title="1. CONFIGURATION">
                    <div className="space-y-6">
                        <NeoInput 
                            label="URL Video"
                            placeholder="Contoh: https://youtube.com/watch?v=..." 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        
                        <div className="w-full">
                            <label className="mb-2 block font-bold text-sm bg-black text-white w-fit px-3 py-1 transform rotate-1">Format Output</label>
                            <Select 
                                options={options} 
                                styles={selectStyle} 
                                placeholder="Pilih Format (Wajib)..."
                                onChange={setType}
                                value={type}
                                isSearchable={false}
                            />
                        </div>

                        <NeoButton onClick={handleProcess} disabled={loading} className="w-full text-lg" variant="dark">
                            {loading ? <span className="animate-pulse">⏳ SEDANG MENCARI DATA...</span> : <><Search size={22}/> CARI VIDEO</>}
                        </NeoButton>
                    </div>
                </NeoCard>

                {/* RESULT CARD (ANIMATED) */}
                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, rotate: -2 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 120 }}
                        >
                            <NeoCard className="bg-white border-4 border-black relative overflow-visible mt-8" title="2. DOWNLOAD READY">
                                {/* Sticker Hiasan */}
                                <div className="absolute -top-6 -right-4 bg-[#A3E635] border-2 border-black px-4 py-2 font-black rotate-12 shadow-neo z-10">
                                    BERHASIL! 🎉
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                                        <div className="border-4 border-black shadow-[6px_6px_0px_0px_black] aspect-video bg-black flex items-center justify-center overflow-hidden relative group">
                                            <img src={data.thumbnail} alt="Thumb" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="bg-red-600 text-white rounded-full p-3 border-2 border-black">
                                                    {data.type === 'mp4' ? <Video size={32}/> : <Music size={32}/>}
                                                </div>
                                            </div>
                                        </div>
                                        {data.type === 'mp4' && (
                                            <div className="text-center font-bold text-xs bg-gray-200 p-2 border-2 border-black">
                                                *Preview video tersedia setelah download
                                            </div>
                                        )}
                                        {data.type === 'mp3' && (
                                            <audio controls className="w-full border-2 border-black shadow-neo-sm">
                                                <source src={data.download_url} type="audio/mpeg"/>
                                            </audio>
                                        )}
                                    </div>

                                    <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
                                        <div className="space-y-3 font-medium bg-[#f9f9f9] p-4 border-2 border-black">
                                            <h3 className="font-black text-xl md:text-2xl leading-tight line-clamp-2">{data.title}</h3>
                                            <div className="h-1 w-full bg-black my-2"></div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <p>👤 <strong>Channel:</strong><br/>{data.channel}</p>
                                                <p>⏱️ <strong>Durasi:</strong><br/>{data.duration} detik</p>
                                                <p>👁️ <strong>Views:</strong><br/>{data.view_count}</p>
                                                <p>🛠️ <strong>Source:</strong><br/>{data.source}</p>
                                            </div>
                                        </div>

                                        <NeoButton onClick={triggerDownload} variant="secondary" className="w-full py-4 text-lg animate-pulse">
                                            <Download size={24} /> DOWNLOAD {data.type.toUpperCase()}
                                        </NeoButton>
                                    </div>
                                </div>
                            </NeoCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageWrapper>
    );
};

export default Ytdl;
