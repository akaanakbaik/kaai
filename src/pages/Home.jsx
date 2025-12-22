import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NeoCard, NeoButton, NeoInput, NeoTextArea, PageWrapper } from '../components/NeoUI';
import { Youtube, MessageSquare, Camera, Mail, ArrowRight, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

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
            <div className="space-y-10">
                {/* HERO SECTION */}
                <div className="text-center space-y-4 py-8">
                    <img 
                        src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                        alt="Logo" 
                        className="w-24 h-24 mx-auto rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:rotate-12 transition-transform duration-300"
                    />
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">KAAI <span className="text-[#FF90E8]">TOOLS</span></h1>
                        <p className="text-sm md:text-base font-medium text-gray-600 max-w-lg mx-auto mt-2">
                            Platform serbaguna untuk produktivitas digital. Download, Chat AI, dan Utilitas Web dalam satu tempat.
                        </p>
                    </div>
                </div>

                {/* NAVIGATION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/ytdl">
                        <NeoCard className="h-full hover:-translate-y-1 transition-transform cursor-pointer bg-[#FFDC58]" title="MEDIA">
                            <div className="flex flex-col items-center text-center gap-3 py-4">
                                <Youtube size={40} className="text-red-600" />
                                <div>
                                    <h3 className="font-bold text-xl">YouTube DL</h3>
                                    <p className="text-xs font-medium opacity-80">Download Video & Audio MP3/MP4</p>
                                </div>
                                <NeoButton variant="white" className="w-full text-xs mt-2">BUKA <ArrowRight size={14}/></NeoButton>
                            </div>
                        </NeoCard>
                    </Link>

                    <Link to="/ai/chat">
                        <NeoCard className="h-full hover:-translate-y-1 transition-transform cursor-pointer bg-[#A3E635]" title="INTELLIGENCE">
                            <div className="flex flex-col items-center text-center gap-3 py-4">
                                <MessageSquare size={40} className="text-green-700" />
                                <div>
                                    <h3 className="font-bold text-xl">Kaai Chat</h3>
                                    <p className="text-xs font-medium opacity-80">AI Pintar Multi-Model (WhatsApp Style)</p>
                                </div>
                                <NeoButton variant="white" className="w-full text-xs mt-2">CHATING <ArrowRight size={14}/></NeoButton>
                            </div>
                        </NeoCard>
                    </Link>

                    <Link to="/ssweb">
                        <NeoCard className="h-full hover:-translate-y-1 transition-transform cursor-pointer bg-[#FF90E8]" title="UTILITY">
                            <div className="flex flex-col items-center text-center gap-3 py-4">
                                <Camera size={40} className="text-purple-700" />
                                <div>
                                    <h3 className="font-bold text-xl">SSWeb Pro</h3>
                                    <p className="text-xs font-medium opacity-80">Screenshot Web Anti-Detect</p>
                                </div>
                                <NeoButton variant="white" className="w-full text-xs mt-2">JEPRET <ArrowRight size={14}/></NeoButton>
                            </div>
                        </NeoCard>
                    </Link>
                </div>

                {/* MINI FEATURES */}
                <div className="flex flex-wrap gap-2 justify-center text-xs font-bold uppercase">
                    <span className="bg-white border border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_black] flex items-center gap-1"><Zap size={12}/> Super Cepat</span>
                    <span className="bg-white border border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_black] flex items-center gap-1"><Star size={12}/> Tanpa Iklan</span>
                    <span className="bg-white border border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_black] flex items-center gap-1">🔒 Aman</span>
                </div>

                {/* COMPACT CONTACT FORM */}
                <div className="max-w-xl mx-auto">
                    <NeoCard title="FEEDBACK & LAPORAN" className="bg-white">
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <NeoInput placeholder="Nama Kamu" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
                                <NeoInput placeholder="Subjek" value={contact.title} onChange={e => setContact({...contact, title: e.target.value})} />
                            </div>
                            <NeoTextArea placeholder="Tulis pesan singkat..." rows={2} value={contact.message} onChange={e => setContact({...contact, message: e.target.value})} />
                            <NeoButton onClick={sendContact} disabled={loading} variant="dark" className="w-full">
                                {loading ? "MENGIRIM..." : <><Mail size={16}/> KIRIM PESAN</>}
                            </NeoButton>
                        </div>
                    </NeoCard>
                </div>
                
                <footer className="text-center text-xs font-bold text-gray-400 pb-4">
                    &copy; 2025 KAAI TOOLS by AKA. All rights reserved.
                </footer>
            </div>
        </PageWrapper>
    );
};

export default Home;
