import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Heart } from 'lucide-react';

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // URL Logo sesuai request
    const LOGO_URL = "https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg";

    const NavLink = ({ to, text }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} onClick={() => setIsOpen(false)}>
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                        border-2 border-black px-4 py-2 font-black uppercase tracking-wider
                        ${isActive ? 'bg-[#A3E635] shadow-[4px_4px_0px_0px_black]' : 'bg-white hover:bg-gray-100'}
                    `}
                >
                    {text}
                </motion.div>
            </Link>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F3F4F6] text-black font-sans overflow-x-hidden selection:bg-[#F472B6] selection:text-white">
            
            {/* Navbar Sticky */}
            <nav className="sticky top-0 z-50 border-b-2 border-black bg-white/90 backdrop-blur-md px-4 py-3 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.img 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            src={LOGO_URL} 
                            alt="Kaai Logo" 
                            className="h-12 w-12 border-2 border-black rounded-full object-cover shadow-[2px_2px_0px_0px_black]"
                        />
                        <div className="flex flex-col">
                            <span className="text-2xl font-black italic leading-none bg-black text-white px-2 py-1 transform -skew-x-12">KAAI.</span>
                            <span className="text-xs font-bold mt-1">Web Downloader Pro</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6 items-center">
                        <NavLink to="/" text="Home" />
                        <NavLink to="/allindl" text="🔥 All-in-One" /> {/* <--- TAMBAH LINK INI */}
                        <NavLink to="/ytdl" text="YTDL" />
                        <NavLink to="/docs" text="API Docs" />
                    </div>

                    {/* Mobile Toggle */}
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 border-2 border-black bg-[#FFDC58] shadow-[3px_3px_0px_0px_black]"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t-2 border-black mt-4 flex flex-col gap-3 pt-4 pb-2 bg-white"
                        >
                            <NavLink to="/" text="🏠 Home" />
                            <NavLink to="/allindl" text="🔥 All-In-One DL" /> {/* <--- TAMBAH LINK INI JUGA */}
                            <NavLink to="/ytdl" text="📺 YouTube DL" />
                            <NavLink to="/docs" text="📜 Documentation" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content dengan background pattern */}
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-7xl relative">
                {/* Dekorasi Background Dot */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-black bg-white mt-auto">
                <div className="bg-[#F472B6] border-b-2 border-black py-3 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap font-black text-white text-lg tracking-widest flex gap-8">
                        <span>⚡ CEPAT</span> <span>🔒 AMAN</span> <span>💎 GRATIS</span> 
                        <span>⚡ CEPAT</span> <span>🔒 AMAN</span> <span>💎 GRATIS</span>
                        <span>⚡ CEPAT</span> <span>🔒 AMAN</span> <span>💎 GRATIS</span>
                        <span>⚡ CEPAT</span> <span>🔒 AMAN</span> <span>💎 GRATIS</span>
                    </div>
                </div>
                <div className="p-8 text-center bg-[#1a1a1a] text-white">
                    <p className="font-bold flex items-center justify-center gap-2 mb-2">
                        Dibuat dengan <Heart size={16} className="text-red-500 fill-red-500 animate-pulse"/> dan Code
                    </p>
                    <p className="text-sm opacity-70 tracking-widest uppercase">Crafted by Aka 🇮🇩 🇵🇸</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
