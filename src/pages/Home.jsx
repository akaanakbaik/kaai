import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, NeoTextArea, PageWrapper } from '../components/NeoUI';
import { Youtube, MessageSquare, Camera, Mail, BookOpen, Terminal, Heart, ArrowUpRight, Zap, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

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

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <PageWrapper>
            <Helmet><title>KAAI - Modern Utilities</title></Helmet>

            {/* HEADER / HERO */}
            <div className="flex flex-col items-center justify-center pt-12 pb-16 text-center space-y-6">
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    className="relative group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-black rounded-full translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all"></div>
                    <img 
                        src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                        alt="Logo" 
                        className="relative w-32 h-32 rounded-full border-4 border-black z-10 bg-white object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#A3E635] border-2 border-black px-2 py-0.5 text-xs font-black rounded-full z-20">ONLINE</div>
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none select-none">
                        KAAI
                    </h1>
                    <div className="inline-block bg-black text-white px-4 py-1 text-sm font-bold transform -rotate-2">
                        MODERN UTILITY PLATFORM
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <Link to="/docs">
                        <NeoButton variant="dark" className="rounded-full px-8">
                            <BookOpen size={18}/> DOKUMENTASI
                        </NeoButton>
                    </Link>
                    <NeoButton variant="white" className="rounded-full px-8 text-gray-500 cursor-default">
                        <Terminal size={18}/> V.15.0 STABLE
                    </NeoButton>
                </div>
            </div>

            {/* FEATURES GRID */}
            <motion.div 
                variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
            >
                <Link to="/ytdl" className="group h-full">
                    <motion.div variants={item} className="h-full">
                        <NeoCard className="h-full bg-[#FFDC58] group-hover:-translate-y-2 transition-transform relative overflow-hidden" title="01. MEDIA">
                            <Youtube size={120} className="absolute -bottom-6 -right-6 opacity-10 rotate-12"/>
                            <div className="flex flex-col items-start justify-between h-full gap-8">
                                <div className="p-3 bg-white border-2 border-black rounded-lg shadow-sm">
                                    <Youtube size={32} className="text-red-600"/>
                                </div>
                                <div>
                                    <h3 className="font-black text-3xl leading-none mb-1">YOUTUBE DL</h3>
                                    <p className="font-bold opacity-70 text-sm">Download Video & Audio MP3/MP4 dengan Metadata lengkap.</p>
                                </div>
                                <div className="w-full flex justify-end">
                                    <ArrowUpRight className="w-8 h-8"/>
                                </div>
                            </div>
                        </NeoCard>
                    </motion.div>
                </Link>

                <Link to="/ai/chat" className="group h-full">
                    <motion.div variants={item} className="h-full">
                        <NeoCard className="h-full bg-[#A3E635] group-hover:-translate-y-2 transition-transform relative overflow-hidden" title="02. INTELLIGENCE">
                            <MessageSquare size={120} className="absolute -bottom-6 -right-6 opacity-10 rotate-12"/>
                            <div className="flex flex-col items-start justify-between h-full gap-8">
                                <div className="p-3 bg-white border-2 border-black rounded-lg shadow-sm">
                                    <MessageSquare size={32} className="text-green-700"/>
                                </div>
                                <div>
                                    <h3 className="font-black text-3xl leading-none mb-1">KAAI CHAT</h3>
                                    <p className="font-bold opacity-70 text-sm">Asisten AI Multi-Model (Copilot, Qwen) dengan respon cepat.</p>
                                </div>
                                <div className="w-full flex justify-end">
                                    <ArrowUpRight className="w-8 h-8"/>
                                </div>
                            </div>
                        </NeoCard>
                    </motion.div>
                </Link>

                <Link to="/ssweb" className="group h-full">
                    <motion.div variants={item} className="h-full">
                        <NeoCard className="h-full bg-[#FF90E8] group-hover:-translate-y-2 transition-transform relative overflow-hidden" title="03. TOOLS">
                            <Camera size={120} className="absolute -bottom-6 -right-6 opacity-10 rotate-12"/>
                            <div className="flex flex-col items-start justify-between h-full gap-8">
                                <div className="p-3 bg-white border-2 border-black rounded-lg shadow-sm">
                                    <Camera size={32} className="text-purple-700"/>
                                </div>
                                <div>
                                    <h3 className="font-black text-3xl leading-none mb-1">SSWEB PRO</h3>
                                    <p className="font-bold opacity-70 text-sm">Screenshot Website resolusi tinggi (Desktop/Mobile).</p>
                                </div>
                                <div className="w-full flex justify-end">
                                    <ArrowUpRight className="w-8 h-8"/>
                                </div>
                            </div>
                        </NeoCard>
                    </motion.div>
                </Link>
            </motion.div>

            {/* INFO BANNER */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-wrap justify-center gap-4 mb-16"
            >
                <div className="bg-white border-2 border-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-[2px_2px_0px_0px_black]">
                    <Zap size={14} className="fill-yellow-400 text-black"/> ULTRA FAST ENGINE
                </div>
                <div className="bg-white border-2 border-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-[2px_2px_0px_0px_black]">
                    <Shield size={14} className="fill-blue-400 text-black"/> SSL SECURED
                </div>
            </motion.div>

            {/* CONTACT FORM */}
            <div className="max-w-xl mx-auto mb-12">
                <NeoCard title="SEND FEEDBACK" className="bg-white">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <NeoInput placeholder="Nama Kamu" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
                            <NeoInput placeholder="Judul / Topik" value={contact.title} onChange={e => setContact({...contact, title: e.target.value})} />
                        </div>
                        <NeoTextArea placeholder="Tulis pesan, kritik, atau saran..." rows={3} value={contact.message} onChange={e => setContact({...contact, message: e.target.value})} />
                        <NeoButton onClick={sendContact} disabled={loading} variant="dark" className="w-full">
                            {loading ? "MENGIRIM..." : <><Mail size={16}/> KIRIM PESAN</>}
                        </NeoButton>
                    </div>
                </NeoCard>
            </div>

            {/* FOOTER */}
            <footer className="text-center pt-8 border-t-2 border-black/10">
                <p className="font-black text-sm flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-1">dibuat dgn <Heart size={14} fill="red" className="text-red-500 animate-pulse"/> dan code</span>
                    <span>crafted by aka 🇮🇩 🇵🇸</span>
                </p>
            </footer>
        </PageWrapper>
    );
};

export default Home;
