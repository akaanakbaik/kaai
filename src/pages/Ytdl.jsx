import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { 
  Video, Music, ArrowLeft, Loader, Clipboard, 
  Terminal, Zap, CheckCircle, Clock, Cpu, 
  Download, ChevronDown, Activity, Play, Pause, Disc
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

  useEffect(() => {
    const connectWs = () => {
      wsRef.current = new WebSocket('wss://api-ytdlpy.akadev.me/ws/progress')
      wsRef.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.msg) setLogs(prev => [...prev, `> ${msg.msg}`].slice(-6))
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
      }, 400)
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
    setLogs(['> Initializing System...'])

    try {
      const backendType = type === 'mp3' ? 'audio' : 'video'
      const res = await window.apiYtdl.post('/api/ytdl/info', 
        { url, type: backendType }, 
        { timeout: 600000 }
      )

      if (!res.data?.status) throw new Error(res.data?.msg || 'Failed')
      
      setData(res.data.metadata)
      setStage('done')
      setLogs(prev => [...prev, '> Data retrieved successfully'])
      toast.success('Ready to download!')
    } catch (err) {
      setStage('error')
      const errMsg = err.response?.data?.msg || err.message || 'Server Busy'
      setLogs(prev => [...prev, `> Error: ${errMsg}`])
      toast.error(typeof errMsg === 'object' ? 'Limit Exceeded' : errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI YTDL</title></Helmet>
      
      <div className="w-full max-w-6xl mx-auto px-4 pb-24 pt-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6"
        >
          <div className="flex items-center gap-5">
            <Link to="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-2 border-black w-10 h-10 flex items-center justify-center rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </motion.button>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                  alt="Logo" 
                  className="w-14 h-14 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_black] object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 leading-none">
                  YTDL <span className="text-[#6c5ce7]">KAAI</span>
                </h1>
                <p className="text-[10px] font-bold font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 inline-block mt-1">
                  SIMPLE DOWNLOADER V5
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* INPUT & LOGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CONFIG */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <NeoCard className="bg-white border-3 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
              <div className="bg-gray-50 px-8 py-5 border-b-3 border-black flex justify-between items-center">
                <h2 className="font-bold text-gray-800 flex items-center gap-2 text-sm tracking-wide">
                  <Terminal size={18} /> CONFIGURATION
                </h2>
                <div className="flex gap-2 opacity-30">
                  <div className="w-3 h-3 rounded-full bg-black" />
                  <div className="w-3 h-3 rounded-full bg-black" />
                  <div className="w-3 h-3 rounded-full bg-black" />
                </div>
              </div>

              <div className="p-8 space-y-7">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">YouTube URL</label>
                  <div className="relative group">
                    <input 
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                      placeholder="Paste link here..." 
                      disabled={loading} 
                      className="w-full pl-6 pr-14 h-16 text-lg font-bold text-gray-800 border-3 border-black rounded-2xl bg-white focus:outline-none focus:bg-gray-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all placeholder:text-gray-300" 
                    />
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePaste} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-500 hover:text-black"
                    >
                      <Clipboard size={22} />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Format Output</label>
                  <div className="grid grid-cols-2 gap-5">
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setType('video')} 
                      className={`h-16 border-3 border-black rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all ${type === 'video' ? 'bg-[#ff9f43] text-white shadow-[2px_2px_0px_0px_black] translate-y-0.5' : 'bg-white text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:bg-gray-50'}`}
                    >
                      <Video size={20} /> VIDEO MP4
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setType('mp3')} 
                      className={`h-16 border-3 border-black rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all ${type === 'mp3' ? 'bg-[#ff9f43] text-white shadow-[2px_2px_0px_0px_black] translate-y-0.5' : 'bg-white text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:bg-gray-50'}`}
                    >
                      <Music size={20} /> AUDIO MP3
                    </motion.button>
                  </div>
                </div>

                <motion.button 
                  whileHover={!loading ? { y: -2, boxShadow: "0px 10px 20px -5px rgba(108, 92, 231, 0.4)" } : {}}
                  whileTap={!loading ? { y: 0 } : {}}
                  onClick={handleProcess} 
                  disabled={loading} 
                  className={`w-full h-20 border-3 border-black rounded-2xl font-black text-xl tracking-wide flex items-center justify-center gap-3 transition-all shadow-[4px_4px_0px_0px_black] ${loading ? 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed' : 'bg-[#6c5ce7] text-white'}`}
                >
                  {loading ? <Loader className="animate-spin" size={28} /> : <Zap size={28} className="fill-white" />}
                  {loading ? 'PROCESSING...' : 'START DOWNLOAD'}
                </motion.button>
              </div>
            </NeoCard>
          </motion.div>

          {/* RIGHT: LOGS */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 h-full"
          >
            <NeoCard className="bg-[#1e272e] border-3 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] rounded-3xl h-full min-h-[250px] flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                <span className="text-[#00d2d3] font-mono text-xs font-bold flex items-center gap-2">
                  <Activity size={16} className="animate-pulse" /> SYSTEM LOGS
                </span>
                {loading && <div className="w-2 h-2 rounded-full bg-[#00d2d3] animate-ping" />}
              </div>
              
              <div className="flex-1 font-mono text-[12px] space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                {logs.length === 0 && !loading && (
                  <div className="text-gray-600 italic text-center mt-20 opacity-50">
                    Waiting for input...
                  </div>
                )}
                {logs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="text-[#c8d6e5] border-l-2 border-[#576574] pl-3 py-1 leading-relaxed break-words"
                  >
                    {log}
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </NeoCard>
          </motion.div>
        </div>

        {/* RESULT SECTION */}
        <div ref={resultRef}>
          <AnimatePresence>
            {data && stage === 'done' && (
              <motion.div 
                initial={{ opacity: 0, y: 60, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mt-20"
              >
                <div className="text-center mb-8 text-gray-300">
                   <ChevronDown className="mx-auto animate-bounce" size={40} />
                </div>

                <NeoCard className="bg-white border-3 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-3xl max-w-5xl mx-auto">
                  
                  {/* METADATA HEADER (MOBILE ONLY) */}
                  <div className="md:hidden p-6 border-b-2 border-gray-100">
                    <h3 className="font-black text-xl leading-snug text-gray-900 mb-2">{data.title}</h3>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1"><CheckCircle size={12}/> {data.author}</p>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    
                    {/* MEDIA PREVIEW AREA */}
                    <div className="w-full md:w-5/12 bg-gray-50 border-b-2 md:border-b-0 md:border-r-2 border-gray-100 relative group p-6 md:p-8 flex flex-col justify-center items-center">
                       
                       {type === 'mp3' ? (
                         // AUDIO LAYOUT
                         <div className="relative w-48 h-48 md:w-64 md:h-64">
                            <motion.img 
                               animate={{ rotate: 360 }}
                               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                               src={data.thumbnail} 
                               alt="Album Art" 
                               className="w-full h-full object-cover rounded-full border-4 border-black shadow-xl z-10 relative" 
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-black z-20 flex items-center justify-center">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                         </div>
                       ) : (
                         // VIDEO LAYOUT
                         <div className="w-full relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden border-2 border-black">
                            <img src={data.thumbnail} className="w-full h-auto object-cover" alt="Thumbnail"/>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                               <Play size={48} className="text-white fill-white opacity-80" />
                            </div>
                         </div>
                       )}

                       <div className="mt-6 w-full">
                          <div className="bg-white border-2 border-black rounded-xl p-2 shadow-sm">
                            {type === 'mp3' ? (
                              <audio 
                                src={data.preview_url} 
                                controls 
                                preload="metadata"
                                className="w-full h-10" 
                              />
                            ) : (
                              <video 
                                src={data.preview_url} 
                                controls 
                                preload="metadata"
                                className="w-full aspect-video rounded-lg bg-black" 
                              />
                            )}
                          </div>
                       </div>
                    </div>

                    {/* DETAILS & ACTION AREA */}
                    <div className="p-6 md:p-10 flex-1 flex flex-col justify-center">
                      
                      {/* Desktop Title */}
                      <div className="hidden md:block mb-6">
                        <h3 className="font-black text-3xl leading-tight mb-3 text-gray-900">{data.title}</h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                           <span className="bg-[#f1f2f6] text-gray-600 px-3 py-1 rounded-full font-bold flex items-center gap-2"><CheckCircle size={14} /> {data.author}</span>
                           <span className="bg-[#f1f2f6] text-gray-600 px-3 py-1 rounded-full font-bold flex items-center gap-2"><Clock size={14} /> {data.duration}</span>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Engine</p>
                            <p className="font-bold text-gray-800 flex items-center gap-1"><Cpu size={14}/> {data.engine}</p>
                         </div>
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Quality</p>
                            <p className="font-bold text-gray-800 flex items-center gap-1">
                               {type === 'mp3' ? <Music size={14}/> : <Video size={14}/>} High
                            </p>
                         </div>
                      </div>

                      <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-16 bg-[#10ac84] text-white font-black border-3 border-black rounded-2xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_black] text-lg hover:bg-[#0da07a] transition-colors"
                        >
                          <Download size={24} strokeWidth={2.5} /> DOWNLOAD FILE
                        </motion.button>
                      </a>
                      
                      <p className="text-center text-xs font-bold text-gray-400 mt-4">
                        *File available for 3 hours on server
                      </p>
                    </div>
                  </div>
                </NeoCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2f3640;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #576574;
          border-radius: 10px;
        }
      `}</style>
    </PageWrapper>
  )
}
export default Ytdl
