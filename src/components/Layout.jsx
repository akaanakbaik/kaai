import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { 
  Video, Music, ArrowLeft, Loader, Clipboard, 
  Terminal, Zap, CheckCircle, Clock, Cpu, 
  Download, ChevronDown, Activity, Play, Pause, AlertTriangle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

// --- CUSTOM AUDIO PLAYER (Agar bisa geser durasi) ---
const CustomAudioPlayer = ({ src, thumbnail }) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => setProgress(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const onEnd = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', onEnd)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (e) => {
    const newTime = e.target.value
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00"
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  return (
    <div className="bg-black text-white p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] flex flex-col gap-3">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center gap-4">
        <div className={`relative w-12 h-12 rounded-full border-2 border-white overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
           <img src={thumbnail} alt="Cover" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/20"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border border-white"></div>
        </div>

        <button 
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-[#A3E635] text-black rounded-full border-2 border-white hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
        </button>

        <div className="flex-1">
           <input 
             type="range" 
             min="0" 
             max={duration || 0} 
             value={progress} 
             onChange={handleSeek}
             className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#A3E635]"
           />
           <div className="flex justify-between text-[10px] font-mono mt-1 text-gray-400">
             <span>{formatTime(progress)}</span>
             <span>{formatTime(duration)}</span>
           </div>
        </div>
      </div>
    </div>
  )
}

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

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

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
      setLogs(prev => [...prev, '> Success'])
      toast.success('Done!')
    } catch (err) {
      setStage('error')
      const errMsg = err.response?.data?.msg || err.message || 'Server Busy'
      setLogs(prev => [...prev, `> Error: ${errMsg}`])
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI YTDL</title></Helmet>
      
      <div className="w-full max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <NeoButton variant="white" className="h-10 w-10 p-0 rounded-full flex items-center justify-center">
                <ArrowLeft size={20} />
              </NeoButton>
            </Link>
            
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-black leading-none">
                YTDL <span className="text-[#A3E635] drop-shadow-[2px_2px_0px_black]">KAAI</span>
              </h1>
              <p className="text-[10px] font-bold font-mono text-gray-500 bg-white px-2 py-0.5 border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                SIMPLE DOWNLOADER
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CONFIGURATION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7"
          >
            <NeoCard title="CONFIGURATION" className="bg-[#FFDC58]">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="relative">
                    <NeoInput 
                      label="TARGET URL"
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                      placeholder="https://youtu.be/..." 
                      disabled={loading} 
                    />
                    <button 
                      onClick={handlePaste} 
                      className="absolute right-2 top-8 p-1.5 hover:bg-black hover:text-white rounded transition-colors border-2 border-transparent hover:border-black"
                    >
                      <Clipboard size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-[10px] uppercase ml-1 bg-black text-white px-1.5 py-0.5 rounded-sm inline-block">FORMAT</label>
                  <div className="grid grid-cols-2 gap-3">
                    <NeoButton 
                      variant={type === 'video' ? 'dark' : 'white'}
                      onClick={() => setType('video')}
                      className={type === 'video' ? "ring-2 ring-[#A3E635] ring-offset-2" : ""}
                    >
                      <Video size={18} /> VIDEO
                    </NeoButton>
                    <NeoButton 
                      variant={type === 'mp3' ? 'dark' : 'white'}
                      onClick={() => setType('mp3')}
                      className={type === 'mp3' ? "ring-2 ring-[#A3E635] ring-offset-2" : ""}
                    >
                      <Music size={18} /> AUDIO
                    </NeoButton>
                  </div>
                </div>

                <NeoButton 
                  onClick={handleProcess} 
                  disabled={loading} 
                  className="w-full h-14 text-lg bg-[#FF90E8] hover:bg-[#ff70d9] text-black border-black"
                >
                  {loading ? <Loader className="animate-spin" size={24} /> : <Zap size={24} />}
                  {loading ? 'PROCESSING...' : 'START ENGINE'}
                </NeoButton>
              </div>
            </NeoCard>
          </motion.div>

          {/* LOGS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 h-full"
          >
            <NeoCard title="SYSTEM LOGS" className="bg-[#1a1a1a] text-green-400 h-full min-h-[280px] flex flex-col border-black">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-900/30">
                <span className="font-mono text-[10px] flex items-center gap-2">
                  <Activity size={12} className="animate-pulse" /> LIVE STREAM
                </span>
                {loading && <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />}
              </div>
              
              <div className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
                {logs.length === 0 && !loading && (
                  <div className="text-gray-600 italic text-center mt-16 opacity-50">
                    // Ready...
                  </div>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="border-l-2 border-green-700 pl-2 py-0.5 break-words">
                    <span className="opacity-50 mr-2">$</span>{log.replace('> ', '')}
                  </div>
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
                initial={{ opacity: 0, y: 40, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-12"
              >
                <div className="text-center mb-6">
                   <ChevronDown className="mx-auto animate-bounce text-black" size={32} />
                </div>

                <NeoCard className="bg-white p-0 overflow-hidden">
                  {/* HEADER INFO */}
                  <div className="bg-black text-white p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-black">
                    <h3 className="font-black text-lg md:text-xl line-clamp-1 flex-1">{data.title}</h3>
                    <div className="flex gap-2">
                      <span className="bg-[#A3E635] text-black px-2 py-1 text-[10px] font-bold border border-white rounded flex items-center gap-1">
                        <Clock size={12}/> {data.duration}
                      </span>
                      <span className="bg-[#FF90E8] text-black px-2 py-1 text-[10px] font-bold border border-white rounded flex items-center gap-1">
                        <Cpu size={12}/> {data.engine}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                    {/* MEDIA PREVIEW */}
                    <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300 flex flex-col justify-center">
                       {type === 'mp3' ? (
                         <CustomAudioPlayer src={data.preview_url} thumbnail={data.thumbnail} />
                       ) : (
                         <div className="w-full rounded-lg overflow-hidden border-2 border-black bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                            <video 
                              src={data.preview_url} 
                              controls 
                              className="w-full aspect-video" 
                              poster={data.thumbnail} // Thumbnail hanya jadi poster, hilang saat play
                            />
                         </div>
                       )}
                    </div>

                    {/* DETAILS & DOWNLOAD */}
                    <div className="flex flex-col justify-between gap-6">
                      <div className="space-y-4">
                        <div className="bg-[#E0F2FE] border-2 border-[#7DD3FC] p-3 rounded-lg">
                          <p className="text-xs font-bold text-[#0369A1] uppercase mb-1">Author / Channel</p>
                          <div className="flex items-center gap-2 font-black text-lg text-[#0C4A6E]">
                            <CheckCircle size={20} /> {data.author}
                          </div>
                        </div>
                        
                        <div className="bg-[#FEF3C7] border-2 border-[#FCD34D] p-3 rounded-lg">
                          <p className="text-xs font-bold text-[#92400E] uppercase mb-1">File Info</p>
                          <div className="flex items-center gap-2 font-black text-lg text-[#78350F]">
                            <Clipboard size={20} /> {type.toUpperCase()} • HIGH QUALITY
                          </div>
                        </div>
                      </div>

                      <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block mt-auto">
                        <NeoButton className="w-full h-16 text-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white border-black shadow-[4px_4px_0px_0px_black]">
                          <Download size={24} strokeWidth={2.5} /> DOWNLOAD FILE
                        </NeoButton>
                      </a>
                    </div>
                  </div>
                  
                  {/* FOOTER STATS */}
                  {data.stats && (
                    <div className="bg-gray-100 border-t-2 border-black p-2 text-center">
                      <p className="text-[10px] font-mono font-bold text-gray-500">
                        SERVER USAGE: {data.stats.req_min}/5 (MIN) • {data.stats.req_day}/100 (DAY)
                      </p>
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
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 4px;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </PageWrapper>
  )
}
export default Ytdl
