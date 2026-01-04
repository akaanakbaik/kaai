import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { 
  Search, Download, Music, Video, ArrowLeft, Loader, 
  AlertTriangle, Clipboard, Cpu, Clock, Server, 
  Terminal, Wifi, Zap, CheckCircle, Activity, ChevronRight
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
  const logsContainerRef = useRef(null)

  // --- WEBSOCKET ---
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

  // Auto Scroll Log
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
    }
  }, [logs])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) { setUrl(text); toast.success('Link pasted!') }
    } catch { toast.error('Access denied') }
  }

  const handleProcess = async () => {
    if (!url) return toast.error('Input URL required')
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) return toast.error('Invalid YouTube URL')

    setLoading(true); setStage('processing'); setData(null)
    setLogs(['> Initializing System...', '> Handshake Established...', '> Timeout Allocation: 10m...'])

    try {
      const backendType = type === 'mp3' ? 'audio' : 'video'
      // TIMEOUT 10 MENIT
      const res = await window.apiYtdl.post('/api/ytdl/info', 
        { url, type: backendType }, 
        { timeout: 600000 }
      )

      if (!res.data?.status) throw new Error(res.data?.msg || 'Failed')
      
      setData(res.data.metadata)
      setStage('done')
      setLogs(prev => [...prev, '> DATA RETRIEVED SUCCESSFULLY'])
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI YTDL</title></Helmet>
      
      {/* WRAPPER UTAMA: Mencegah Horizontal Scroll */}
      <div className="w-full max-w-full overflow-x-hidden pb-10">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-4"
        >
          <div>
            <Link to="/">
              <NeoButton variant="white" className="h-7 text-[10px] font-black border-2 border-black hover:bg-black hover:text-white transition-all mb-2">
                <ArrowLeft size={12} className="mr-1" /> EXIT
              </NeoButton>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none select-none">
              YTDL <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">KAAI</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white border-2 border-black px-2 py-1 flex items-center gap-2 shadow-[2px_2px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black]">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold font-mono">ONLINE</span>
            </div>
            <div className="bg-black text-white px-2 py-1 border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_gray] md:shadow-[4px_4px_0px_0px_gray]">
               <Zap size={10} className="fill-yellow-400 text-yellow-400" />
               <span className="text-[10px] font-bold font-mono">TURBO</span>
            </div>
          </div>
        </motion.div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">
          
          {/* LEFT: INPUT PANEL */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 z-20"
          >
            <NeoCard className="bg-white border-3 border-black p-0 shadow-[6px_6px_0px_0px_black] md:shadow-[8px_8px_0px_0px_black] overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b-3 border-black flex justify-between items-center">
                <h2 className="font-black text-sm md:text-base flex items-center gap-2">
                  <Terminal size={16} /> PARAMETERS
                </h2>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black" />
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-5">
                {/* Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase ml-1 text-gray-500">Target URL</label>
                  <div className="relative group">
                    <NeoInput 
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                      placeholder="https://youtu.be/..." 
                      disabled={loading} 
                      className="pl-3 pr-10 h-12 md:h-14 text-sm md:text-lg font-bold border-3 border-black bg-white focus:bg-yellow-50 transition-colors w-full" 
                    />
                    <button 
                      onClick={handlePaste} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black hover:text-white rounded-md transition-all border-2 border-transparent hover:border-black"
                    >
                      <Clipboard size={16} />
                    </button>
                  </div>
                </div>

                {/* Format Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase ml-1 text-gray-500">Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['video', 'mp3'].map((fmt) => (
                      <button 
                        key={fmt}
                        onClick={() => setType(fmt)} 
                        className={`h-10 md:h-12 border-3 border-black font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${type === fmt ? 'bg-black text-white shadow-[2px_2px_0px_0px_gray]' : 'bg-white text-black shadow-[3px_3px_0px_0px_black] hover:bg-gray-50'}`}
                      >
                        {fmt === 'mp3' ? <Music size={14} /> : <Video size={14} />} 
                        {fmt === 'mp3' ? 'AUDIO (MP3)' : 'VIDEO (MP4)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button 
                  onClick={handleProcess} 
                  disabled={loading} 
                  className={`w-full h-12 md:h-14 border-3 border-black font-black text-base md:text-xl flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_black] md:shadow-[6px_6px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400 shadow-none' : 'bg-red-600 text-white hover:bg-red-500'}`}
                >
                  {loading ? <Loader className="animate-spin" size={20} /> : <Zap size={20} className="fill-white" />}
                  {loading ? 'PROCESSING...' : 'EXECUTE'}
                </button>
              </div>
            </NeoCard>
          </motion.div>

          {/* RIGHT: TERMINAL & INFO */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 z-10"
          >
            <div className="flex flex-col gap-4 md:gap-6 h-full">
              
              {/* TERMINAL */}
              <NeoCard className="bg-black border-3 border-black p-4 shadow-[6px_6px_0px_0px_gray] md:shadow-[8px_8px_0px_0px_gray] flex-1 min-h-[160px] flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
                  <span className="text-white/70 font-mono text-[10px] flex items-center gap-2">
                    <Activity size={10} className="animate-pulse text-green-400" /> LIVE LOGS
                  </span>
                  <span className="text-[9px] text-white/30 font-mono">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
                
                <div 
                  ref={logsContainerRef}
                  className="flex-1 font-mono text-[10px] md:text-xs space-y-1.5 overflow-y-auto max-h-[140px] custom-scrollbar"
                >
                  {logs.length === 0 && !loading && (
                    <div className="text-white/30 italic">Waiting for command...</div>
                  )}
                  {logs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-green-400 break-all leading-tight">
                      <span className="text-white/30 mr-2 opacity-50">$</span>{log}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="text-yellow-400 animate-pulse mt-2">_ Processing... (Max 10m)</div>
                  )}
                </div>
              </NeoCard>

              {/* HINT */}
              <div className="bg-yellow-200 border-3 border-black p-3 shadow-[4px_4px_0px_0px_black] text-[10px] md:text-xs font-bold leading-relaxed">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <p>Don't close the tab while processing. Large files might take up to 5-7 minutes. If failed, system will retry automatically.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- RESULT CARD --- */}
        <AnimatePresence>
          {data && stage === 'done' && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="mt-8 md:mt-12 max-w-4xl mx-auto"
            >
              <NeoCard className="bg-blue-50 border-3 md:border-4 border-black shadow-[8px_8px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black] p-0 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* THUMBNAIL */}
                  <div className="w-full md:w-5/12 relative bg-black group">
                     <img src={data.thumbnail} alt="" className="w-full h-48 md:h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                        <div className="inline-flex items-center gap-1 bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white border border-white">
                           {type === 'mp3' ? <Music size={10} /> : <Video size={10} />} {type.toUpperCase()}
                        </div>
                     </div>
                  </div>

                  {/* INFO */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-black text-xl md:text-2xl leading-tight mb-2 line-clamp-2">{data.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge-neo bg-white"><Clock size={10} /> {data.duration}</span>
                        <span className="badge-neo bg-white"><CheckCircle size={10} /> {data.author}</span>
                        <span className="badge-neo bg-lime-300"><Cpu size={10} /> {data.engine}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-black p-1.5 border-2 border-black shadow-[3px_3px_0px_0px_gray]">
                        {type === 'mp3' ? (
                          <audio src={data.preview_url} controls className="w-full h-8" />
                        ) : (
                          <video src={data.preview_url} controls className="w-full aspect-video bg-gray-900" />
                        )}
                      </div>

                      <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block">
                        <button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black border-2 border-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all text-sm md:text-base">
                          <Download size={18} /> DOWNLOAD FILE
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                
                {data.stats && (
                  <div className="bg-gray-900 text-white text-[9px] md:text-[10px] p-1.5 text-center font-mono border-t-3 border-black">
                    SERVER STATS: {data.stats.req_min}/5 (MIN) • {data.stats.req_day}/100 (DAY)
                  </div>
                )}
              </NeoCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Styles */}
      <style jsx>{`
        .badge-neo {
          @apply border-2 border-black px-1.5 py-0.5 text-[9px] md:text-[10px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_black];
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
        }
      `}</style>
    </PageWrapper>
  )
}
export default Ytdl
