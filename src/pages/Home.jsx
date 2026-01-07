import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NeoCard, NeoButton, NeoInput, NeoTextArea, PageWrapper } from '../components/NeoUI';
import { Youtube, MessageSquare, Camera, BookOpen, Terminal, Download, Zap, Loader, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const LOGO_URL = 'https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg';
const EGG_IMG = 'https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/wujud_asli.jpg';
const EGG_AUDIO = 'https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/audio.mp3';

const Home = () => {
  const [contact, setContact] = useState({ name: '', title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const audioRef = useRef(new Audio(EGG_AUDIO));

  const sendContact = useCallback(async () => {
    if (!contact.name || !contact.message) return toast.error('Lengkapi data dulu');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      toast.success('Pesan terkirim!');
      setContact({ name: '', title: '', message: '' });
    } catch { toast.error('Gagal mengirim'); } 
    finally { setLoading(false); }
  }, [contact]);

  const handleEasterEgg = useCallback(() => {
    if (isLocked) return;
    setClickCount(p => {
      const next = p + 1;
      if (next === 5) {
        setIsLocked(true);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        setTimeout(() => { setIsLocked(false); setClickCount(0); }, 3200);
        return 5;
      }
      return next;
    });
  }, [isLocked]);

  return (
    <PageWrapper>
      <Helmet><title>KAAI Tools</title></Helmet>

      {/* EASTER EGG OVERLAY */}
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          >
            <motion.img 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 1.2, opacity: 0 }}
              src={EGG_IMG} 
              className="max-w-full max-h-[80vh] rounded-xl shadow-2xl border-4 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center pt-6 pb-10 text-center">
        <motion.div
          whileTap={{ rotate: 360, scale: 0.95 }}
          onClick={handleEasterEgg}
          className="relative mb-5 cursor-pointer group"
        >
          <div className="absolute inset-0 bg-black rounded-full translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
          <img src={LOGO_URL} alt="Logo" className="relative w-24 h-24 rounded-full border-3 border-black bg-white object-cover z-10" />
          
          {clickCount > 0 && clickCount < 5 && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-black border-2 border-black z-20"
            >
              {clickCount}
            </motion.div>
          )}
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-2">KAAI</h1>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white border-2 border-gray-200 px-3 py-1 rounded-full">
          Development Utilities
        </p>

        <div className="flex gap-3 mt-6">
          <Link to="/docs">
            <NeoButton variant="dark" className="h-9 px-5 text-xs rounded-lg shadow-none border-2">
              <BookOpen size={14} /> DOCS
            </NeoButton>
          </Link>
          <NeoButton variant="white" className="h-9 px-5 text-xs rounded-lg border-gray-300 text-gray-400 cursor-default shadow-none">
            v15.5
          </NeoButton>
        </div>
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-12 px-1">
        {[
          { to: '/allindl', icon: Download, color: 'bg-blue-400', label: 'ALL-IN-ONE', sub: 'Universal' },
          { to: '/ytdl', icon: Youtube, color: 'bg-yellow-400', label: 'YOUTUBE', sub: 'Converter' },
          { to: '/ai/chat', icon: MessageSquare, color: 'bg-green-400', label: 'AI CHAT', sub: 'Assistant' },
          { to: '/ssweb', icon: Camera, color: 'bg-pink-400', label: 'SSWEB', sub: 'Screenshot' }
        ].map((item, idx) => (
          <Link to={item.to} key={idx} className="group">
            <motion.div 
              whileHover={{ y: -4 }} 
              whileTap={{ scale: 0.98 }}
              className={`h-32 border-2 border-black rounded-xl p-3 flex flex-col justify-between relative overflow-hidden ${item.color} shadow-[3px_3px_0px_0px_black] transition-all`}
            >
              <item.icon size={64} className="absolute -bottom-4 -right-4 opacity-20 rotate-12 text-black" />
              <div className="bg-white/90 backdrop-blur-sm w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black">
                <item.icon size={16} className="text-black" />
              </div>
              <div className="relative z-10">
                <h3 className="font-black text-sm leading-none">{item.label}</h3>
                <p className="text-[9px] font-bold opacity-60 uppercase mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* CONTACT FORM */}
      <div className="max-w-md mx-auto mb-10 px-2">
        <NeoCard className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-gray-100 pb-2">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <h3 className="font-black text-xs uppercase tracking-wider">Contact Support</h3>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="Name" 
                value={contact.name}
                onChange={e => setContact({...contact, name: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-black transition-colors"
              />
              <input 
                placeholder="Topic" 
                value={contact.title}
                onChange={e => setContact({...contact, title: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <textarea 
              placeholder="Message..." 
              rows={3}
              value={contact.message}
              onChange={e => setContact({...contact, message: e.target.value})}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-black transition-colors resize-none"
            />
            <button 
              onClick={sendContact}
              disabled={loading}
              className="w-full bg-black text-white h-10 rounded-lg text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size={14} className="animate-spin" /> : <><Send size={14} /> Send Message</>}
            </button>
          </div>
        </NeoCard>
      </div>

      <footer className="text-center border-t-2 border-dashed border-gray-200 pt-6 pb-2">
        <p className="font-bold text-[10px] text-gray-400">
          CRAFTED BY AKA 🇮🇩 🇵🇸
        </p>
      </footer>
    </PageWrapper>
  );
};

export default Home;
