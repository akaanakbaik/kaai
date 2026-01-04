import React, { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, ExternalLink } from 'lucide-react';

const LOGO_URL = 'https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg';

const NavLink = memo(({ to, text, onClick, active }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`border-2 border-black px-4 py-2 font-black uppercase tracking-wider text-sm transition-all duration-200 ${
        active 
          ? 'bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_black] translate-x-[-1px] translate-y-[-1px]' 
          : 'bg-white text-gray-800 hover:bg-gray-50'
      }`}
    >
      {text}
    </motion.div>
  </Link>
));

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen(v => !v), []);

  const currentYear = new Date().getFullYear();
  const displayYear = currentYear > 2025 ? `2025 - ${currentYear}` : '2025';

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6] text-black overflow-x-hidden selection:bg-[#FF90E8] selection:text-black">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b-3 border-black bg-white/90 backdrop-blur-md px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="relative"
            >
              <img 
                src={LOGO_URL} 
                alt="KAAI" 
                className="h-12 w-12 rounded-full border-2 border-black object-cover shadow-[2px_2px_0px_black] bg-white" 
              />
            </motion.div>
            
            <div className="flex flex-col">
              <span className="bg-black px-2 py-0.5 text-xl font-black italic text-white -skew-x-12 transform group-hover:scale-105 transition-transform origin-left">
                KAAI.
              </span>
              <span className="text-[10px] font-bold tracking-widest mt-0.5 pl-1">
                WEB DOWNLOADER
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-4 items-center">
            <NavLink to="/" text="Home" active={pathname === '/'} />
            <NavLink to="/ytdl" text="YTDL Pro" active={pathname === '/ytdl'} />
            <a href="https://github.com/akaanakbaik" target="_blank" rel="noopener noreferrer">
               <motion.button
                 whileHover={{ y: -2 }}
                 className="flex items-center gap-2 px-4 py-2 font-bold text-sm hover:underline decoration-2 underline-offset-4"
               >
                 GitHub <ExternalLink size={14} />
               </motion.button>
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden border-2 border-black bg-[#FFDC58] p-2 shadow-[3px_3px_0_black] rounded-md active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
          >
            {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </motion.button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 flex flex-col gap-3 border-t-2 border-black pt-4 pb-2"
            >
              <NavLink to="/" text="🏠 Home" onClick={closeMenu} />
              <NavLink to="/ytdl" text="📺 YouTube DL" onClick={closeMenu} />
              <div className="border-t-2 border-dashed border-gray-300 my-2" />
              <p className="text-center text-xs font-bold text-gray-400">© KAAI PROJECTS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative mx-auto w-full max-w-7xl flex-grow px-4 py-8 md:py-12">
        {/* Background Pattern */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', 
            backgroundSize: '24px 24px', 
          }} 
        />
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t-3 border-black bg-[#111] text-white text-center py-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#A3E635]"></div>
        
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <p className="flex items-center justify-center gap-2 text-sm font-bold tracking-wide">
            CREATED WITH <Heart size={16} className="fill-red-500 text-red-500 animate-bounce" /> BY AKA
          </p>
          
          <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
            <p className="text-[10px] md:text-xs font-mono tracking-widest text-gray-300">
              © {displayYear} • KAAI PROJECT • INDONESIA 🇮🇩
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Layout;
