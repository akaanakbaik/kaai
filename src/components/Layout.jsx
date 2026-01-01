import React, { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';

const LOGO_URL =
  'https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg';

const NavLink = memo(({ to, text, onClick, active }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileHover={{ scale: 1.05, rotate: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`border-2 border-black px-4 py-2 font-black uppercase tracking-wider
        ${
          active
            ? 'bg-[#A3E635] shadow-[4px_4px_0px_0px_black]'
            : 'bg-white hover:bg-gray-100'
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

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6] text-black overflow-x-hidden selection:bg-[#F472B6] selection:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b-2 border-black bg-white/90 backdrop-blur-md px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              src={LOGO_URL}
              alt="KAAI"
              className="h-12 w-12 rounded-full border-2 border-black object-cover shadow-[2px_2px_0px_black]"
            />
            <div>
              <span className="block bg-black px-2 py-1 text-2xl font-black italic text-white -skew-x-12">
                KAAI.
              </span>
              <span className="mt-1 block text-xs font-bold">
                Web Downloader Pro
              </span>
            </div>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex gap-6">
            <NavLink to="/" text="Home" active={pathname === '/'} />
            <NavLink to="/allindl" text="🔥 All-in-One" active={pathname === '/allindl'} />
            <NavLink to="/ytdl" text="YTDL" active={pathname === '/ytdl'} />
            <NavLink to="/docs" text="API Docs" active={pathname === '/docs'} />
          </div>

          {/* MOBILE BTN */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden border-2 border-black bg-[#FFDC58] p-2 shadow-[3px_3px_0_black]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 flex flex-col gap-3 border-t-2 border-black bg-white pt-4 pb-2"
            >
              <NavLink to="/" text="🏠 Home" onClick={closeMenu} />
              <NavLink to="/allindl" text="🔥 All-in-One DL" onClick={closeMenu} />
              <NavLink to="/ytdl" text="📺 YouTube DL" onClick={closeMenu} />
              <NavLink to="/docs" text="📜 Docs" onClick={closeMenu} />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN */}
      <main className="relative mx-auto w-full max-w-7xl flex-grow px-4 py-8 md:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10">{children}</div>
      </main>

      {/* FOOTER */}
      <footer className="border-t-2 border-black bg-[#1a1a1a] text-white text-center p-8">
        <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold">
          Dibuat dengan
          <Heart size={16} className="fill-red-500 text-red-500 animate-pulse" />
          dan Code
        </p>
        <p className="text-xs uppercase tracking-wider opacity-70">
          © 2026 • Crafted by Aka • Indonesia 🇮🇩 | Free Palestine 🇵🇸
        </p>
      </footer>
    </div>
  );
};

export default Layout;
