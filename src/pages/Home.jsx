import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NeoButton, NeoCard, NeoInput } from '../components/NeoUI';
import { ArrowRight, Download, Send, Zap, Code } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
    const [contact, setContact] = useState({ name: '', title: '', message: '' });
    const [loading, setLoading] = useState(false);

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
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-10">
                <div className="inline-block bg-neo-green border-2 border-black px-4 py-1 font-bold shadow-neo-sm rotate-[-2deg]">
                    v3.0.0 STABLE RELEASE
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                    DOWNLOAD VIDEO <br/> 
                    <span className="text-white text-stroke bg-neo-black px-2">TANPA RIBET.</span>
                </h1>
                <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto">
                    Platform All-in-One untuk kebutuhan multimedia Anda. Gratis, Cepat, dan Tersedia API Publik.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                    <Link to="/ytdl">
                        <NeoButton className="w-full md:w-auto text-lg" variant="primary">
                            <Download /> MULAI UNDUH
                        </NeoButton>
                    </Link>
                    <Link to="/docs">
                        <NeoButton className="w-full md:w-auto text-lg" variant="secondary">
                            <Code /> DOKUMENTASI API
                        </NeoButton>
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'YTDL', icon: <Download size={40}/>, desc: 'Download MP3 & MP4 kualitas tinggi.', color: 'bg-neo-yellow', link: '/ytdl' },
                    { title: 'AI TOOLS', icon: <Zap size={40}/>, desc: 'Fitur AI canggih (Coming Soon).', color: 'bg-neo-pink', link: '/ai' },
                    { title: 'OPEN API', icon: <Code size={40}/>, desc: 'Integrasi gratis untuk Developer.', color: 'bg-neo-blue', link: '/docs' }
                ].map((item, idx) => (
                    <Link key={idx} to={item.link} className="group">
                        <NeoCard className={`h-full flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer ${item.color}`}>
                            <div className="bg-white border-2 border-black p-4 rounded-full shadow-neo mb-4">
                                {item.icon}
                            </div>
                            <h2 className="text-2xl font-black mb-2">{item.title}</h2>
                            <p className="font-medium mb-4">{item.desc}</p>
                            <div className="mt-auto border-2 border-black bg-white px-4 py-1 text-sm font-bold group-hover:bg-black group-hover:text-white transition-colors">
                                AKSES SEKARANG ➜
                            </div>
                        </NeoCard>
                    </Link>
                ))}
            </section>

            {/* Contact Form */}
            <section className="max-w-2xl mx-auto">
                <NeoCard title="📩 KOTAK ADUAN & SARAN" color="bg-white">
                    <form onSubmit={handleContact} className="space-y-4">
                        <NeoInput 
                            label="Nama Pengirim" 
                            placeholder="Aka Anak Baik" 
                            value={contact.name}
                            onChange={e => setContact({...contact, name: e.target.value})}
                            required
                        />
                        <NeoInput 
                            label="Judul Laporan" 
                            placeholder="Link Error / Saran Fitur" 
                            value={contact.title}
                            onChange={e => setContact({...contact, title: e.target.value})}
                            required
                        />
                        <div>
                            <label className="mb-1 block font-bold text-sm bg-neo-black text-white w-fit px-2">Pesan</label>
                            <textarea 
                                className="w-full border-2 border-black p-3 font-bold shadow-neo-sm focus:outline-none focus:bg-yellow-50 h-32"
                                placeholder="Jelaskan detail laporan anda..."
                                value={contact.message}
                                onChange={e => setContact({...contact, message: e.target.value})}
                                required
                            />
                        </div>
                        <NeoButton type="submit" variant="dark" className="w-full" disabled={loading}>
                            {loading ? 'MENGIRIM...' : <><Send size={18} /> KIRIM LAPORAN</>}
                        </NeoButton>
                    </form>
                </NeoCard>
            </section>
        </div>
    );
};

export default Home;
