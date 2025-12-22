import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Search, Download, Music, Video, Youtube, ArrowLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            borderRadius: '6px',
            boxShadow: state.isFocused ? '2px 2px 0px 0px black' : '4px 4px 0px 0px black',
            fontWeight: 'bold',
            padding: '2px',
            cursor: 'pointer',
            borderColor: 'black',
            '&:hover': { borderColor: 'black' }
        }),
        menu: (base) => ({
            ...base,
            border: '2px solid black',
            borderRadius: '6px',
            marginTop: '8px',
            boxShadow: '4px 4px 0px 0px black',
            zIndex: 50
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#A3E635' : state.isFocused ? '#f3f4f6' : 'white',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '10px'
        })
    };

    const options = [
        { value: 'mp3', label: <div className="flex items-center gap-2"><Music size={16}/> Audio (MP3)</div> },
        { value: 'mp4', label: <div className="flex items-center gap-2"><Video size={16}/> Video (MP4)</div> }
    ];

    const handleProcess = async () => {
        if (!url) return toast.error('URL wajib diisi!');
        if (!type) return toast.error('Pilih format dulu!');
        
        const regex = /^(https?:\/\/)?((www\.|m\.)?youtube\.com|youtu\.be)\/.+$/;
        if (!regex.test(url) && !url.includes('youtube')) return toast.error('Link YouTube tidak valid!');

        setLoading(true);
        setData(null);

        try {
            const endpoint = type.value === 'mp3' ? '/api/ytdl/mp3' : '/api/ytdl/mp4';
            
            // --- PERBAIKAN DI SINI (UBAH POST JADI GET) ---
            // Menggunakan params untuk mengirim URL agar aman dari error 405
            const res = await axios.get(endpoint, { 
                params: { url: url } 
            });
            
            if (res.data.status) {
                setData({ ...res.data, type: type.value });
                toast.success('Video ditemukan!');
            } else {
                throw new Error(res.data.msg);
            }
        } catch (err) {
            console.error(err);
            toast.error('Gagal: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const triggerDownload = () => {
        if (data?.download_url) {
            window.open(data.download_url, '_blank');
            toast.success('Download dimulai...');
        }
    };

    return (
        <PageWrapper>
            <div className="mb-6">
                <Link to="/"><NeoButton variant="white" className="text-xs"><ArrowLeft size={14}/> KEMBALI</NeoButton></Link>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter flex items-center justify-center gap-2">
                        <Youtube size={32} className="text-red-600"/> YT<span className="text-red-500">DOWNLOADER</span>
                    </h1>
                    <p className="text-sm font-medium text-gray-500">Download video/musik YouTube tanpa batas.</p>
                </div>

                <NeoCard className="bg-[#FFDC58]" title="INPUT LINK">
                    <div className="space-y-4">
                        <NeoInput 
                            placeholder="https://youtube.com/watch?v=..." 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        
                        <div className="w-full">
                            <Select 
                                options={options} 
                                styles={selectStyle} 
                                placeholder="Pilih Format..."
                                onChange={setType}
                                value={type}
                                isSearchable={false}
                            />
                        </div>

                        <NeoButton onClick={handleProcess} disabled={loading} className="w-full h-12 text-lg" variant="dark">
                            {loading ? <span className="flex items-center gap-2 animate-pulse"><Loader className="animate-spin"/> MENCARI...</span> : <><Search size={20}/> CARI DATA</>}
                        </NeoButton>
                    </div>
                </NeoCard>

                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <NeoCard className="bg-white relative overflow-hidden" title="HASIL PENCARIAN">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/2">
                                        <div className="border-2 border-black shadow-[4px_4px_0px_0px_black] aspect-video bg-black rounded-lg overflow-hidden relative">
                                            <img src={data.thumbnail} alt="Thumb" className="w-full h-full object-cover opacity-90"/>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-red-600 text-white rounded-full p-2 border-2 border-black">
                                                    {data.type === 'mp4' ? <Video size={24}/> : <Music size={24}/>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 flex flex-col justify-between space-y-3">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight line-clamp-2">{data.title}</h3>
                                            <p className="text-xs text-gray-500 font-bold mt-1">By {data.channel}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-xs font-medium bg-gray-100 p-2 rounded border border-gray-300">
                                            <p>⏱️ {data.duration}s</p>
                                            <p>👁️ {data.view_count}</p>
                                        </div>

                                        <NeoButton onClick={triggerDownload} variant="primary" className="w-full py-3 text-base">
                                            <Download size={20} /> DOWNLOAD {data.type.toUpperCase()}
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
