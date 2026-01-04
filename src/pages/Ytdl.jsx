import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { 
  Search, Download, Music, Video, ArrowLeft, Loader, 
  AlertTriangle, Clipboard, Cpu, Clock, Server, 
  Terminal, Zap, CheckCircle, Activity, ChevronDown, Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

const Ytdl = () => {
  const [url, setUrl] = useState('')
  const [type, setType] = useState('video')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('idle')
  const [data, setData] = useState(null)
  const [logs, setLogs] = useState([])
  
  const wsRef = useRef(null)
  const logsEndRef = useRef(null)
  const resultRef = useRef(null)

  // --- WEBSOCKET CONNECTION ---
  useEffect(() => {
    const connectWs = () => {
      wsRef.current = new WebSocket('wss://api-ytdlpy.akadev.me/ws/progress')
      wsRef.current.onopen = () => console.log('✅ WS Connected')
      wsRef.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.msg) setLogs(prev => [...prev, `> ${msg.msg}`].slice(-8))
        } catch (e) {}
      }
      wsRef.current.onclose = () => setTimeout(connectWs, 3000)
    }
    connectWs()
    return () => wsRef.current?.close()
  }, [])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    if (data && stage === 'done' && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)
    }
  }, [data, stage])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) { setUrl(text); toast.success('Link pasted!') }
    } catch { toast.error('Access denied') }
  }

  const handleProcess = async () => {
    if (!url) return toast.error('Please enter URL')
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) return toast.error('Invalid YouTube URL')

    setLoading(true); setStage('processing'); setData(null)
    setLogs(['> Initializing System v5.0...', '> Handshake Established...'])

    try {
      const backendType = type === 'mp3' ? 'audio' : 'video'
      const res = await window.apiYtdl.post('/api/ytdl/info', 
        { url, type: backendType }, 
        { timeout: 600000 } // 10 Menit Timeout
      )

      if (!res.data?.status) throw new Error(res.data?.msg || 'Failed')
      
      setData(res.data.metadata)
      setStage('done')
      setLogs(prev => [...prev, '> SUCCESS: DATA READY'])
      toast.success('Done!')
    } catch (err) {
      setStage('error')
      const errMsg = err.response?.data?.msg || err.message || 'Server Busy'
      setLogs(prev => [...prev, `> ERROR: ${errMsg}`])
      toast.error(typeof errMsg === 'object' ? 'Limit Exceeded' : errMsg)
    } finally {
      setLoading(false)
    }
  }

  // --- COMPONENTS ---
  const currentYear = new Date().getFullYear()

  return (
    <PageWrapper>
      <Helmet><title>KAAI YTDL PRO</title></Helmet>
      
      <div className="flex flex-col min-h-screen">
        {/* MAIN CONTENT WRAPPER */}
        <div className="flex-grow w-full max-w-6xl mx-auto px-4 pt-6 md:pt-10">
          
          {/* --- TOP BAR (EXIT) --- */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-6"
          >
            <Link to="/">
              <motion.button 
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-2 border-black px-4 py-1.5 font-black text-xs shadow-[3px_3px_0px_0px_black] hover:bg-red-500 hover:text-white hover:border-black transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={14} strokeWidth={3} /> KEMBALI
              </motion.button>
            </Link>
          </motion.div>

          {/* --- BRANDING HEADER --- */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="relative"
              >
                <img 
                  src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                  alt="Logo" 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-black shadow-[4px_4px_0px_0px_black] object-cover bg-white"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white animate-pulse"></div>
              </motion.div>
              
              <div>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight select-none pt-2">
                  YTDL <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">KAAI</span>
                </h1>
                <p className="text-[10px] md:text-xs font-mono font-bold text-gray-500 bg-gray-100 inline-block px-2 py-0.5 border border-gray-300 rounded mt-1">
                  ULTIMATE DOWNLOADER SYSTEM V5.0
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto justify-end">
              <div className="bg-white border-2 border-black px-3 py-1.5 flex items-center gap-2 shadow-[3px_3px_0px_0px_black] rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold font-mono">SERVER ONLINE</span>
              </div>
            </div>
          </div>

          {/* --- MAIN INTERFACE GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* LEFT: CONTROLS */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7"
            >
              <NeoCard className="bg-white border-3 border-black p-0 shadow-[8px_8px_0px_0px_black] overflow-hidden rounded-xl">
                <div className="bg-gray-50 px-6 py-4 border-b-3 border-black flex justify-between items-center">
                  <h2 className="font-black text-sm md:text-base flex items-center gap-2">
                    <Terminal size={18} /> CONFIGURATION PANEL
                  </h2>
                  <div className="flex gap-1.5 opacity-80">
                    <div className="w-3 h-3 rounded-full bg-red-500 border border-black/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500 border border-black/20" />
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">YouTube URL Source</label>
                    <div className="relative group">
                      <input 
                        value={url} 
                        onChange={e => setUrl(e.target.value)} 
                        placeholder="https://youtu.be/..." 
                        disabled={loading} 
                        className="w-full pl-4 pr-12 h-14 text-base md:text-lg font-bold border-3 border-black rounded-lg focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_black] transition-all disabled:bg-gray-100 disabled:text-gray-400" 
                      />
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePaste} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-black hover:text-white rounded-md transition-colors border-2 border-transparent hover:border-black"
                      >
                        <Clipboard size={18} strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Format</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['video', 'mp3'].map((fmt) => (
                        <motion.button 
                          key={fmt}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setType(fmt)} 
                          className={`h-14 border-3 border-black rounded-lg font-black text-sm flex items-center justify-center gap-2 transition-all ${type === fmt ? 'bg-black text-white shadow-[2px_2px_0px_0px_gray] translate-y-1' : 'bg-white hover:bg-gray-50 shadow-[5px_5px_0px_0px_black] -translate-y-0.5'}`}
                        >
                          {fmt === 'mp3' ? <Music size={18} /> : <Video size={18} />} 
                          {fmt === 'mp3' ? 'AUDIO MP3' : 'VIDEO MP4'}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Execute Button */}
                  <motion.button 
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    onClick={handleProcess} 
                    disabled={loading} 
                    className={`w-full h-16 border-3 border-black rounded-xl font-black text-lg md:text-xl flex items-center justify-center gap-3 transition-all shadow-[6px_6px_0px_0px_black] ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400 shadow-none' : 'bg-red-600 text-white hover:bg-red-500'}`}
                  >
                    {loading ? <Loader className="animate-spin" size={24} /> : <Zap size={24} className="fill-white" />}
                    {loading ? 'PROCESSING REQUEST...' : 'START ENGINE'}
                  </motion.button>
                </div>
              </NeoCard>
            </motion.div>

            {/* RIGHT: TERMINAL */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 h-full"
            >
              <NeoCard className="bg-gray-900 border-3 border-black p-5 shadow-[8px_8px_0px_0px_gray] rounded-xl h-full min-h-[280px] flex flex-col relative overflow-hidden">
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
                
                <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2 relative z-10">
                  <span className="text-green-400 font-mono text-[10px] font-bold flex items-center gap-2">
                    <Activity size={12} className="animate-pulse" /> LIVE LOGS STREAM
                  </span>
                  {loading && <Loader size={12} className="animate-spin text-white" />}
                </div>
                
                <div className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-2 relative z-10">
                  {logs.length === 0 && !loading && (
                    <div className="text-gray-600 italic text-center mt-16 opacity-50">
                      // Waiting for input command...
                    </div>
                  )}
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      className="text-green-400 border-l-2 border-green-600 pl-3 py-0.5"
                    >
                      <span className="text-gray-500 mr-2">$</span>{log}
                    </motion.div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </NeoCard>
            </motion.div>
          </div>

          {/* --- RESULTS SECTION --- */}
          <div ref={resultRef}>
            <AnimatePresence mode="wait">
              {data && stage === 'done' && (
                <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.9 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="mt-16 mb-10"
                >
                  <div className="text-center mb-6">
                     <ChevronDown className="mx-auto animate-bounce text-black" size={32} />
                  </div>

                  <NeoCard className="bg-blue-50 border-3 md:border-4 border-black shadow-[10px_10px_0px_0px_black] md:shadow-[14px_14px_0px_0px_black] p-0 overflow-hidden rounded-2xl">
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <div className="w-full md:w-5/12 relative bg-black group h-64 md:h-auto overflow-hidden">
                         <motion.img 
                            whileHover={{ scale: 1.05 }}
                            src={data.thumbnail} 
                            alt="" 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" 
                         />
                         <div className="absolute top-4 left-4 z-10">
                            <span className="bg-black text-white border-2 border-white px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
                               {type === 'mp3' ? <Music size={12} /> : <Video size={12} />} {type.toUpperCase()}
                            </span>
                         </div>
                      </div>

                      {/* Info & Action */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
                        <div>
                          <h3 className="font-black text-xl md:text-3xl leading-snug mb-4 text-gray-900 drop-shadow-sm">{data.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="bg-white border-2 border-black px-3 py-1 text-[10px] font-bold shadow-[2px_2px_0px_0px_black] rounded flex items-center gap-1"><Clock size={12}/> {data.duration}</div>
                            <div className="bg-white border-2 border-black px-3 py-1 text-[10px] font-bold shadow-[2px_2px_0px_0px_black] rounded flex items-center gap-1"><CheckCircle size={12}/> {data.author}</div>
                            <div className="bg-lime-300 border-2 border-black px-3 py-1 text-[10px] font-bold shadow-[2px_2px_0px_0px_black] rounded flex items-center gap-1"><Cpu size={12}/> {data.engine}</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-black p-2 rounded-xl border-2 border-black shadow-inner">
                            {type === 'mp3' ? (
                              <audio src={data.preview_url} controls className="w-full h-12" />
                            ) : (
                              <video src={data.preview_url} controls className="w-full aspect-video rounded-lg bg-gray-900" />
                            )}
                          </div>

                          <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black border-3 border-black rounded-xl flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_black] text-lg transition-colors"
                            >
                              <Download size={20} strokeWidth={3} /> DOWNLOAD FILE NOW
                            </motion.button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </NeoCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-auto py-12 text-center bg-black text-white border-t-8 border-red-600 w-full relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 p-2 rounded-full border-4 border-black">
              <Heart size={20} fill="white" className="animate-bounce" />
           </div>
           
           <div className="max-w-4xl mx-auto px-4">
              <p className="font-black text-lg md:text-xl tracking-tight mb-2">
                 CREATED WITH ❤️ AND CODE BY AKA
              </p>
              <div className="inline-block bg-white/10 px-4 py-1 rounded-full border border-white/20">
                 <p className="text-[10px] md:text-xs font-mono opacity-80">
                    ©2025 - {currentYear > 2025 ? currentYear : 2025} KAAI. ALL RIGHTS RESERVED. | INDONESIA 🇮🇩
                 </p>
              </div>
           </div>
        </footer>

      </div>

      {/* Global CSS for this page */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 4px;
        }
      `}</style>
    </PageWrapper>
  )
}
export default Ytdl
