import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, NeoTextArea, PageWrapper } from '../components/NeoUI';
import { Youtube, MessageSquare, Camera, Mail, BookOpen, Terminal, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const [contact, setContact] = useState({ name: '', title: '', message: '' });
    const [loading, setLoading] = useState(false);

    const sendContact = async () => {
        if (!contact.name || !contact.message) return toast.error("Isi nama & pesan dulu!");
        setLoading(true);
        try {
            await axios.post('/api/contact', contact);
            toast.success("Laporan terkirim!");
            setContact({ name: '', title: '', message: '' });
        } catch { toast.error("Gagal mengirim."); } finally { setLoading(false); }
    };

    return (
        <PageWrapper>
            <Helmet><title>KAAI - Digital Utilities</title></Helmet>
            <div className="space-y-12 pb-20">
                <div className="text-center space-y-6 pt-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <img src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" alt="Logo" className="w-28 h-28 mx-auto rounded-full border-4 border-black bg-white"/>
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2">KAAI</h1>
                        <p className="text-lg font-bold text-gray-500 max-w-lg mx-auto">Platform utilitas digital modern. Cepat, Aman, Tanpa Iklan.</p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <a href="/docs" target="_blank"><NeoButton variant="dark" className="rounded-full px-6"><BookOpen size={18}/> DOKUMENTASI</NeoButton></a>
                        <NeoButton variant="white" className="rounded-full px-6 text-gray-500 cursor-default"><Terminal size={18}/> V.14.0</NeoButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                    <Link to="/ytdl" className="group"><NeoCard className="h-full group-hover:-translate-y-2 transition-all duration-300 bg-[#FFDC58]" title="MEDIA"><div className="flex flex-col items-center gap-4 py-6"><Youtube size={40} className="text-red-600"/><div><h3 className="font-black text-2xl">YOUTUBE DL</h3><p className="text-xs font-bold opacity-70">Video & Audio</p></div></div></NeoCard></Link>
                    <Link to="/ai/chat" className="group"><NeoCard className="h-full group-hover:-translate-y-2 transition-all duration-300 bg-[#A3E635]" title="INTELLIGENCE"><div className="flex flex-col items-center gap-4 py-6"><MessageSquare size={40} className="text-green-700"/><div><h3 className="font-black text-2xl">KAAI CHAT</h3><p className="text-xs font-bold opacity-70">Asisten Pintar</p></div></div></NeoCard></Link>
                    <Link to="/ssweb" className="group"><NeoCard className="h-full group-hover:-translate-y-2 transition-all duration-300 bg-[#FF90E8]" title="UTILITY"><div className="flex flex-col items-center gap-4 py-6"><Camera size={40} className="text-purple-700"/><div><h3 className="font-black text-2xl">SSWEB PRO</h3><p className="text-xs font-bold opacity-70">Screenshot Web</p></div></div></NeoCard></Link>
                </div>

                <div className="max-w-xl mx-auto pt-8">
                    <NeoCard title="KONTAK" className="bg-white">
                        <div className="flex flex-col gap-3">
                            <NeoInput placeholder="Nama" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
                            <NeoTextArea placeholder="Pesan Anda..." rows={2} value={contact.message} onChange={e => setContact({...contact, message: e.target.value})} />
                            <NeoButton onClick={sendContact} disabled={loading} variant="dark" className="w-full">{loading ? "..." : "KIRIM"}</NeoButton>
                        </div>
                    </NeoCard>
                </div>

                <footer className="text-center pt-10 border-t-2 border-dashed border-gray-300">
                    <p className="font-black text-sm text-gray-800 flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1">dibuat dgn <Heart size={14} fill="red" className="text-red-500"/> dan code</span>
                        <span>crafted by aka 🇮🇩 🇵🇸</span>
                    </p>
                </footer>
            </div>
        </PageWrapper>
    );
};
export default Home;
