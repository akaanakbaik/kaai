import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { NeoCard, NeoButton, PageWrapper } from '../components/NeoUI'
import { ArrowLeft, Server, Terminal, Copy, Check, Code, Globe, Zap } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const EndpointCard = ({ method, path, desc, params, response }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://api-ytdlpy.akadev.me${path}`)
        setCopied(true)
        toast.success('Endpoint copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <NeoCard className="bg-white p-0 overflow-hidden mb-6 border-3 border-black shadow-[6px_6px_0px_0px_black]">
            <div className="bg-gray-50 border-b-3 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3 overflow-hidden w-full">
                    <span className={`px-3 py-1 text-white font-black text-xs rounded border-2 border-black shadow-[2px_2px_0px_0px_black] ${method === 'GET' ? 'bg-blue-600' : 'bg-green-600'}`}>
                        {method}
                    </span>
                    <code className="font-mono font-bold text-sm md:text-base truncate bg-white px-2 py-1 border border-gray-300 rounded flex-1">
                        {path}
                    </code>
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs font-bold bg-white border-2 border-black px-3 py-1.5 rounded hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_gray] active:translate-y-0.5 active:shadow-none"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'COPIED' : 'COPY URL'}
                </button>
            </div>
            
            <div className="p-5 md:p-6 space-y-6">
                <div>
                    <h4 className="font-black text-sm uppercase flex items-center gap-2 mb-3 text-gray-700">
                        <Terminal size={16} /> Description
                    </h4>
                    <p className="text-sm font-medium text-gray-600 border-l-4 border-black pl-3 py-1">
                        {desc}
                    </p>
                </div>

                <div>
                    <h4 className="font-black text-sm uppercase flex items-center gap-2 mb-3 text-gray-700">
                        <Zap size={16} /> Parameters
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-2 border-black">
                            <thead className="bg-black text-white uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Key</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Required</th>
                                    <th className="px-4 py-3">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white font-mono text-xs">
                                {params.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-200 last:border-b-0 hover:bg-yellow-50">
                                        <td className="px-4 py-3 font-bold text-red-600">{p.key}</td>
                                        <td className="px-4 py-3 text-blue-600">{p.type}</td>
                                        <td className="px-4 py-3 font-bold">{p.req ? 'YES' : 'NO'}</td>
                                        <td className="px-4 py-3 text-gray-600">{p.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h4 className="font-black text-sm uppercase flex items-center gap-2 mb-3 text-gray-700">
                        <Code size={16} /> Response
                    </h4>
                    <div className="bg-[#1e1e1e] p-4 rounded-lg border-2 border-black shadow-inner relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-gray-500 font-mono">JSON</span>
                        </div>
                        <pre className="font-mono text-[10px] md:text-xs text-green-400 overflow-x-auto custom-scrollbar leading-relaxed">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </NeoCard>
    )
}

const Docs = () => {
    return (
        <PageWrapper>
            <Helmet><title>API DOCUMENTATION - KAAI</title></Helmet>
            
            <div className="w-full max-w-5xl mx-auto px-4 pb-20 pt-8">
                
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Link to="/">
                            <NeoButton variant="white" className="h-8 text-[10px] mb-4">
                                <ArrowLeft size={12} className="mr-1"/> BACK TO HOME
                            </NeoButton>
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-2">
                            API <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">REFERENCE</span>
                        </h1>
                        <p className="font-bold font-mono text-gray-500 text-xs md:text-sm max-w-xl">
                            Integration guide for KAAI Media Downloader services. High speed, reliable, and developer friendly.
                        </p>
                    </div>
                    
                    <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_black] rounded-xl flex flex-col gap-1 w-full md:w-auto">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Base URL</span>
                        <code className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded select-all">
                            https://api-ytdlpy.akadev.me
                        </code>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-green-600">SYSTEM OPERATIONAL</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    
                    <div className="flex items-center gap-4 my-4">
                        <div className="h-1 bg-black flex-1"></div>
                        <span className="font-black text-xl uppercase bg-black text-white px-4 py-1 -skew-x-12">YouTube Endpoints</span>
                        <div className="h-1 bg-black flex-1"></div>
                    </div>

                    <EndpointCard 
                        method="GET / POST"
                        path="/api/ytdl/mp3"
                        desc="Convert and download YouTube video to MP3 Audio format with metadata."
                        params={[
                            { key: "url", type: "string", req: true, desc: "Valid YouTube Video URL (youtu.be or youtube.com)" },
                            { key: "type", type: "string", req: false, desc: "Force type check (audio/video). Default: audio" }
                        ]}
                        response={{
                            "author": "aka",
                            "email_author": "akaanakbaik17@proton.me",
                            "status": true,
                            "metadata": {
                                "title": "Song Title",
                                "thumbnail": "https://i.ytimg.com/...",
                                "duration": "03:45",
                                "author": "Artist Name",
                                "engine": "Engine A (Audio/Pure)",
                                "filename": "song.mp3",
                                "preview_url": "https://api.../file.mp3",
                                "download_url": "https://api.../file.mp3?download=1"
                            }
                        }}
                    />

                    <EndpointCard 
                        method="GET / POST"
                        path="/api/ytdl/mp4"
                        desc="Download YouTube video in MP4 format (High Quality)."
                        params={[
                            { key: "url", type: "string", req: true, desc: "Valid YouTube Video URL" },
                            { key: "type", type: "string", req: false, desc: "Force type check. Default: video" }
                        ]}
                        response={{
                            "author": "aka",
                            "email_author": "akaanakbaik17@proton.me",
                            "status": true,
                            "metadata": {
                                "title": "Video Title",
                                "thumbnail": "https://i.ytimg.com/...",
                                "duration": "10:20",
                                "author": "Channel Name",
                                "engine": "Engine A (Video/Pure)",
                                "filename": "video.mp4",
                                "preview_url": "https://api.../video.mp4",
                                "download_url": "https://api.../video.mp4?download=1"
                            }
                        }}
                    />

                </div>

                <div className="mt-12 p-8 bg-black text-white text-center rounded-2xl border-4 border-gray-800">
                    <Globe size={32} className="mx-auto mb-4 animate-spin-slow text-purple-400" />
                    <h3 className="text-2xl font-black mb-2">READY TO BUILD?</h3>
                    <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                        Start integrating our API into your applications today. No API key required for free tier usage.
                    </p>
                    <a href="mailto:akaanakbaik17@proton.me" className="inline-block">
                        <button className="bg-white text-black px-8 py-3 font-black text-sm uppercase rounded-lg hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_0px_gray] active:translate-y-1 active:shadow-none">
                            Contact Developer
                        </button>
                    </a>
                </div>

            </div>
            
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 10s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </PageWrapper>
    )
}

export default Docs
