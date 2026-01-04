import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { Search, Download, Music, Video, ArrowLeft, Loader, AlertTriangle, Clipboard, Cpu, Clock, Server, Terminal, Wifi, Activity, Zap } from 'lucide-react'
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
  const logEndRef = useRef(null)

  useEffect(() => {
    const connectWs = () => {
      wsRef.current = new WebSocket('wss://api-ytdlpy.akadev.me/ws/progress')
      wsRef.current.onopen = () => console.log('WS Connected')
      wsRef.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.msg) setLogs(prev => [...prev.slice(-4), `> ${msg.msg}`])
        } catch (e) {}
      }
      wsRef.current.onclose = () => setTimeout(connectWs, 3000)
    }
    connectWs()
    return () => wsRef.current?.close()
  }, [])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) { setUrl(text); toast.success('Link ditempel!') }
    } catch { toast.error('Izin clipboard ditolak') }
  }

  const handleProcess = async () => {
    if (!url) return toast.error('Link tidak boleh kosong')
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) return toast.error('Bukan link YouTube yang valid')

    setLoading(true); setStage('processing'); setData(null); setLogs(['> Initializing connection...', '> Handshake with server...'])

    try {
      const backendType = type === 'mp3' ? 'audio' : 'video'
      // TIMEOUT 5 MENIT (300000ms)
      const res = await window.apiYtdl.post('/api/ytdl/info', { url, type: backendType }, { timeout: 300000 })

      if (!res.data?.status) throw new Error(res.data?.msg || 'Gagal memproses data')
      
      setData(res.data.metadata)
      setStage('done')
      setLogs(prev => [...prev, '> PROCESS COMPLETED SUCCESSFULLY!'])
      toast.success('Selesai! File siap.')
    } catch (err) {
      setStage('error')
      const errMsg = err.response?.data?.msg || err.message || 'Server Unreachable'
      setLogs(prev => [...prev, `> ERROR: ${errMsg}`])
      toast.error(typeof errMsg === 'object' ? 'Rate Limit Habis' : errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI ULTIMATE YTDL</title></Helmet>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/"><NeoButton variant="white" className="h-8 text-[10px] font-black border-2 border-black hover:bg-red-500 hover:text-white transition-colors"><ArrowLeft size={12} className="mr-1" /> EXIT SYSTEM</NeoButton></Link>
        <div className="text-right">
          <h1 className="text-4xl font-black italic tracking-tighter leading-none">YT<span className="text-red-600">DLP</span><span className="text-xs align-top ml-1 bg-black text-white px-1 py-0.5 rounded">V5.0</span></h1>
          <div className="flex items-center gap-2 justify-end text-[9px] font-mono font-bold mt-1">
            <span className="flex items-center text-green-600"><Wifi size={10} className="mr-1" /> ONLINE</span>
            <span className="flex items-center text-blue-600"><Zap size={10} className="mr-1" /> TURBO</span>
          </div>
        </div>
      </div>

      {/* MAIN INPUT CARD */}
      <NeoCard className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-0 overflow-hidden relative z-10">
        <div className="bg-black text-white p-3 flex items-center justify-between border-b-4 border-black">
          <h2 className="font-black text-lg flex items-center gap-2"><Terminal size={18} /> COMMAND CENTER</h2>
          <div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div><div className="w-3 h-3 rounded-full bg-yellow-400 border border-white"></div><div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div></div>
        </div>
        
        <div className="p-5 space-y-5 bg-yellow-50">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Search size={20} className="text-black/50" /></div>
            <NeoInput value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." disabled={loading} className="pl-10 pr-12 h-14 text-lg font-bold border-3 border-black focus:shadow-[4px_4px_0px_0px_black] transition-all bg-white" />
            <button onClick={handlePaste} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-lg transition-all"><Clipboard size={18} /></button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setType('mp3')} className={`h-14 border-3 border-black font-black text-lg flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_black] ${type === 'mp3' ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <Music size={20} /> AUDIO (MP3)
            </button>
            <button onClick={() => setType('mp4')} className={`h-14 border-3 border-black font-black text-lg flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_black] ${type === 'mp4' ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <Video size={20} /> VIDEO (MP4)
            </button>
          </div>

          <button onClick={handleProcess} disabled={loading} className={`w-full h-16 border-3 border-black font-black text-xl flex items-center justify-center gap-3 transition-all shadow-[6px_6px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_0px_black] ${loading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-red-600 text-white hover:bg-red-500'}`}>
            {loading ? <Loader className="animate-spin" size={24} /> : <Zap size={24} fill="white" />}
            {loading ? 'PROCESSING REQUEST...' : 'START ENGINE'}
          </button>
        </div>

        {/* TERMINAL LOGS AREA */}
        <AnimatePresence>
          {(loading || logs.length > 0) && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-black border-t-4 border-black p-4 font-mono text-xs text-green-400 overflow-hidden">
              <div className="flex items-center gap-2 mb-2 text-white/50 border-b border-white/20 pb-2"><Activity size={12} className="animate-pulse" /> SYSTEM LOGS STREAM</div>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="truncate">
                    <span className="opacity-50 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>{log}
                  </motion.div>
                ))}
                {loading && <div className="animate-pulse text-red-500 mt-2">_ Waiting for server response... (Timeout: 5m)</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </NeoCard>

      {/* RESULT CARD */}
      <AnimatePresence>
        {data && stage === 'done' && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mt-8 relative z-0">
            <NeoCard className="bg-blue-50 border-4 border-black shadow-[8px_8px_0px_0px_black]">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-5/12 relative group">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none border-2 border-black z-10"></div>
                  <img src={data.thumbnail} alt="Thumb" className="w-full aspect-video object-cover border-2 border-black shadow-[4px_4px_0px_0px_black]" />
                  <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-bold border border-white z-20 flex items-center gap-1">
                    {type === 'mp3' ? <Music size={10} /> : <Video size={10} />} {type.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-xl md:text-2xl leading-tight mb-3 line-clamp-2">{data.title}</h3>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider mb-4">
                      <span className="bg-white border-2 border-black px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_0px_black]"><Clock size={12} /> {data.duration}</span>
                      <span className="bg-white border-2 border-black px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_0px_black]"><CheckCircle size={12} /> {data.author}</span>
                      <span className="bg-lime-300 border-2 border-black px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_0px_black]"><Cpu size={12} /> {data.engine}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black p-2 border-2 border-black shadow-[4px_4px_0px_0px_gray]">
                      {type === 'mp3' ? (
                        <audio src={data.preview_url} controls className="w-full h-8" preload="none" />
                      ) : (
                        <video src={data.preview_url} controls className="w-full aspect-video bg-gray-900" preload="none" />
                      )}
                    </div>
                    
                    <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block group">
                      <button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black border-2 border-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_black] transition-all">
                        <Download size={20} className="group-hover:animate-bounce" /> DOWNLOAD FILE
                      </button>
                    </a>
                    
                    {data.stats && (
                      <div className="text-[10px] text-center font-mono text-gray-500 bg-gray-100 p-1 border border-gray-300">
                        SERVER USAGE: {data.stats.req_min}/5 (MIN) • {data.stats.req_day}/100 (DAY)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
export default Ytdl
