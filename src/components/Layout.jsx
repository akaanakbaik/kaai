import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Github } from 'lucide-react';

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'bg-neo-yellow' : 'bg-white';

    const NavLink = ({ to, text }) => (
        <Link to={to} onClick={() => setIsOpen(false)}>
            <div className={`border-2 border-black px-4 py-2 font-bold shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo transition-all ${isActive(to)}`}>
                {text}
            </div>
        </Link>
    );

    return (
        <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto overflow-x-hidden">
            {/* SEO & Logo Assets handled in App.jsx/Helmet */}
            
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b-2 border-black bg-white px-4 py-3 md:px-8">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img 
                            src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                            alt="Logo" 
                            className="h-10 w-10 border-2 border-black rounded-full group-hover:rotate-12 transition-transform"
                        />
                        <span className="text-2xl font-black tracking-tighter italic bg-neo-black text-white px-2 group-hover:bg-neo-pink transition-colors">
                            KAAI.
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-4">
                        <NavLink to="/" text="HOME" />
                        <NavLink to="/ytdl" text="YTDL" />
                        <NavLink to="/docs" text="API DOCS" />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden border-2 border-black p-1 bg-neo-green shadow-neo-sm" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0 }} animate={{ height: 'auto' }}
                        className="md:hidden mt-4 flex flex-col gap-3 border-t-2 border-black pt-4"
                    >
                        <NavLink to="/" text="HOME" />
                        <NavLink to="/ytdl" text="YTDL" />
                        <NavLink to="/docs" text="API DOCS" />
                    </motion.div>
                )}
            </nav>

            {/* Content Wrapper */}
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-7xl">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-black bg-neo-white mt-auto">
                <div className="border-b-2 border-black bg-neo-pink py-2 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap font-bold text-sm md:text-base">
                        MADE WITH ❤️ AND CODE BY AKA 🇮🇩 🇵🇸 — FREE YOUTUBE DOWNLOADER — NO ADS — OPEN API — 
                        MADE WITH ❤️ AND CODE BY AKA 🇮🇩 🇵🇸 — FREE YOUTUBE DOWNLOADER — NO ADS — OPEN API —
                    </div>
                </div>
                <div className="p-8 text-center">
                    <div className="flex justify-center gap-4 mb-4">
                         {/* Social Links placeholder */}
                         <a href="#" className="p-2 border-2 border-black bg-neo-blue shadow-neo-sm hover:shadow-neo"><Github size={20}/></a>
                    </div>
                    <p className="font-bold text-lg">crafted by aka 🇮🇩 🇵🇸</p>
                    <p className="text-sm font-medium opacity-70 mt-2">© {new Date().getFullYear()} Kaai Project.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
