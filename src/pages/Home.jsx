import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, NeoTextArea, PageWrapper } from '../components/NeoUI';
// Pastikan icon 'Download' di-import di sini
import { Youtube, MessageSquare, Camera, BookOpen, Terminal, Download } from 'lucide-react'; 
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Home = () => {
    const [contact, setContact] = useState({ name: '', title: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const sendContact = async () => {
        if (!contact.name || !contact.message) return toast.error("Isi data dulu!");
        setLoading(true);
        try {
            await axios.post('/api/contact', contact);
            toast.success("Terkirim!");
            setContact({ name: '', title: '', message: '' });
        } catch { toast.error("Gagal."); } finally { setLoading(false); }
    };

    const handleEasterEgg = () => {
        setClickCount(prev => prev + 1);
        if (clickCount + 1 === 5) toast('🎉 MODE DEVELOPER AKTIF!', { icon: '🧑‍💻', style: { background: '#000', color: '#fff' } });
        else if (clickCount + 1 === 10) { toast('🇵🇸 FREE PALESTINE!', { icon: '❤️', duration: 4000 }); setClickCount(0); }
    };

    const container = { show: { transition: { staggerChildren: 0.1 } } };
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    return (
        <PageWrapper>
            <Helmet><title>KAAI - Utilities</title></Helmet>

            {/* HERO SECTION */}
            <div className="flex flex-col items-center justify-center pt-6 pb-10 text-center space-y-4">
                <motion.div 
                    whileTap={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleEasterEgg}
                    className="relative group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-black rounded-full translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all"></div>
                    <img 
                        src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                        alt="Logo" 
                        className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-[3px] border-black z-10 bg-white object-cover"
                    />
                    {clickCount > 0 && clickCount < 5 && (
                        <div className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] px-1 rounded font-bold animate-bounce">x{clickCount}</div>
                    )}
                </motion.div>

                <div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none select-none">KAAI</h1>
                    <p className="text-xs md:text-sm font-bold text-gray-500 mt-1">SIMPLE . FAST . SECURE</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <Link to="/docs">
                        <NeoButton variant="dark" className="rounded-full px-4 h-8 text-[10px]"><BookOpen size={12}/> DOCS</NeoButton>
                    </Link>
                    <NeoButton variant="white" className="rounded-full px-4 h-8 text-[10px] text-gray-500 cursor-default"><Terminal size={12}/> V.15.5</NeoButton>
                </div>
            </div>

            {/* GRID MENU UTAMA (PASTIKAN BAGIAN INI ADA DI CODE KAMU) */}
            <motion.div 
                variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 px-1 max-w-4xl mx-auto"
            >
                {/* --- 1. KARTU BARU: ALL IN ONE --- */}
                <Link to="/allindl" className="group">
                    <motion.div variants={item}>
                        <NeoCard className="bg-[#60A5FA] group-hover:-translate-y-1 transition-transform relative overflow-hidden" title="01. ALL DOWNLOADER">
                            <Download size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12"/>
                            <div className="flex items-center gap-4 py-2">
                                <div className="p-2 bg-white border-2 border-black rounded-md shadow-sm">
                                    <Download size={24} className="text-blue-700"/>
                                </div>
                                <div>
                                    <h3 className="font-black text-xl leading-none">ALL-IN-ONE</h3>
                                    <p className="font-bold opacity-60 text-[10px]">TikTok, IG, FB, Twitter</p>
                                </div>
                            </div>
                        </NeoCard>
                    </motion.div>
                </Link>
                {/* ---------------------------------- */}

                <Link to="/ytdl" className="group">
                    <motion.div variants={item}>
                        <NeoCard className="bg-[#FFDC58] group-hover:-translate-y-1 transition-transform relative overflow-hidden" title="02. MEDIA">
                            <Youtube size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12"/>
                            <div className="flex items-center gap-4 py-2">
                                <div className="p-2 bg-white border-2 border-black rounded-md shadow-sm"><Youtube size={24} className="text-red-600"/></div>
                                <div>
                                    <h3 className="font-black text-xl leading-none">YOUTUBE DL</h3>
                                    <p className="font-bold opacity-60 text-[10px]">Video & Audio</p>
                                </div>
                            </div>
                        </NeoCard>
                    </motion.div>
                </Link>

                <Link to="/ai/chat" className="group">
                    <motion.div variants={item}>
                        <NeoCard className="bg-[#A3E635] group-hover:-translate-y-1 transition-transform relative overflow-hidden" title="03. AI">
                            <MessageSquare size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12"/>
                            <div className="flex items-center gap-4 py-2">
                                <div className="p-2 bg-white border-2 border-black rounded-md shadow-sm"><MessageSquare size={24} className="text-green-700"/></div>
                                <div>
                                    <h3 className="font-black text-xl leading-none">KAAI CHAT</h3>
                                    <p className="font-bold opacity-60 text-[10px]">Asisten Pintar</p>
                                </div>
                            </div>
                        </NeoCard>
                    </motion.div>
                </Link>

                <Link to="/ssweb" className="group">
                    <motion.div variants={item}>
                        <NeoCard className="bg-[#FF90E8] group-hover:-translate-y-1 transition-transform relative overflow-hidden" title="04. TOOLS">
                            <Camera size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12"/>
                            <div className="flex items-center gap-4 py-2">
                                <div className="p-2 bg-white border-2 border-black rounded-md shadow-sm"><Camera size={24} className="text-purple-700"/></div>
                                <div>
                                    <h3 className="font-black text-xl leading-none">SSWEB PRO</h3>
                                    <p className="font-bold opacity-60 text-[10px]">Screenshot Web</p>
                                </div>
                            </div>
                        </NeoCard>
                    </motion.div>
                </Link>
            </motion.div>

            {/* CONTACT */}
            <div className="max-w-md mx-auto mb-10">
                <NeoCard title="KONTAK" className="bg-white">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <NeoInput placeholder="Nama" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
                            <NeoInput placeholder="Topik" value={contact.title} onChange={e => setContact({...contact, title: e.target.value})} />
                        </div>
                        <NeoTextArea placeholder="Pesan..." rows={2} value={contact.message} onChange={e => setContact({...contact, message: e.target.value})} />
                        <NeoButton onClick={sendContact} disabled={loading} variant="dark" className="w-full h-9 text-xs">{loading ? "..." : "KIRIM"}</NeoButton>
                    </div>
                </NeoCard>
            </div>
            
            <footer className="text-center pt-6 border-t-2 border-black/5">
                <p className="font-black text-[10px] md:text-xs flex flex-col items-center gap-1 opacity-50">crafted by aka 🇮🇩 🇵🇸</p>
            </footer>
        </PageWrapper>
    );
};

export default Home;
