import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { 
  Video, Music, ArrowLeft, Loader, Clipboard, 
  Terminal, Zap, CheckCircle, Clock, Cpu, 
  Download, ChevronDown, Activity
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
    setLogs(['> Initializing...'])

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
      toast.error(typeof errMsg === 'object' ? 'Limit Exceeded' : errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI YTDL</title></Helmet>
      
      <div className="w-full max-w-5xl mx-auto px-4 pb-20 pt-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6"
        >
          <div className="flex items-center gap-5">
            <Link to="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#f0f0f0] border-2 border-black w-10 h-10 flex items-center justify-center rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </motion.button>
            </Link>
            
            <div className="flex items-center gap-4">
              <img 
                src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" 
                alt="Logo" 
                className="w-12 h-12 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_black]"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-gray-800">
                  YTDL <span className="text-[#6c5ce7]">KAAI</span>
                </h1>
                <p className="text-xs font-bold font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 inline-block">
                  ytdl simpel by kaai
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <NeoCard className="bg-white border-3 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden">
              <div className="bg-[#f8f9fa] px-6 py-4 border-b-3 border-black flex justify-between items-center">
                <h2 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                  <Terminal size={16} /> CONFIGURATION
                </h2>
                <div className="flex gap-2 opacity-50">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Paste Link Here</label>
                  <div className="relative group">
                    <input 
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                      placeholder="https://youtube.com/..." 
                      disabled={loading} 
                      className="w-full pl-5 pr-12 h-14 text-base font-bold text-gray-800 border-3 border-black rounded-xl bg-[#fff] focus:outline-none focus:bg-[#fdfdfd] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all placeholder:text-gray-300" 
                    />
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePaste} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                    >
                      <Clipboard size={20} />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType('video')} 
                    className={`h-14 border-3 border-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${type === 'video' ? 'bg-[#ff9f43] text-white shadow-[2px_2px_0px_0px_black] translate-y-0.5' : 'bg-white text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-gray-50'}`}
                  >
                    <Video size={18} /> VIDEO
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType('mp3')} 
                    className={`h-14 border-3 border-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${type === 'mp3' ? 'bg-[#ff9f43] text-white shadow-[2px_2px_0px_0px_black] translate-y-0.5' : 'bg-white text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-gray-50'}`}
                  >
                    <Music size={18} /> AUDIO
                  </motion.button>
                </div>

                <motion.button 
                  whileHover={!loading ? { y: -2, boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" } : {}}
                  whileTap={!loading ? { y: 0, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" } : {}}
                  onClick={handleProcess} 
                  disabled={loading} 
                  className={`w-full h-16 border-3 border-black rounded-xl font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${loading ? 'bg-gray-200 text-gray-400 border-gray-300 shadow-none cursor-not-allowed' : 'bg-[#6c5ce7] text-white'}`}
                >
                  {loading ? <Loader className="animate-spin" size={24} /> : <Zap size={24} className="fill-white" />}
                  {loading ? 'PROCESSING...' : 'CONVERT NOW'}
                </motion.button>
              </div>
            </NeoCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 h-full"
          >
            <NeoCard className="bg-[#1e272e] border-3 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] rounded-2xl h-full min-h-[200px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
                <span className="text-[#00d2d3] font-mono text-xs font-bold flex items-center gap-2">
                  <Activity size={14} className="animate-pulse" /> ACTIVITY LOG
                </span>
                {loading && <div className="w-2 h-2 rounded-full bg-[#00d2d3] animate-ping" />}
              </div>
              
              <div className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
                {logs.length === 0 && !loading && (
                  <div className="text-gray-600 italic text-center mt-10 opacity-50">
                    Ready to start...
                  </div>
                )}
                {logs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="text-[#c8d6e5] border-l-2 border-[#576574] pl-3 py-1 leading-relaxed"
                  >
                    {log}
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </NeoCard>
          </motion.div>
        </div>

        <div ref={resultRef}>
          <AnimatePresence>
            {data && stage === 'done' && (
              <motion.div 
                initial={{ opacity: 0, y: 60, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mt-16"
              >
                <div className="text-center mb-6 text-gray-400">
                   <ChevronDown className="mx-auto animate-bounce" size={32} />
                </div>

                <NeoCard className="bg-white border-3 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-2xl max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-5/12 relative h-64 md:h-auto bg-gray-100 group overflow-hidden">
                       <motion.img 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          src={data.thumbnail} 
                          alt="" 
                          className="w-full h-full object-cover" 
                       />
                       <div className="absolute top-4 left-4 z-10">
                          <span className="bg-white/90 backdrop-blur-sm text-black border border-black/10 px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                             {type === 'mp3' ? <Music size={12} /> : <Video size={12} />} {type.toUpperCase()}
                          </span>
                       </div>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
                      <div>
                        <h3 className="font-black text-xl md:text-2xl leading-snug mb-3 text-gray-800 line-clamp-2">{data.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-gray-50 border border-gray-200 px-3 py-1 text-[10px] font-bold text-gray-600 rounded-full flex items-center gap-1"><Clock size={12}/> {data.duration}</div>
                          <div className="bg-gray-50 border border-gray-200 px-3 py-1 text-[10px] font-bold text-gray-600 rounded-full flex items-center gap-1"><CheckCircle size={12}/> {data.author}</div>
                          <div className="bg-[#ff9f43]/10 border border-[#ff9f43]/30 px-3 py-1 text-[10px] font-bold text-[#ff9f43] rounded-full flex items-center gap-1"><Cpu size={12}/> {data.engine}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[#f1f2f6] p-2 rounded-xl border border-gray-200">
                          {type === 'mp3' ? (
                            <audio src={data.preview_url} controls className="w-full h-10" />
                          ) : (
                            <video src={data.preview_url} controls className="w-full aspect-video rounded-lg bg-black" />
                          )}
                        </div>

                        <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="block">
                          <motion.button 
                            whileHover={{ y: -2, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                            whileTap={{ y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                            className="w-full h-14 bg-[#10ac84] text-white font-black border-2 border-black rounded-xl flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_black] text-base md:text-lg transition-all"
                          >
                            <Download size={20} strokeWidth={2.5} /> SAVE TO DEVICE
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2f3640;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #576574;
          border-radius: 4px;
        }
      `}</style>
    </PageWrapper>
  )
}
export default Ytdl
