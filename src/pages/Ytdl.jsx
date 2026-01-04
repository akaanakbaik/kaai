import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { 
  Search, Download, Music, Video, ArrowLeft, Loader, 
  AlertTriangle, Clipboard, Cpu, Clock, Server, 
  Terminal, Zap, CheckCircle, Activity, ChevronDown
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
  const resultRef = useRef(null) // Ref untuk Auto Scroll

  // --- WEBSOCKET CONNECTION ---
  useEffect(() => {
    const connectWs = () => {
      wsRef.current = new WebSocket('wss://api-ytdlpy.akadev.me/ws/progress')
      wsRef.current.onopen = () => console.log('✅ WS Connected')
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

  // Auto Scroll Logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Auto Scroll Results (Fix UX)
  useEffect(() => {
    if (data && stage === 'done' && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [data, stage])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) { setUrl(text); toast.success('Link pasted!') }
    } catch { toast.error('Clipboard access denied') }
  }

  const handleProcess = async () => {
    if (!url) return toast.error('Input URL required')
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) return toast.error('Invalid YouTube URL')

    setLoading(true); setStage('processing'); setData(null)
    setLogs(['> Initializing System...', '> Handshake Established...'])

    try {
      const backendType = type === 'mp3' ? 'audio' : 'video'
      const res = await window.apiYtdl.post('/api/ytdl/info', 
        { url, type: backendType }, 
        { timeout: 600000 }
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
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI YTDL PRO</title></Helmet>
      
      {/* WRAPPER UTAMA: Max Width 5XL agar tidak terlalu lebar di desktop */}
      <div className="w-full max-w-5xl mx-auto px-2 md:px-4 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
          <div className="w-full md:w-auto">
            <Link to="/">
              <NeoButton variant="white" className="h-8 text-[10px] font-black border-2 border-black hover:bg-black hover:text-white transition-all mb-2 mx-auto md:mx-0">
                <ArrowLeft size={12} className="mr-1" /> EXIT
              </NeoButton>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
              YTDL <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">KAAI</span>
            </h1>
          </div>
          
          <div className="flex gap-2">
            <div className="bg-white border-2 border-black px-3 py-1.5 flex items-center gap-2 shadow-[2px_2px_0px_0px_black] rounded-md">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold font-mono">ONLINE</span>
            </div>
            <div className="bg-black text-white px-3 py-1.5 border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_gray] rounded-md">
               <Zap size={12} className="fill-yellow-400 text-yellow-400" />
               <span className="text-[10px] font-bold font-mono">TURBO</span>
            </div>
          </div>
        </div>

        {/* --- CONTROL PANEL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* INPUT SECTION */}
          <div className="lg:col-span-7 space-y-6">
            <NeoCard className="bg-white border-3 border-black p-0 shadow-[6px_6px_0px_0px_black] overflow-hidden rounded-xl">
              <div className="bg-gray-100 px-5 py-3 border-b-3 border-black flex justify-between items-center">
                <h2 className="font-black text-sm flex items-center gap-2">
                  <Terminal size={16} /> CONFIGURATION
                </h2>
                <div className="flex gap-1.5 opacity-60">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </div>

              <div className="p-5 md:p-6 space-y-5">
                {/* URL */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 uppercase ml-1">YouTube URL</label>
                  <div className="relative group">
                    <NeoInput 
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                      placeholder="Paste link here..." 
                      disabled={loading} 
                      className="pl-4 pr-12 h-14 text-base md:text-lg font-bold border-3 border-black rounded-lg focus:ring-0 focus:shadow-[4px_4px_0px_0px_black] transition-all" 
                    />
                    <button 
                      onClick={handlePaste} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-md transition-all"
                    >
                      <Clipboard size={18} />
                    </button>
                  </div>
                </div>

                {/* TYPE SELECTOR */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 uppercase ml-1">Format</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setType('video')} 
                      className={`h-14 border-3 border-black rounded-lg font-black text-sm flex items-center justify-center gap-2 transition-all ${type === 'video' ? 'bg-black text-white shadow-[2px_2px_0px_0px_gray] translate-y-1' : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_black]'}`}
                    >
                      <Video size={18} /> VIDEO (MP4)
                    </button>
                    <button 
                      onClick={() => setType('mp3')} 
                      className={`h-14 border-3 border-black rounded-lg font-black text-sm flex items-center justify-center gap-2 transition-all ${type === 'mp3' ? 'bg-black text-white shadow-[2px_2px_0px_0px_gray] translate-y-1' : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_black]'}`}
                    >
                      <Music size={18} /> AUDIO (MP3)
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button 
                  onClick={handleProcess} 
                  disabled={loading} 
                  className={`w-full h-16 border-3 border-black rounded-lg font-black text-lg md:text-xl flex items-center justify-center gap-3 transition-all shadow-[6px_6px_0px_0px_black] active:translate-y-1 active:shadow-none ${loading ? 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500'}`}
                >
                  {loading ? <Loader className="animate-spin" size={24} /> : <Zap size={24} className="fill-white" />}
                  {loading ? 'PROCESSING...' : 'START ENGINE'}
                </button>
              </div>
            </NeoCard>
          </div>

          {/* RIGHT: TERMINAL LOGS */}
          <div className="lg:col-span-5 h-full">
            <NeoCard className="bg-gray-900 border-3 border-black p-4 shadow-[6px_6px_0px_0px_gray] rounded-xl h-full min-h-[250px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <span className="text-green-400 font-mono text-[10px] flex items-center gap-2">
                  <Activity size={12} className="animate-pulse" /> SYSTEM ACTIVITY
                </span>
                {loading && <Loader size={12} className="animate-spin text-white" />}
              </div>
              
              <div className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[200px] custom-scrollbar pr-2">
                {logs.length === 0 && !loading && (
                  <div className="text-gray-600 italic text-center mt-10">System ready. Waiting for input...</div>
                )}
                {logs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="text-green-400 border-l-2 border-green-600 pl-2 py-0.5"
                  >
                    {log}
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </NeoCard>
          </div>
        </div>

        {/* --- RESULTS SECTION (Auto Scroll Target) --- */}
        <div ref={resultRef}>
          <AnimatePresence mode="wait">
            {data && stage === 'done' && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-12"
              >
                <div className="text-center mb-4 opacity-50">
                  <ChevronDown className="mx-auto animate-bounce" />
                </div>

                <NeoCard className="bg-blue-50 border-3 md:border-4 border-black shadow-[8px_8px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black] p-0 overflow-hidden rounded-xl">
                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="w-full md:w-5/12 relative bg-black group h-56 md:h-auto">
                       <img src={data.thumbnail} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute top-3 left-3">
                          <span className="bg-black/80 text-white border border-white/50 px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 backdrop-blur-sm">
                             {type === 'mp3' ? <Music size={10} /> : <Video size={10} />} {type.toUpperCase()}
                          </span>
                       </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-8 flex-1 flex flex-col justify-between gap-6">
                      <div>
                        <h3 className="font-black text-xl md:text-3xl leading-tight mb-3 line-clamp-2 text-gray-900">{data.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-white border border-black px-2 py-1 text-[10px] font-bold shadow-sm rounded flex items-center gap-1"><Clock size={12}/> {data.duration}</div>
                          <div className="bg-white border border-black px-2 py-1 text-[10px] font-bold shadow-sm rounded flex items-center gap-1"><CheckCircle size={12}/> {data.author}</div>
                          <div className="bg-lime-300 border border-black px-2 py-1 text-[10px] font-bold shadow-sm rounded flex items-center gap-1"><Cpu size={12}/> {data.engine}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-black p-2 rounded-lg border-2 border-black shadow-inner">
                          {type === 'mp3' ? (
                            <audio src={data.preview_url} controls className="w-full h-10" />
                          ) : (
                            <video src={data.preview_url} controls className="w-full aspect-video rounded bg-gray-900" />
                          )}
                        </div>

                        <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block transform hover:-translate-y-1 transition-transform">
                          <button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black border-3 border-black rounded-lg flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_black] text-lg">
                            <Download size={20} /> DOWNLOAD FILE
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {data.stats && (
                    <div className="bg-gray-900 text-white text-[10px] py-2 px-4 text-center font-mono border-t-3 border-black flex justify-between">
                      <span>REQ ID: {Math.random().toString(36).substr(2,6).toUpperCase()}</span>
                      <span>QUOTA: {data.stats.req_min}/5 (MIN)</span>
                    </div>
                  )}
                </NeoCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 2px;
        }
      `}</style>
    </PageWrapper>
  )
}
export default Ytdl
