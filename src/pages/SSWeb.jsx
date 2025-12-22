import React, { useState } from 'react';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI';
import { Camera, Download, Loader, Monitor, Smartphone, ArrowLeft, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const SSWeb = () => {
    const [url, setUrl] = useState('');
    const [type, setType] = useState('desktop');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSS = async () => {
        if(!url.startsWith('http')) return toast.error("URL harus pakai http:// atau https://");
        setLoading(true); setResult(null);
        try {
            const res = await axios.get(`/api/ssweb?url=${url}&type=${type}`);
            if(res.data.status) {
                setResult(res.data.url);
                toast.success("Berhasil!");
            } else throw new Error(res.data.msg);
        } catch (e) {
            toast.error("Gagal: " + (e.response?.data?.msg || "Server sibuk"));
        } finally { setLoading(false); }
    };

    const downloadImage = async () => {
        try {
            const response = await fetch(result);
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = `ssweb-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);
            toast.success("Gambar disimpan!");
        } catch {
            window.open(result, '_blank');
        }
    };

    return (
        <PageWrapper>
            <Helmet><title>SSWeb Pro - Screenshot Website</title></Helmet>
            <div className="mb-6"><Link to="/"><NeoButton variant="white" className="text-xs"><ArrowLeft size={14}/> KEMBALI</NeoButton></Link></div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter">SSWEB <span className="text-purple-500">PRO</span></h1>
                    <p className="text-sm font-bold text-gray-500">High Resolution Screenshot Tool</p>
                </div>

                <NeoCard className="bg-[#E0F2FE]" title="KONFIGURASI">
                    <div className="space-y-4">
                        <NeoInput placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} label="Target URL"/>
                        <div className="grid grid-cols-2 gap-2">
                            {[{id:'desktop', icon:<Monitor/>, l:'DESKTOP'}, {id:'mobile', icon:<Smartphone/>, l:'MOBILE'}].map(t => (
                                <button key={t.id} onClick={()=>setType(t.id)} className={`flex flex-col items-center p-3 rounded border-2 border-black transition-all ${type===t.id ? 'bg-black text-white shadow-[2px_2px_0px_0px_black]' : 'bg-white hover:bg-gray-50'}`}>
                                    {t.icon}<span className="text-xs font-black mt-1">{t.l}</span>
                                </button>
                            ))}
                        </div>
                        <NeoButton onClick={handleSS} disabled={loading} className="w-full h-12" variant="secondary">
                            {loading ? <Loader className="animate-spin"/> : <><Camera/> JEPRET SEKARANG</>}
                        </NeoButton>
                    </div>
                </NeoCard>

                {result && (
                    <NeoCard title="HASIL SCREENSHOT" className="bg-white animate-in slide-in-from-bottom-5">
                        <div className="border-2 border-black p-1 bg-gray-100 rounded mb-4"><img src={result} className="w-full h-auto rounded"/></div>
                        <div className="grid grid-cols-2 gap-2">
                            <NeoButton onClick={() => window.open(result, '_blank')} variant="white"><Image size={16}/> LIHAT FULL</NeoButton>
                            <NeoButton onClick={downloadImage} variant="dark"><Download size={16}/> UNDUH GAMBAR</NeoButton>
                        </div>
                    </NeoCard>
                )}
            </div>
        </PageWrapper>
    );
};

export default SSWeb;
