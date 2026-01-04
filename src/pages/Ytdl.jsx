import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { 
  Search, Download, Music, Video, ArrowLeft, Loader, 
  AlertTriangle, Clipboard, Cpu, Clock, Server, 
  Terminal, Wifi, Zap, CheckCircle, Radio, Play, Activity 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

const Ytdl = () => {
  const [url, setUrl] = useState('')
  const [type, setType] = useState('video')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('idle') // idle, processing, done, error
  const [data, setData] = useState(null)
  const [logs, setLogs] = useState([])
  const wsRef = useRef(null)
  const logsContainerRef = useRef(null)

  // --- WEBSOCKET CONNECTION ---
  useEffect(() => {
    const connectWs = () => {
      wsRef.current = new WebSocket('wss://api-ytdlpy.akadev.me/ws/progress')
      wsRef.current.onopen = () => console.log('✅ WS Connected')
      wsRef.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.msg) {
            setLogs(prev => {
              const newLogs = [...prev, `> ${msg.msg}`]
              return newLogs.slice(-6) // Keep last 6 lines
            })
          }
        } catch (e) {}
      }
      wsRef.current.onclose = () => setTimeout(connectWs, 3000)
    }
    connectWs()
    return () => wsRef.current?.close()
  }, [])

  // Auto scroll logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
    }
  }, [logs])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) { setUrl(text); toast.success('Link pasted!') }
    } catch { toast.error('Clipboard access denied') }
  }

  const handleProcess = async () => {
    if (!url) return toast.error('Please enter a YouTube URL')
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) return toast.error('Invalid YouTube URL')

    setLoading(true)
    setStage('processing')
    setData(null)
    setLogs(['> System Initialized...', '> Handshake established...', '> Allocation: 10min Timeout...'])

    try {
      const backendType = type === 'mp3' ? 'audio' : 'video'
      
      // TIMEOUT UDPATED: 10 MENIT (600,000 ms)
      // 7 Menit Engine 1 + 3 Menit Engine 2
      const res = await window.apiYtdl.post('/api/ytdl/info', 
        { url, type: backendType }, 
        { timeout: 600000 } 
      )

      if (!res.data?.status) throw new Error(res.data?.msg || 'Processing Failed')
      
      setData(res.data.metadata)
      setStage('done')
      setLogs(prev => [...prev, '> SUCCESS: CONTENT RETRIEVED'])
      toast.success('Ready to download!')
    } catch (err) {
      setStage('error')
      const errMsg = err.response?.data?.msg || err.message || 'Connection Timeout / Server Busy'
      setLogs(prev => [...prev, `> FATAL ERROR: ${errMsg}`])
      toast.error(typeof errMsg === 'object' ? 'Limit Exceeded' : errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI DOWNLOADER</title></Helmet>
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <Link to="/">
            <NeoButton variant="white" className="h-8 text-[10px] font-black border-2 border-black hover:bg-black hover:text-white transition-all mb-2">
              <ArrowLeft size={12} className="mr-1" /> EXIT
            </NeoButton>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
            YOUTUBE<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">DOWNLOADER</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border-2 border-black px-3 py-1 flex items-center gap-2 shadow-[4px_4px_0px_0px_black]">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="bg-black text-white px-3 py-1 border-2 border-black flex items-center gap-2 shadow-[4px_4px_0px_0px_gray]">
             <Zap size={12} className="fill-yellow-400 text-yellow-400" />
             <span className="text-[10px] font-bold font-mono">TURBO MODE</span>
          </div>
        </div>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">
        
        {/* LEFT PANEL: INPUT & CONTROLS */}
        <div className="lg:col-span-7 z-20">
          <NeoCard className="bg-white border-3 border-black p-0 shadow-[8px_8px_0px_0px_black] overflow-hidden">
            <div className="bg-gray-100 p-4 border-b-3 border-black flex justify-between items-center">
              <h2 className="font-black text-lg flex items-center gap-2">
                <Terminal size={20} /> INPUT PARAMETERS
              </h2>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black" />
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* URL INPUT */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-1">Target URL</label>
                <div className="relative group">
                  <NeoInput 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    placeholder="https://youtube.com/watch?v=..." 
                    disabled={loading} 
                    className="pl-4 pr-12 h-14 text-lg font-bold border-3 border-black bg-white focus:bg-yellow-50 transition-colors" 
                  />
                  <button 
                    onClick={handlePaste} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-black hover:text-white rounded-md transition-all border-2 border-transparent hover:border-black"
                  >
                    <Clipboard size={18} />
                  </button>
                </div>
              </div>

              {/* FORMAT SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-1">Output Format</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setType('video')} 
                    className={`h-12 border-3 border-black font-black text-sm flex items-center justify-center gap-2 transition-all active:translate-y-1 ${type === 'video' ? 'bg-black text-white shadow-[2px_2px_0px_0px_gray]' : 'bg-white text-black shadow-[4px_4px_0px_0px_black] hover:bg-gray-50'}`}
                  >
                    <Video size={16} /> VIDEO (MP4)
                  </button>
                  <button 
                    onClick={() => setType('mp3')} 
                    className={`h-12 border-3 border-black font-black text-sm flex items-center justify-center gap-2 transition-all active:translate-y-1 ${type === 'mp3' ? 'bg-black text-white shadow-[2px_2px_0px_0px_gray]' : 'bg-white text-black shadow-[4px_4px_0px_0px_black] hover:bg-gray-50'}`}
                  >
                    <Music size={16} /> AUDIO (MP3)
                  </button>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button 
                onClick={handleProcess} 
                disabled={loading} 
                className={`w-full h-16 border-3 border-black font-black text-xl flex items-center justify-center gap-3 transition-all shadow-[6px_6px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400 shadow-none' : 'bg-red-600 text-white hover:bg-red-500'}`}
              >
                {loading ? <Loader className="animate-spin" size={24} /> : <Zap size={24} className="fill-white" />}
                {loading ? 'PROCESSING...' : 'EXECUTE'}
              </button>
            </div>
          </NeoCard>
        </div>

        {/* RIGHT PANEL: TERMINAL & STATUS */}
        <div className="lg:col-span-5 z-10">
          <div className="h-full flex flex-col gap-6">
            
            {/* TERMINAL CARD */}
            <NeoCard className="bg-black border-3 border-black p-4 shadow-[8px_8px_0px_0px_gray] flex-1 min-h-[200px] flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
                <span className="text-white/70 font-mono text-xs flex items-center gap-2">
                  <Activity size={12} className="animate-pulse text-green-400" /> LIVE LOGS
                </span>
                <span className="text-[10px] text-white/30 font-mono">v5.0.3-stable</span>
              </div>
              
              <div 
                ref={logsContainerRef}
                className="flex-1 font-mono text-xs space-y-2 overflow-y-auto max-h-[180px] custom-scrollbar"
              >
                {logs.length === 0 && !loading && (
                  <div className="text-white/30 italic">Waiting for input...</div>
                )}
                {logs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="text-green-400 break-words"
                  >
                    <span className="text-white/40 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    {log}
                  </motion.div>
                ))}
                {loading && (
                  <div className="text-yellow-400 animate-pulse mt-2">
                    _ Working... (Please wait up to 10m)
                  </div>
                )}
              </div>
            </NeoCard>

            {/* INFO BOX */}
            <div className="bg-yellow-200 border-3 border-black p-4 shadow-[6px_6px_0px_0px_black] text-xs font-bold">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>Use valid YouTube links. Process may take time for high-quality/long duration videos. Do not close this tab.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RESULT SECTION --- */}
      <AnimatePresence>
        {data && stage === 'done' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-10 max-w-4xl mx-auto"
          >
            <NeoCard className="bg-blue-50 border-4 border-black shadow-[12px_12px_0px_0px_black] p-0 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* THUMBNAIL */}
                <div className="w-full md:w-5/12 relative bg-black">
                   <img src={data.thumbnail} alt="" className="w-full h-full object-cover opacity-90" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <div className="inline-flex items-center gap-1 bg-red-600 px-2 py-0.5 text-[10px] font-bold mb-2 border border-white">
                           {type === 'mp3' ? <Music size={10} /> : <Video size={10} />} {type.toUpperCase()}
                        </div>
                      </div>
                   </div>
                </div>

                {/* DETAILS */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-black text-2xl leading-tight mb-2">{data.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="badge-neo bg-white"><Clock size={12} /> {data.duration}</span>
                      <span className="badge-neo bg-white"><CheckCircle size={12} /> {data.author}</span>
                      <span className="badge-neo bg-lime-300"><Cpu size={12} /> {data.engine}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* PLAYER */}
                    <div className="bg-black p-2 border-2 border-black shadow-[4px_4px_0px_0px_gray]">
                      {type === 'mp3' ? (
                        <audio src={data.preview_url} controls className="w-full h-10" />
                      ) : (
                        <video src={data.preview_url} controls className="w-full aspect-video bg-gray-900" />
                      )}
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block">
                      <button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black border-2 border-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-lg">
                        <Download size={20} /> DOWNLOAD NOW
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              
              {data.stats && (
                <div className="bg-gray-900 text-white text-[10px] p-2 text-center font-mono border-t-4 border-black">
                  SERVER QUOTA: {data.stats.req_min}/5 (MIN) • {data.stats.req_day}/100 (DAY)
                </div>
              )}
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .badge-neo {
          @apply border-2 border-black px-2 py-1 text-[10px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_black];
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4ade80;
        }
      `}</style>
    </PageWrapper>
  )
}
export default Ytdl
