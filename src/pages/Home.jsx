import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NeoButton, NeoCard, NeoInput, PageWrapper } from '../components/NeoUI';
import { ArrowRight, Download, Send, Zap, Code, Star, Terminal } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
    const [contact, setContact] = useState({ name: '', title: '', message: '' });
    const [loading, setLoading] = useState(false);
    
    // Logo untuk Chat Avatar
    const AVATAR_URL = "https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg";

    const handleContact = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, contact);
            toast.success('Laporan berhasil dikirim!');
            setContact({ name: '', title: '', message: '' });
        } catch (error) {
            toast.error('Gagal mengirim laporan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <div className="space-y-20">
                {/* HERO SECTION */}
                <section className="text-center space-y-8 py-10 md:py-20 relative">
                    {/* Badge Versi */}
                    <div className="inline-block bg-[#A3E635] border-2 border-black px-6 py-2 font-black text-sm shadow-[4px_4px_0px_0px_black] rotate-[-3deg] animate-bounce">
                        VERSI 3.0.0 RELEASE
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tight">
                        SATU WEB.<br/>
                        <span className="text-white bg-black px-4 transform skew-x-[-10deg] inline-block mt-2">SEMUA BISA.</span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto text-gray-700">
                        Download video YouTube tanpa ribet, tanpa iklan sampah, dan gratis selamanya. Dibuat dengan cinta untuk Indonesia.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-6 pt-6">
                        <Link to="/ytdl">
                            <NeoButton variant="primary" className="w-full md:w-auto text-xl py-4">
                                <Download size={24}/> MULAI DOWNLOAD
                            </NeoButton>
                        </Link>
                        <Link to="/docs">
                            <NeoButton variant="dark" className="w-full md:w-auto text-xl py-4">
                                <Code size={24}/> COBA API
                            </NeoButton>
                        </Link>
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'YTDL Super Cepat', icon: <Download size={48}/>, text: 'Download MP3 & MP4 kualitas tinggi dalam hitungan detik.', color: 'bg-[#60A5FA]', link: '/ytdl' },
                        { title: 'AI Assistant', icon: <Zap size={48}/>, text: 'Kecerdasan buatan untuk membantu tugas anda (Coming Soon).', color: 'bg-[#F472B6]', link: '/ai' },
                        { title: 'Developer API', icon: <Terminal size={48}/>, text: 'Integrasi fitur kami ke aplikasi anda secara gratis.', color: 'bg-[#A3E635]', link: '/docs' }
                    ].map((item, idx) => (
                        <Link key={idx} to={item.link} className="group">
                            <NeoCard className={`h-full flex flex-col items-center text-center cursor-pointer transition-transform group-hover:-translate-y-2 ${item.color}`}>
                                <div className="bg-white border-2 border-black p-5 rounded-full shadow-[4px_4px_0px_0px_black] mb-6 group-hover:rotate-12 transition-transform">
                                    {item.icon}
                                </div>
                                <h2 className="text-2xl font-black mb-3 italic">{item.title}</h2>
                                <p className="font-medium mb-6 leading-relaxed">{item.text}</p>
                                <div className="mt-auto bg-black text-white px-4 py-2 font-bold text-sm w-full group-hover:bg-white group-hover:text-black border-2 border-transparent group-hover:border-black transition-colors">
                                    BUKA FITUR ➜
                                </div>
                            </NeoCard>
                        </Link>
                    ))}
                </section>

                {/* CONTACT SECTION (CHAT STYLE) */}
                <section className="max-w-3xl mx-auto">
                    <NeoCard title="📩 LAYANAN ADUAN & SARAN" color="bg-white">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar Chat AI */}
                            <div className="hidden md:flex flex-col items-center gap-2 min-w-[100px]">
                                <img src={AVATAR_URL} alt="Admin" className="w-20 h-20 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_black] object-cover"/>
                                <span className="bg-[#FFDC58] border-2 border-black px-2 text-xs font-bold py-1">ADMIN / AI</span>
                            </div>

                            <form onSubmit={handleContact} className="space-y-5 flex-grow">
                                <div className="bg-[#f0f0f0] border-2 border-black p-4 mb-4 relative">
                                    <div className="absolute -left-2 top-4 w-4 h-4 bg-[#f0f0f0] border-l-2 border-b-2 border-black transform rotate-45 hidden md:block"></div>
                                    <p className="font-bold">Halo! Ada yang bisa saya bantu? Silakan kirim laporan error atau saran fitur di bawah ini ya! 👇</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <NeoInput 
                                        label="Nama Kamu" 
                                        placeholder="Tulis nama..." 
                                        value={contact.name}
                                        onChange={e => setContact({...contact, name: e.target.value})}
                                        required
                                    />
                                    <NeoInput 
                                        label="Judul Laporan" 
                                        placeholder="Error / Saran..." 
                                        value={contact.title}
                                        onChange={e => setContact({...contact, title: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="group">
                                    <label className="mb-2 block font-bold text-sm bg-black text-white w-fit px-3 py-1 transform -rotate-1 group-focus-within:rotate-0 transition-transform">Isi Pesan</label>
                                    <textarea 
                                        className="w-full border-2 border-black p-4 font-bold bg-[#f9f9f9] focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_black] transition-all h-32"
                                        placeholder="Jelaskan detailnya di sini..."
                                        value={contact.message}
                                        onChange={e => setContact({...contact, message: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <NeoButton type="submit" variant="accent" className="w-full" disabled={loading}>
                                    {loading ? 'MENGIRIM PESAN...' : <><Send size={20} /> KIRIM LAPORAN SEKARANG</>}
                                </NeoButton>
                            </form>
                        </div>
                    </NeoCard>
                </section>
            </div>
        </PageWrapper>
    );
};

export default Home;
