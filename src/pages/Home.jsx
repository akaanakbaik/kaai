import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, NeoTextArea, PageWrapper } from '../components/NeoUI';
import { Youtube, MessageSquare, Camera, Mail, ArrowRight, Zap, Shield, BookOpen, Terminal } from 'lucide-react';
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
        } catch {
            toast.error("Gagal mengirim.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <Helmet>
                <title>KAAI Tools - AI & Downloader Super Cepat</title>
                <meta name="description" content="Platform serbaguna untuk produktivitas digital. Download YouTube, Chat AI Cerdas, dan Utilitas Web dalam satu tempat." />
                <meta name="keywords" content="AI, Downloader, SSWeb, YouTube DL, Tools" />
            </Helmet>

            <div className="space-y-12 pb-10">
                <div className="text-center space-y-6 pt-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-black rounded-full translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-all"></div>
                        <img 
                            src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                            alt="Logo" 
                            className="relative w-28 h-28 mx-auto rounded-full border-4 border-black z-10 bg-white"
                        />
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2">
                            KAAI <span className="text-[#FF90E8] underline decoration-4 decoration-black underline-offset-4">TOOLS</span>
                        </h1>
                        <p className="text-base md:text-lg font-bold text-gray-600 max-w-xl mx-auto border-2 border-dashed border-gray-400 p-2 rounded-lg bg-gray-50">
                            Pusat utilitas digital modern. Cepat, Aman, dan Tanpa Iklan Mengganggu.
                        </p>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                        <a href="https://docs.kaai.id" target="_blank" rel="noreferrer">
                            <NeoButton variant="dark" className="rounded-full px-6"><BookOpen size={18}/> DOKUMENTASI</NeoButton>
                        </a>
                        <NeoButton variant="white" className="rounded-full px-6 text-gray-500 cursor-default"><Terminal size={18}/> V.12.0 STABLE</NeoButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                    <Link to="/ytdl" className="group">
                        <NeoCard className="h-full group-hover:-translate-y-2 transition-all duration-300 bg-[#FFDC58]" title="MEDIA SAVER">
                            <div className="flex flex-col items-center text-center gap-4 py-6">
                                <div className="p-4 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_black] group-hover:rotate-12 transition-transform">
                                    <Youtube size={32} className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl uppercase">YouTube DL</h3>
                                    <p className="text-sm font-bold opacity-70 mt-1">Video & Audio High Quality</p>
                                </div>
                            </div>
                        </NeoCard>
                    </Link>

                    <Link to="/ai/chat" className="group">
                        <NeoCard className="h-full group-hover:-translate-y-2 transition-all duration-300 bg-[#A3E635]" title="SMART AI">
                            <div className="flex flex-col items-center text-center gap-4 py-6">
                                <div className="p-4 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_black] group-hover:-rotate-12 transition-transform">
                                    <MessageSquare size={32} className="text-green-700" />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl uppercase">Kaai Chat</h3>
                                    <p className="text-sm font-bold opacity-70 mt-1">Asisten Pintar Multi-Model</p>
                                </div>
                            </div>
                        </NeoCard>
                    </Link>

                    <Link to="/ssweb" className="group">
                        <NeoCard className="h-full group-hover:-translate-y-2 transition-all duration-300 bg-[#FF90E8]" title="WEB TOOLS">
                            <div className="flex flex-col items-center text-center gap-4 py-6">
                                <div className="p-4 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_black] group-hover:scale-110 transition-transform">
                                    <Camera size={32} className="text-purple-700" />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl uppercase">SSWeb Pro</h3>
                                    <p className="text-sm font-bold opacity-70 mt-1">Screenshot Web Anti-Detect</p>
                                </div>
                            </div>
                        </NeoCard>
                    </Link>
                </div>

                <div className="flex flex-wrap gap-4 justify-center text-xs font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1"><Zap size={14}/> Fast Engine</span>
                    <span className="flex items-center gap-1"><Shield size={14}/> Secure SSL</span>
                    <span className="flex items-center gap-1"><Terminal size={14}/> API Public</span>
                </div>

                <div className="max-w-xl mx-auto pt-8">
                    <NeoCard title="KONTAK DEVELOPER" className="bg-white">
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <NeoInput placeholder="Nama" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
                                <NeoInput placeholder="Judul" value={contact.title} onChange={e => setContact({...contact, title: e.target.value})} />
                            </div>
                            <NeoTextArea placeholder="Pesan Anda..." rows={2} value={contact.message} onChange={e => setContact({...contact, message: e.target.value})} />
                            <NeoButton onClick={sendContact} disabled={loading} variant="dark" className="w-full">
                                {loading ? "MENGIRIM..." : <><Mail size={16}/> KIRIM LAPORAN</>}
                            </NeoButton>
                        </div>
                    </NeoCard>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Home;
