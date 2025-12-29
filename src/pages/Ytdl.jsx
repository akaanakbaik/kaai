import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NeoCard, NeoButton, NeoInput, PageWrapper } from '../components/NeoUI'
import {
  Search,
  Download,
  Music,
  Video,
  ArrowLeft,
  Loader,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'

const STAGES = [
  'Validasi URL',
  'Menyiapkan engine',
  'Menjalankan proses utama',
  'Menjalankan fallback',
  'Menyiapkan output',
  'Selesai'
]

const Ytdl = () => {
  const [url, setUrl] = useState('')
  const [type, setType] = useState('mp4')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [stage, setStage] = useState(0)

  const reset = () => {
    setData(null)
    setStage(0)
  }

  const handleProcess = async () => {
    if (!url) {
      toast.error('Link wajib diisi')
      return
    }

    reset()
    setLoading(true)

    try {
      setStage(0)
      await new Promise(r => setTimeout(r, 300))

      setStage(1)
      await new Promise(r => setTimeout(r, 300))

      const endpoint =
        type === 'mp3'
          ? '/api/ytdl/mp3'
          : type === 'mp4'
          ? '/api/ytdl/mp4'
          : '/api/ytdl/info'

      setStage(2)

      const res = await window.apiYtdl.post(endpoint, { url })

      if (!res.data?.status) {
        throw new Error(res.data?.msg || 'Gagal mengambil data')
      }

      setStage(4)
      await new Promise(r => setTimeout(r, 300))

      setData(res.data.metadata)
      setStage(5)

      toast.success('Berhasil diproses')

    } catch (err) {
      console.error(err)
      toast.error(
        err.response?.data?.msg ||
        err.message ||
        'Terjadi kesalahan pada server'
      )
      setStage(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Helmet>
        <title>KAAI YTDL</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <NeoButton variant="white" className="h-8 text-[10px]">
            <ArrowLeft size={12} /> KEMBALI
          </NeoButton>
        </Link>
        <h1 className="text-2xl font-black italic tracking-tighter">
          YT<span className="text-red-600">DL</span>
        </h1>
      </div>

      <div className="max-w-xl mx-auto space-y-5">
        <NeoCard title="KONVERTER" className="bg-[#FFDC58]">
          <div className="space-y-4">
            <NeoInput
              placeholder="https://youtube.com/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <NeoButton
                onClick={() => setType('mp3')}
                variant={type === 'mp3' ? 'dark' : 'white'}
              >
                <Music size={16} /> MP3
              </NeoButton>

              <NeoButton
                onClick={() => setType('mp4')}
                variant={type === 'mp4' ? 'dark' : 'white'}
              >
                <Video size={16} /> MP4
              </NeoButton>
            </div>

            <NeoButton
              onClick={handleProcess}
              disabled={loading}
              className="w-full h-12 text-sm"
              variant="dark"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  MEMPROSES
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search size={16} />
                  PROSES
                </span>
              )}
            </NeoButton>
          </div>
        </NeoCard>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <NeoCard title="PROGRESS" className="bg-white">
                <ul className="space-y-2 text-sm font-bold">
                  {STAGES.map((s, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 ${
                        stage === i
                          ? 'text-black'
                          : stage > i
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage > i ? (
                        <CheckCircle size={14} />
                      ) : stage === i ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <AlertTriangle size={14} />
                      )}
                      {s}
                    </li>
                  ))}
                </ul>
              </NeoCard>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <NeoCard title="HASIL">
                <img
                  src={data.thumbnail}
                  alt="thumbnail"
                  className="w-full rounded border-2 border-black"
                />

                <h3 className="mt-2 font-black text-sm">
                  {data.title}
                </h3>

                <div className="mt-3 bg-black rounded overflow-hidden">
                  {type === 'mp3' ? (
                    <audio controls className="w-full">
                      <source src={data.url} />
                    </audio>
                  ) : (
                    <video controls className="w-full">
                      <source src={data.url} />
                    </video>
                  )}
                </div>

                <a
                  href={data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-3"
                >
                  <NeoButton variant="primary" className="w-full">
                    <Download size={16} /> DOWNLOAD
                  </NeoButton>
                </a>
              </NeoCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}

export default Ytdl
