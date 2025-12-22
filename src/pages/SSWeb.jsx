import React, { useState } from 'react';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Camera, Download, Loader, Monitor, Smartphone, ArrowLeft, Image, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const SSWeb = () => {
    const [url, setUrl] = useState('');
    const [type, setType] = useState('desktop');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSS = async () => {
        if(!url.startsWith('http')) return toast.error("URL wajib pakai http:// atau https://");
        setLoading(true); setResult(null);
        try {
            const res = await axios.get(`/api/ssweb?url=${url}&type=${type}`);
            if(res.data.status) {
                // Pastikan URL tidak di-cache browser
                setResult(`${res.data.url}?t=${Date.now()}`); 
                toast.success("Berhasil!");
            } else throw new Error(res.data.msg);
        } catch (e) { toast.error("Gagal: " + (e.response?.data?.msg || "Server Error")); } finally { setLoading(false); }
    };

    return (
        <PageWrapper>
            <Helmet><title>SSWeb Pro - KAAI</title></Helmet>
            <div className="mb-8"><Link to="/"><NeoButton variant="white" className="text-xs"><ArrowLeft size={14}/> KEMBALI</NeoButton></Link></div>

            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-black italic tracking-tighter">SSWEB <span className="text-purple-500">PRO</span></h1>
                    <p className="text-base font-bold text-gray-500">Screenshot Website Resolusi Tinggi</p>
                </div>

                <NeoCard className="bg-[#E0F2FE]" title="KONFIGURASI">
                    <div className="space-y-6">
                        <NeoInput placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} label="TARGET URL" />
                        
                        <div className="space-y-1">
                            <label className="font-bold text-xs uppercase ml-1 bg-black text-white px-2 py-0.5 rounded-sm inline-block">DEVICE TYPE</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[{id:'desktop',l:'DESKTOP / PC',i:<Monitor size={20}/>},{id:'mobile',l:'MOBILE / HP',i:<Smartphone size={20}/>}].map(t=>(
                                    <button key={t.id} onClick={()=>setType(t.id)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-black transition-all ${type===t.id?'bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]':'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_black]'}`}>
                                        {t.i}<span className="text-xs font-black tracking-widest">{t.l}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <NeoButton onClick={handleSS} disabled={loading} className="w-full h-14 text-lg" variant="secondary">
                            {loading ? <div className="flex items-center gap-2"><Loader className="animate-spin"/> MEMPROSES...</div> : <><Camera/> AMBIL SCREENSHOT</>}
                        </NeoButton>
                    </div>
                </NeoCard>

                <AnimatePresence>
                    {result && (
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
                            <NeoCard title="HASIL PREVIEW" className="bg-white">
                                <div className="border-2 border-black p-2 bg-gray-100 rounded-lg mb-4 shadow-inner relative group">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 -z-10 text-gray-400 font-bold">
                                        Memuat Gambar...
                                    </div>
                                    <img 
                                        src={result} 
                                        className="w-full h-auto rounded border border-gray-300" 
                                        alt="Hasil Screenshot"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            toast.error("Gagal memuat gambar (Link Expired/Error)");
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <a href={result} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <NeoButton variant="white" className="w-full"><ExternalLink size={16}/> BUKA FULL</NeoButton>
                                    </a>
                                    <a href={result} download={`ssweb-${Date.now()}.jpg`} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <NeoButton variant="dark" className="w-full"><Download size={16}/> DOWNLOAD JPG</NeoButton>
                                    </a>
                                </div>
                            </NeoCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageWrapper>
    );
};

export default SSWeb;
