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
        if(!url.startsWith('http')) return toast.error("URL wajib pakai http:// atau https://");
        setLoading(true); setResult(null);
        try {
            const res = await axios.get(`/api/ssweb?url=${url}&type=${type}`);
            if(res.data.status) {
                setResult(res.data.url); // Backend sudah mengembalikan URL lengkap
                toast.success("Berhasil!");
            } else throw new Error(res.data.msg);
        } catch (e) { toast.error("Gagal: " + (e.response?.data?.msg || "Server Error")); } finally { setLoading(false); }
    };

    return (
        <PageWrapper>
            <Helmet><title>SSWeb Pro</title></Helmet>
            <div className="mb-6"><Link to="/"><NeoButton variant="white" className="text-xs"><ArrowLeft size={14}/> KEMBALI</NeoButton></Link></div>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter">SSWEB <span className="text-purple-500">PRO</span></h1>
                    <p className="text-sm font-bold text-gray-500">High Quality Screenshot</p>
                </div>
                <NeoCard className="bg-[#E0F2FE]" title="SETTING">
                    <div className="space-y-4">
                        <NeoInput placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
                        <div className="grid grid-cols-2 gap-2">
                            {[{id:'desktop',l:'DESKTOP',i:<Monitor/>},{id:'mobile',l:'HP',i:<Smartphone/>}].map(t=>(
                                <button key={t.id} onClick={()=>setType(t.id)} className={`flex flex-col items-center p-3 rounded border-2 border-black ${type===t.id?'bg-black text-white':'bg-white'}`}>{t.i}<span className="text-xs font-bold">{t.l}</span></button>
                            ))}
                        </div>
                        <NeoButton onClick={handleSS} disabled={loading} className="w-full h-12" variant="secondary">{loading?<Loader className="animate-spin"/>:<><Camera/> JEPRET</>}</NeoButton>
                    </div>
                </NeoCard>
                {result && (
                    <NeoCard title="RESULT" className="bg-white animate-in slide-in-from-bottom-5">
                        <div className="border-2 border-black p-1 bg-gray-100 rounded mb-4"><img src={result} className="w-full h-auto rounded" alt="Result"/></div>
                        <a href={result} download={`ssweb-${Date.now()}.jpg`} target="_blank"><NeoButton variant="dark" className="w-full"><Download size={16}/> DOWNLOAD</NeoButton></a>
                    </NeoCard>
                )}
            </div>
            <footer className="text-center pt-10 pb-4"><p className="font-black text-sm text-gray-400">crafted by aka 🇮🇩 🇵🇸</p></footer>
        </PageWrapper>
    );
};
export default SSWeb;
