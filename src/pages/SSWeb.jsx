import React, { useState } from 'react';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Camera, Download, Loader, Monitor, Smartphone, Maximize, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SSWeb = () => {
    const [url, setUrl] = useState('');
    const [type, setType] = useState('desktop');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSS = async () => {
        if(!url) return toast.error("Masukkan URL dulu!");
        if(!url.startsWith('http')) return toast.error("URL harus diawali http:// atau https://");
        
        setLoading(true);
        setResult(null);
        try {
            const res = await axios.get(`/api/ssweb?url=${url}&type=${type}`);
            if(res.data.status) {
                setResult(res.data.url);
                toast.success("Cekrek! Berhasil.");
            } else {
                toast.error("Gagal: " + res.data.msg);
            }
        } catch (e) {
            toast.error("Server sibuk atau URL diproteksi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <div className="mb-6">
                <Link to="/"><NeoButton variant="white" className="text-xs"><ArrowLeft size={14}/> KEMBALI</NeoButton></Link>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter">SSWEB <span className="text-purple-500">PRO</span></h1>
                    <p className="text-sm font-medium text-gray-500">Screenshot website resolusi tinggi & full page.</p>
                </div>

                <NeoCard className="bg-[#E0F2FE]" title="PANEL KONTROL">
                    <div className="space-y-4">
                        <NeoInput 
                            placeholder="https://example.com" 
                            value={url} 
                            onChange={e => setUrl(e.target.value)} 
                            label="Target URL"
                        />
                        
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'desktop', icon: <Monitor size={16}/>, label: 'PC' },
                                { id: 'mobile', icon: <Smartphone size={16}/>, label: 'HP' },
                                { id: 'full', icon: <Maximize size={16}/>, label: 'FULL' }
                            ].map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`
                                        flex flex-col items-center justify-center p-2 rounded border-2 border-black transition-all
                                        ${type === t.id ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(100,100,100,1)] translate-x-[1px] translate-y-[1px]' : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_black]'}
                                    `}
                                >
                                    {t.icon}
                                    <span className="text-[10px] font-bold mt-1">{t.label}</span>
                                </button>
                            ))}
                        </div>

                        <NeoButton onClick={handleSS} disabled={loading} className="w-full h-12 text-lg" variant="secondary">
                            {loading ? <span className="flex items-center gap-2 animate-pulse"><Loader className="animate-spin"/> PROSES...</span> : <><Camera/> AMBIL SCREENSHOT</>}
                        </NeoButton>
                    </div>
                </NeoCard>

                {result && (
                    <NeoCard title="PREVIEW" className="bg-white animate-in slide-in-from-bottom-5">
                        <div className="border-2 border-black p-1 bg-gray-200 rounded mb-4 overflow-hidden relative group">
                            <img src={result} alt="Result" className="w-full h-auto object-contain max-h-[500px]" />
                            <a href={result} target="_blank" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2">
                                <Maximize size={20}/> Zoom Full
                            </a>
                        </div>
                        <a href={result} download>
                            <NeoButton className="w-full" variant="dark"><Download size={18}/> SIMPAN GAMBAR</NeoButton>
                        </a>
                        <p className="text-[10px] text-center mt-2 text-gray-400">*Link gambar kadaluarsa dalam 5 jam</p>
                    </NeoCard>
                )}
            </div>
        </PageWrapper>
    );
};

export default SSWeb;
