import React, { useState } from 'react';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Camera, Download, Loader, Monitor, Smartphone, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
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
        if(!url) return toast.error("Masukkan URL dulu!");

        // Auto add https if missing
        let targetUrl = url;
        if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;

        setLoading(true); setResult(null);

        try {
            // PERBAIKAN: Gunakan window.apiMain yang sudah dikonfigurasi di main.jsx
            // Ini memastikan request melewati proxy yang benar sesuai vercel.json
            const res = await window.apiMain.get('/api/ssweb', {
                params: {
                    url: targetUrl,
                    type: type
                },
                // Tambahan: Timeout khusus untuk SSWeb karena proses puppeteer berat
                timeout: 60000 
            });

            if(res.data.status) {
                // Tambahkan timestamp agar browser tidak cache gambar lama
                setResult(`${res.data.url}?t=${Date.now()}`); 
                toast.success("Cekrek! Berhasil.");
            } else throw new Error(res.data.msg);

        } catch (e) { 
            // Logging error untuk debug
            console.error("SSWeb Error:", e);
            toast.error("Gagal: " + (e.response?.data?.msg || e.message || "Server Timeout / Error")); 
        } finally { setLoading(false); }
    };

    return (
        <PageWrapper>
            <Helmet><title>SSWeb Pro</title></Helmet>
            
            <div className="flex items-center justify-between mb-6">
                <Link to="/"><NeoButton variant="white" className="h-8 text-[10px]"><ArrowLeft size={12}/> KEMBALI</NeoButton></Link>
                <div className="text-right">
                    <h1 className="text-2xl font-black italic tracking-tighter leading-none">SSWEB<span className="text-purple-500">PRO</span></h1>
                </div>
            </div>

            <div className="max-w-xl mx-auto space-y-4">
                <NeoCard className="bg-[#E0F2FE]" title="SETTING">
                    <div className="space-y-3">
                        <NeoInput 
                            placeholder="google.com" 
                            value={url} 
                            onChange={e => setUrl(e.target.value)} 
                            label="URL TARGET" 
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                            {[{id:'desktop',l:'PC',i:<Monitor size={16}/>},{id:'mobile',l:'HP',i:<Smartphone size={16}/>}].map(t=>(
                                <button 
                                    key={t.id} 
                                    onClick={()=>setType(t.id)} 
                                    className={`flex items-center justify-center gap-2 p-2.5 rounded-md border-2 border-black transition-all ${type===t.id?'bg-black text-white shadow-[2px_2px_0px_0px_gray]':'bg-white hover:bg-gray-50'}`}
                                >
                                    {t.i}<span className="text-xs font-bold">{t.l}</span>
                                </button>
                            ))}
                        </div>

                        <NeoButton onClick={handleSS} disabled={loading} className="w-full h-10 text-sm" variant="secondary">
                            {loading ? <Loader className="animate-spin" size={16}/> : <><Camera size={16}/> JEPRET</>}
                        </NeoButton>
                    </div>
                </NeoCard>

                <AnimatePresence>
                    {result && (
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
                            <NeoCard title="HASIL" className="bg-white">
                                {/* WRAPPER GAMBAR DENGAN FIXED MIN-HEIGHT AGAR TIDAK COLLAPSE */}
                                <div className="border-2 border-black bg-gray-100 rounded mb-3 relative min-h-[200px] flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={result} 
                                        className="w-full h-auto object-contain block relative z-10" 
                                        alt="Hasil Screenshot"
                                        onLoad={() => toast.success("Gambar dimuat!")}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            toast.error("Gagal load gambar dari server");
                                        }}
                                    />
                                    {/* Fallback text behind image */}
                                    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-gray-400">
                                        <Loader className="animate-spin mb-2"/>
                                        <span className="text-xs font-bold">Memuat Preview...</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <a href={result} target="_blank" rel="noreferrer" className="w-full">
                                        <NeoButton variant="white" className="w-full h-9 text-xs"><ExternalLink size={14}/> BUKA</NeoButton>
                                    </a>
                                    <a href={result} download={`ssweb-${Date.now()}.jpg`} target="_blank" rel="noreferrer" className="w-full">
                                        <NeoButton variant="dark" className="w-full h-9 text-xs"><Download size={14}/> SIMPAN</NeoButton>
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
