import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  NeoCard,
  NeoButton,
  NeoInput,
  NeoTextArea,
  PageWrapper,
} from '../components/NeoUI';
import {
  Youtube,
  MessageSquare,
  Camera,
  BookOpen,
  Terminal,
  Download,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const LOGO_URL =
  'https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg';

const Home = () => {
  const [contact, setContact] = useState({
    name: '',
    title: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const sendContact = useCallback(async () => {
    if (!contact.name || !contact.message) {
      toast.error('Data belum lengkap!');
      return;
    }
    setLoading(true);
    try {
      // Simulasi kirim
      await new Promise(r => setTimeout(r, 1000));
      toast.success('Pesan terkirim!');
      setContact({ name: '', title: '', message: '' });
    } catch {
      toast.error('Gagal mengirim pesan.');
    } finally {
      setLoading(false);
    }
  }, [contact]);

  const handleEasterEgg = useCallback(() => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next === 5) {
        toast('🎉 DEV MODE UNLOCKED!', {
          icon: '🧑‍💻',
          style: { background: '#000', color: '#fff' },
        });
      }
      if (next === 10) {
        toast('🇵🇸 FREE PALESTINE!', {
          icon: '❤️',
          duration: 4000,
        });
        return 0;
      }
      return next;
    });
  }, []);

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI - Utilities</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center pt-8 pb-12 text-center space-y-6">
        <motion.div
          whileTap={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          onClick={handleEasterEgg}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-black rounded-full translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
          <img
            src={LOGO_URL}
            alt="KAAI Logo"
            className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black z-10 bg-white object-cover"
          />
          {clickCount > 0 && clickCount < 5 && (
            <div className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-black animate-bounce border-2 border-black">
              x{clickCount}
            </div>
          )}
        </motion.div>

        <div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none select-none text-black">
            KAAI
          </h1>
          <p className="text-sm md:text-base font-bold text-gray-500 mt-2 bg-white px-3 py-1 rounded-full border-2 border-gray-200 inline-block">
            SIMPLE • FAST • SECURE
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Link to="/docs">
            <NeoButton
              variant="dark"
              className="rounded-xl px-6 h-10 text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            >
              <BookOpen size={14} /> DOCUMENTATION
            </NeoButton>
          </Link>

          <NeoButton
            variant="white"
            className="rounded-xl px-6 h-10 text-xs text-gray-600 cursor-default border-gray-300"
          >
            <Terminal size={14} /> V.15.5 STABLE
          </NeoButton>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16 px-2 max-w-5xl mx-auto"
      >
        <Link to="/allindl" className="group">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
            <NeoCard
              title="01. UNIVERSAL DOWNLOADER"
              className="bg-[#60A5FA] relative overflow-hidden h-full border-3"
            >
              <Download
                size={100}
                className="absolute -bottom-6 -right-6 opacity-20 rotate-12 text-black"
              />
              <div className="flex items-center gap-5 py-4 relative z-10">
                <div className="p-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_black]">
                  <Zap size={28} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="font-black text-2xl leading-none mb-1">
                    ALL-IN-ONE
                  </h3>
                  <p className="font-bold text-black/60 text-xs">
                    TikTok, Instagram, Facebook, Twitter
                  </p>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </Link>

        <Link to="/ytdl" className="group">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
            <NeoCard
              title="02. MEDIA CONVERTER"
              className="bg-[#FFDC58] relative overflow-hidden h-full border-3"
            >
              <Youtube
                size={100}
                className="absolute -bottom-6 -right-6 opacity-20 rotate-12 text-black"
              />
              <div className="flex items-center gap-5 py-4 relative z-10">
                <div className="p-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_black]">
                  <Youtube size={28} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-black text-2xl leading-none mb-1">
                    YOUTUBE DL
                  </h3>
                  <p className="font-bold text-black/60 text-xs">
                    High Quality Video & Audio
                  </p>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </Link>

        <Link to="/ai/chat" className="group">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
            <NeoCard
              title="03. ARTIFICIAL INTELLIGENCE"
              className="bg-[#A3E635] relative overflow-hidden h-full border-3"
            >
              <MessageSquare
                size={100}
                className="absolute -bottom-6 -right-6 opacity-20 rotate-12 text-black"
              />
              <div className="flex items-center gap-5 py-4 relative z-10">
                <div className="p-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_black]">
                  <MessageSquare size={28} className="text-green-700" />
                </div>
                <div>
                  <h3 className="font-black text-2xl leading-none mb-1">
                    KAAI CHAT
                  </h3>
                  <p className="font-bold text-black/60 text-xs">
                    Smart Assistant Powered by AI
                  </p>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </Link>

        <Link to="/ssweb" className="group">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
            <NeoCard
              title="04. UTILITIES"
              className="bg-[#FF90E8] relative overflow-hidden h-full border-3"
            >
              <Camera
                size={100}
                className="absolute -bottom-6 -right-6 opacity-20 rotate-12 text-black"
              />
              <div className="flex items-center gap-5 py-4 relative z-10">
                <div className="p-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_black]">
                  <Camera size={28} className="text-purple-700" />
                </div>
                <div>
                  <h3 className="font-black text-2xl leading-none mb-1">
                    SSWEB PRO
                  </h3>
                  <p className="font-bold text-black/60 text-xs">
                    Full Page Website Screenshot
                  </p>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </Link>
      </motion.div>

      <div className="max-w-lg mx-auto mb-16">
        <NeoCard title="CONTACT SUPPORT" className="bg-white border-3">
          <div className="flex flex-col gap-3 p-2">
            <div className="flex gap-3">
              <NeoInput
                placeholder="Name"
                value={contact.name}
                onChange={e =>
                  setContact({ ...contact, name: e.target.value })
                }
              />
              <NeoInput
                placeholder="Subject"
                value={contact.title}
                onChange={e =>
                  setContact({ ...contact, title: e.target.value })
                }
              />
            </div>
            <NeoTextArea
              placeholder="Your message here..."
              rows={3}
              value={contact.message}
              onChange={e =>
                setContact({ ...contact, message: e.target.value })
              }
            />
            <NeoButton
              onClick={sendContact}
              disabled={loading}
              variant="dark"
              className="w-full h-12 text-sm shadow-none active:translate-y-1"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : 'SEND MESSAGE'}
            </NeoButton>
          </div>
        </NeoCard>
      </div>

      <footer className="text-center pt-8 border-t-2 border-black/5 pb-4">
        <p className="font-black text-xs md:text-sm text-gray-400">
          CRAFTED BY AKA 🇮🇩 🇵🇸
        </p>
      </footer>

    </PageWrapper>
  );
};

export default Home;
