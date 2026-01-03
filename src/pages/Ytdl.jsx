import React, { useState, useEffect, useRef } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import { Search, Download, Music, Video, ArrowLeft, Loader, AlertTriangle, Clipboard, Cpu, Clock, Server, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

const Ytdl = () => {
  const [url, setUrl] = useState('')
  const [type, setType] = useState('mp4')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('idle')
  const [data, setData] = useState(null)
  const [wsMsg, setWsMsg] = useState('Waiting...')
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket("wss://api-ytdlpy.akadev.me/ws/progress")
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.msg) setWsMsg(msg.msg)
    }
    return () => ws.current?.close()
  }, [])

  const handleProcess = async () => {
    if (!url) return toast.error('Masukkan link YouTube')
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) return toast.error('URL YouTube tidak valid')
    
    setLoading(true); setStage('processing'); setData(null); setWsMsg("Initializing...")
    
    try {
      const res = await window.apiYtdl.post('/api/ytdl/info', { url, type: type === 'mp3' ? 'audio' : 'video' })
      if (!res.data?.status) throw new Error(res.data?.msg || 'Gagal memproses')
      setData(res.data.metadata); setStage('done'); toast.success('Selesai!')
    } catch (err) {
      setStage('error'); 
      const msg = err.response?.data?.msg || err.message
      toast.error(typeof msg === 'object' ? 'Rate Limit Exceeded' : msg)
      if(typeof msg === 'string') setWsMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet><title>KAAI ULTIMATE YTDL</title></Helmet>
      <div className="flex items-center justify-between mb-8">
        <Link to="/"><NeoButton variant="white" className="h-9 text-xs font-bold border-2 border-black"><ArrowLeft size={14} className="mr-1" /> BACK</NeoButton></Link>
        <div className="text-right">
          <h1 className="text-3xl font-black italic">YT<span className="text-red-500">DL</span> V2</h1>
          <div className="flex items-center gap-1 justify-end text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> SYSTEM ACTIVE
          </div>
        </div>
      </div>

      <NeoCard className="bg-lime-300 border-3 border-black shadow-[6px_6px_0px_0px_black] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-black text-white text-[9px] px-2 py-1 font-mono">MODE: FORCE_OPTIMAL</div>
        <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Video size={22} /> DOWNLOADER</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <NeoInput value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste Youtube Link..." disabled={loading} className="pr-12" />
            <button onClick={() => navigator.clipboard.readText().then(t => setUrl(t))} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"><Clipboard size={18} /></button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NeoButton onClick={() => setType('mp3')} variant={type === 'mp3' ? 'dark' : 'white'} className="h-12 border-2"><Music size={18} /><span className="ml-2 font-black">MP3 (FAST)</span></NeoButton>
            <NeoButton onClick={() => setType('mp4')} variant={type === 'mp4' ? 'dark' : 'white'} className="h-12 border-2"><Video size={18} /><span className="ml-2 font-black">MP4 (FULL)</span></NeoButton>
          </div>

          <NeoButton onClick={handleProcess} disabled={loading} className={`w-full h-14 font-black border-2 border-black ${loading ? 'bg-gray-400' : 'bg-red-500 text-white'}`}>
            {loading ? <><Loader className="animate-spin mr-2" /> PROCESSING...</> : <><Search className="mr-2" /> EXECUTE</>}
          </NeoButton>

          {stage === 'processing' && (
            <div className="bg-black/10 p-3 border-2 border-black border-dashed text-xs font-bold font-mono">
              <div className="flex items-center gap-2 mb-1"><Cpu className="animate-spin" size={14} /> SYSTEM LOG:</div>
              <p className="text-blue-700">> {wsMsg}</p>
            </div>
          )}
        </div>
      </NeoCard>

      <AnimatePresence>
        {data && stage === 'done' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <NeoCard className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_black]">
              <div className="flex flex-col md:flex-row gap-4">
                <img src={data.thumbnail} alt="" className="w-full md:w-1/3 aspect-video object-cover border-2 border-black" />
                <div className="flex-1">
                  <h3 className="font-black text-lg mb-2 line-clamp-2">{data.title}</h3>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold mb-3 uppercase">
                    <span className="bg-gray-100 border px-2 py-1 flex items-center gap-1"><Clock size={10} /> {data.duration}</span>
                    <span className="bg-gray-100 border px-2 py-1 flex items-center gap-1"><Cpu size={10} /> {data.engine}</span>
                  </div>
                  {data.stats && (
                    <div className="text-[10px] bg-yellow-100 p-2 border border-black mb-3">
                      <p>IP LIMIT: {data.stats.req_min}/5 (Min) | {data.stats.req_day}/100 (Day)</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                     <a href={data.download_url} target="_blank" rel="noopener noreferrer"><NeoButton className="w-full h-10 font-bold border-2 border-black bg-blue-500 text-white"><Download size={14} className="mr-1" /> SAVE FILE</NeoButton></a>
                     <a href={data.preview_url} target="_blank" rel="noopener noreferrer"><NeoButton className="w-full h-10 font-bold border-2 border-black bg-white"><Wifi size={14} className="mr-1" /> STREAM</NeoButton></a>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-black p-2 border-2 border-black">
                {type === 'mp3' ? 
                  <audio src={data.preview_url} controls className="w-full h-8" /> : 
                  <video src={data.preview_url} controls className="w-full aspect-video bg-black" />
                }
              </div>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
export default Ytdl
