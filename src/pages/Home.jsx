import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NeoCard, NeoButton, NeoInput, NeoTextArea, PageWrapper } from '../components/NeoUI';
import { Youtube, MessageSquare, Camera, BookOpen, Terminal, Download, Zap, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const containerVariants = {
  show: { transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 }
};

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
    if (!contact.name || !contact.message) {
      toast.error('Data belum lengkap');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      toast.success('Pesan terkirim!');
      setContact({ name: '', title: '', message: '' });
    } catch {
      toast.error('Gagal mengirim');
    } finally {
      setLoading(false);
    }
  }, [contact]);

  const handleEasterEgg = useCallback(() => {
    if (isLocked) return;

    setClickCount(prev => {
      const next = prev + 1;
      
      if (next === 5) {
        setIsLocked(true);
        audioRef.current.volume = 1.0;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        
        setTimeout(() => {
          setIsLocked(false);
          setClickCount(0);
        }, 3200); 
        return 5;
      }
      return next;
    });
  }, [isLocked]);

  return (
    <PageWrapper>
      <Helmet><title>KAAI - Utilities</title></Helmet>

      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center cursor-not-allowed"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 1.2 } }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative"
            >
              <img 
                src={EGG_IMG} 
                alt="Secret" 
                className="w-64 md:w-80 rounded-2xl border-4 border-white shadow-[0_0_50px_rgba(255,255,255,0.5)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center pt-4 pb-8 text-center space-y-4">
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={handleEasterEgg}
          className="relative group cursor-pointer select-none"
        >
          <div className="absolute inset-0 bg-black rounded-full translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
          <img
            src={LOGO_URL}
            alt="Logo"
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-3 border-black z-10 bg-white object-cover"
          />
        </motion.div>

        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-black">
            KAAI
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-gray-500 mt-1 bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">
            SIMPLE • FAST • SECURE
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/docs">
            <NeoButton variant="dark" className="h-8 text-[10px] rounded-lg px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
              <BookOpen size={12} /> DOCS
            </NeoButton>
          </Link>
          <NeoButton variant="white" className="h-8 text-[10px] rounded-lg px-4 text-gray-500 cursor-default border-gray-300">
            <Terminal size={12} /> V.15.5
          </NeoButton>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 px-1 max-w-4xl mx-auto"
      >
        <Link to="/allindl" className="group col-span-1">
          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <NeoCard className="bg-[#60A5FA] h-28 md:h-32 flex flex-col items-center justify-center relative overflow-hidden border-2 p-2">
              <Download size={60} className="absolute -bottom-4 -right-4 opacity-20 rotate-12 text-black" />
              <div className="bg-white p-1.5 rounded border-2 border-black shadow-sm mb-2 z-10">
                <Zap size={18} className="text-blue-600" />
              </div>
              <h3 className="font-black text-sm md:text-base leading-none z-10">ALL-IN-ONE</h3>
              <p className="text-[8px] md:text-[9px] font-bold opacity-60 z-10">Universal</p>
            </NeoCard>
          </motion.div>
        </Link>

        <Link to="/ytdl" className="group col-span-1">
          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <NeoCard className="bg-[#FFDC58] h-28 md:h-32 flex flex-col items-center justify-center relative overflow-hidden border-2 p-2">
              <Youtube size={60} className="absolute -bottom-4 -right-4 opacity-20 rotate-12 text-black" />
              <div className="bg-white p-1.5 rounded border-2 border-black shadow-sm mb-2 z-10">
                <Youtube size={18} className="text-red-600" />
              </div>
              <h3 className="font-black text-sm md:text-base leading-none z-10">YOUTUBE</h3>
              <p className="text-[8px] md:text-[9px] font-bold opacity-60 z-10">Video & Audio</p>
            </NeoCard>
          </motion.div>
        </Link>

        <Link to="/ai/chat" className="group col-span-1">
          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <NeoCard className="bg-[#A3E635] h-28 md:h-32 flex flex-col items-center justify-center relative overflow-hidden border-2 p-2">
              <MessageSquare size={60} className="absolute -bottom-4 -right-4 opacity-20 rotate-12 text-black" />
              <div className="bg-white p-1.5 rounded border-2 border-black shadow-sm mb-2 z-10">
                <MessageSquare size={18} className="text-green-700" />
              </div>
              <h3 className="font-black text-sm md:text-base leading-none z-10">AI CHAT</h3>
              <p className="text-[8px] md:text-[9px] font-bold opacity-60 z-10">Assistant</p>
            </NeoCard>
          </motion.div>
        </Link>

        <Link to="/ssweb" className="group col-span-1">
          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <NeoCard className="bg-[#FF90E8] h-28 md:h-32 flex flex-col items-center justify-center relative overflow-hidden border-2 p-2">
              <Camera size={60} className="absolute -bottom-4 -right-4 opacity-20 rotate-12 text-black" />
              <div className="bg-white p-1.5 rounded border-2 border-black shadow-sm mb-2 z-10">
                <Camera size={18} className="text-purple-700" />
              </div>
              <h3 className="font-black text-sm md:text-base leading-none z-10">SSWEB</h3>
              <p className="text-[8px] md:text-[9px] font-bold opacity-60 z-10">Screenshot</p>
            </NeoCard>
          </motion.div>
        </Link>
      </motion.div>

      <div className="max-w-sm mx-auto mb-8 px-2">
        <NeoCard title="CONTACT" className="bg-white border-2">
          <div className="space-y-2 p-1">
            <div className="flex gap-2">
              <NeoInput
                placeholder="Name"
                value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })}
                className="text-xs h-8"
              />
              <NeoInput
                placeholder="Subject"
                value={contact.title}
                onChange={e => setContact({ ...contact, title: e.target.value })}
                className="text-xs h-8"
              />
            </div>
            <NeoTextArea
              placeholder="Message..."
              rows={2}
              value={contact.message}
              onChange={e => setContact({ ...contact, message: e.target.value })}
              className="text-xs min-h-[60px]"
            />
            <NeoButton
              onClick={sendContact}
              disabled={loading}
              variant="dark"
              className="w-full h-8 text-[10px]"
            >
              {loading ? <Loader className="animate-spin" size={12} /> : 'SEND'}
            </NeoButton>
          </div>
        </NeoCard>
      </div>

      <footer className="text-center pt-4 border-t-2 border-black/5">
        <p className="font-black text-[10px] text-gray-400">
          CRAFTED BY AKA 🇮🇩 🇵🇸
        </p>
      </footer>
    </PageWrapper>
  );
};

export default Home;
