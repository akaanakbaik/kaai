import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput } from '../components/NeoUI';
import { Search, Download, Music, Video, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Ytdl = () => {
    const [url, setUrl] = useState('');
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // Custom Style untuk React Select agar Neobrutalis
    const selectStyle = {
        control: (base, state) => ({
            ...base,
            border: '2px solid black',
            borderRadius: '0px',
            boxShadow: state.isFocused ? '3px 3px 0px 0px black' : '3px 3px 0px 0px black',
            fontWeight: 'bold',
            padding: '4px',
            borderColor: 'black',
            '&:hover': { borderColor: 'black' }
        }),
        menu: (base) => ({
            ...base,
            border: '2px solid black',
            borderRadius: '0px',
            marginTop: '8px',
            boxShadow: '5px 5px 0px 0px black',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#FFDC58' : state.isFocused ? '#f0f0f0' : 'white',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer'
        })
    };

    const options = [
        { value: 'mp3', label: <div className="flex items-center gap-2"><Music size={16}/> Audio (MP3)</div> },
        { value: 'mp4', label: <div className="flex items-center gap-2"><Video size={16}/> Video (MP4)</div> }
    ];

    const handleProcess = async () => {
        if (!url) return toast.error('URL wajib diisi!');
        if (!type) return toast.error('Pilih format dulu (MP3/MP4)!');
        
        // Validasi URL Sederhana
        const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
        if (!regex.test(url)) return toast.error('URL harus link YouTube valid!');

        setLoading(true);
        setData(null);

        try {
            const endpoint = type.value === 'mp3' ? '/api/ytdl/mp3' : '/api/ytdl/mp4';
            // Request ke Backend
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, { url });
            
            if (res.data.status) {
                setData({ ...res.data, type: type.value });
                toast.success('Berhasil mendapatkan data!');
            } else {
                throw new Error(res.data.msg);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || err.message || 'Terjadi kesalahan server.');
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
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black bg-white inline-block px-4 py-2 border-2 border-black shadow-neo transform -rotate-2">
                    📺 YOUTUBE DOWNLOADER
                </h1>
            </div>

            {/* Input Section */}
            <NeoCard className="bg-neo-blue" title="1. MASUKKAN LINK">
                <div className="space-y-4">
                    <NeoInput 
                        label="URL Video/Shorts"
                        placeholder="https://youtube.com/watch?v=..." 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    
                    <div className="w-full">
                        <label className="mb-1 block font-bold text-sm bg-neo-black text-white w-fit px-2">Format Output</label>
                        <Select 
                            options={options} 
                            styles={selectStyle} 
                            placeholder="Pilih format..."
                            onChange={setType}
                            value={type}
                        />
                    </div>

                    <NeoButton onClick={handleProcess} disabled={loading} className="w-full mt-4" variant="primary">
                        {loading ? 'SEDANG MEMPROSES...' : <><Search size={20}/> PROSES SEKARANG</>}
                    </NeoButton>
                </div>
            </NeoCard>

            {/* Result Section */}
            {data && (
                <NeoCard className="bg-neo-green relative overflow-hidden" title="2. HASIL DATA">
                    <div className="absolute top-0 right-0 p-2 bg-black text-white text-xs font-mono z-10">
                        SRC: {data.source || 'CACHE'}
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 mt-4">
                        {/* Preview Media */}
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                            <div className="border-2 border-black shadow-neo bg-black aspect-video flex items-center justify-center overflow-hidden">
                                {data.type === 'mp4' ? (
                                    <video controls className="w-full h-full object-contain">
                                        <source src={data.download_url} type="video/mp4"/>
                                    </video>
                                ) : (
                                    <img src={data.thumbnail} alt="Cover" className="w-full h-full object-cover opacity-80"/>
                                )}
                            </div>
                            {data.type === 'mp3' && (
                                <audio controls className="w-full border-2 border-black">
                                    <source src={data.download_url} type="audio/mpeg"/>
                                </audio>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="w-full md:w-1/2 flex flex-col justify-between bg-white border-2 border-black p-4 shadow-neo-sm">
                            <div className="space-y-2 font-medium text-sm md:text-base">
                                <h3 className="font-black text-xl line-clamp-2 leading-tight">{data.title}</h3>
                                <div className="w-full h-1 bg-black my-2"></div>
                                <p>👤 <strong>Channel:</strong> {data.channel}</p>
                                <p>⏱️ <strong>Durasi:</strong> {data.duration}s</p>
                                <p>👁️ <strong>Views:</strong> {Number(data.view_count).toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">API Author: {data.author}</p>
                            </div>

                            <NeoButton onClick={triggerDownload} variant="dark" className="w-full mt-6 animate-pulse">
                                <Download size={20} /> DOWNLOAD {data.type.toUpperCase()}
                            </NeoButton>
                        </div>
                    </div>
                </NeoCard>
            )}
        </div>
    );
};

export default Ytdl;
