import React, { useState } from 'react'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import {
  Search,
  Download,
  Music,
  Video,
  ArrowLeft,
  Loader,
  CheckCircle,
  AlertTriangle,
  Clipboard,
  Cpu,
  Clock,
  Server
} from 'lucide-react'
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text)
        toast.success('Link ditempel')
      }
    } catch {
      toast.error('Clipboard tidak bisa dibaca')
    }
  }

  const handleProcess = async () => {
    if (!url) {
      toast.error('Masukkan link YouTube')
      return
    }

    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
      toast.error('URL YouTube tidak valid')
      return
    }

    setLoading(true)
    setStage('processing')
    setData(null)

    try {
      const backendType = type === 'mp3' ? 'audio' : 'video'

      const res = await window.apiYtdl.post('/api/ytdl/info', {
        url,
        type: backendType
      })

      if (!res.data?.status) {
        throw new Error(res.data?.msg || 'Gagal memproses')
      }

      setData(res.data.metadata)
      setStage('done')
      toast.success('File siap diputar')

    } catch (err) {
      setStage('error')
      toast.error(err.response?.data?.msg || err.message || 'Server sibuk')
    } finally {
      setLoading(false)
    }
  }

  const mediaFix = e => {
    if (e.target.duration === Infinity || isNaN(e.target.duration)) {
      e.target.currentTime = 1
      e.target.currentTime = 0
    }
  }

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI YTDL</title>
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <Link to="/">
          <NeoButton variant="white" className="h-9 text-xs font-bold border-2 border-black">
            <ArrowLeft size={14} className="mr-1" /> KEMBALI
          </NeoButton>
        </Link>

        <div className="text-right">
          <h1 className="text-3xl font-black italic">
            YT<span className="text-red-500">DL</span>
          </h1>
          <div className="flex items-center gap-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold">BUFFER SERVER</span>
          </div>
        </div>
      </div>

      <NeoCard className="bg-lime-300 border-3 border-black shadow-[6px_6px_0px_0px_black]">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Video size={22} /> DOWNLOADER
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <NeoInput
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Tempel link YouTube..."
              disabled={loading}
              className="pr-12"
            />
            <button
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
            >
              <Clipboard size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NeoButton
              onClick={() => setType('mp3')}
              variant={type === 'mp3' ? 'dark' : 'white'}
              className="h-12 border-2"
            >
              <Music size={18} />
              <span className="ml-2 font-black">MP3</span>
            </NeoButton>

            <NeoButton
              onClick={() => setType('mp4')}
              variant={type === 'mp4' ? 'dark' : 'white'}
              className="h-12 border-2"
            >
              <Video size={18} />
              <span className="ml-2 font-black">MP4</span>
            </NeoButton>
          </div>

          <NeoButton
            onClick={handleProcess}
            disabled={loading}
            className="w-full h-14 font-black border-2 border-black bg-red-500 text-white"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" />
                BUFFERING...
              </>
            ) : (
              <>
                <Search className="mr-2" />
                PROSES
              </>
            )}
          </NeoButton>

          {stage === 'processing' && (
            <div className="bg-black/10 p-3 border-2 border-black border-dashed text-xs font-bold flex gap-2 justify-center">
              <Cpu className="animate-spin" size={14} />
              Downloading ke server
            </div>
          )}

          {stage === 'error' && (
            <div className="bg-red-500 text-white p-3 border-2 border-black text-xs font-bold flex gap-2">
              <AlertTriangle size={16} />
              Terjadi kesalahan
            </div>
          )}
        </div>
      </NeoCard>

      <AnimatePresence>
        {data && stage === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <NeoCard className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_black]">
              <img
                src={data.thumbnail}
                alt=""
                className="w-full aspect-video object-cover border-2 border-black mb-4"
              />

              <h3 className="font-black text-lg mb-2">{data.title}</h3>

              <div className="flex gap-2 text-xs font-bold mb-3">
                {data.duration && (
                  <span className="border px-2 py-1 flex items-center gap-1">
                    <Clock size={12} /> {data.duration}
                  </span>
                )}
                {data.engine && (
                  <span className="border px-2 py-1 flex items-center gap-1">
                    <Cpu size={12} /> {data.engine}
                  </span>
                )}
                {data.author && (
                  <span className="border px-2 py-1 flex items-center gap-1">
                    <CheckCircle size={12} /> {data.author}
                  </span>
                )}
              </div>

              <div className="bg-black p-2 border-2 border-black">
                {type === 'mp3' ? (
                  <audio
                    key={data.preview_url}
                    src={data.preview_url}
                    controls
                    preload="auto"
                    crossOrigin="anonymous"
                    controlsList="nodownload noplaybackrate"
                    onLoadedMetadata={mediaFix}
                    className="w-full"
                  />
                ) : (
                  <video
                    key={data.preview_url}
                    src={data.preview_url}
                    controls
                    preload="auto"
                    crossOrigin="anonymous"
                    controlsList="nodownload noplaybackrate"
                    onLoadedMetadata={mediaFix}
                    className="w-full aspect-video bg-black"
                  />
                )}
              </div>

              <a
                href={data.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4"
              >
                <NeoButton className="w-full h-12 font-black border-2 border-black bg-blue-500 text-white">
                  <Download size={18} className="mr-2" />
                  SIMPAN
                </NeoButton>
              </a>

              <div className="text-[10px] text-center text-gray-400 mt-2 flex gap-1 justify-center">
                <Server size={10} /> File otomatis terhapus 3 jam
              </div>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}

export default Ytdl
