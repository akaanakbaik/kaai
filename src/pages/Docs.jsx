import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { NeoCard, NeoButton, PageWrapper } from '../components/NeoUI'
import { ArrowLeft, Terminal, Copy, Check, Code, Zap } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'

const EndpointCard = ({ method, path, desc, params }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://kaai.vercel.app${path}`)
        setCopied(true)
        toast.success('Copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <NeoCard className="bg-white p-0 overflow-hidden mb-6 border-2 border-black shadow-[4px_4px_0px_0px_black] rounded-xl">
            <div className="bg-gray-50 border-b-2 border-black p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-2 overflow-hidden w-full">
                    <span className={`px-2 py-0.5 text-white font-black text-[10px] rounded border border-black shadow-[1px_1px_0px_0px_black] ${method === 'GET' ? 'bg-blue-600' : 'bg-green-600'}`}>
                        {method}
                    </span>
                    <code className="font-mono font-bold text-xs md:text-sm truncate bg-white px-2 py-0.5 border border-gray-300 rounded flex-1 text-black">
                        {path}
                    </code>
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] font-bold bg-white border-2 border-black px-3 py-1 rounded hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_gray] active:shadow-none"
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'COPIED' : 'COPY'}
                </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
                <div>
                    <h4 className="font-black text-xs uppercase flex items-center gap-2 mb-2 text-gray-800">
                        <Terminal size={14} /> Info
                    </h4>
                    <p className="text-xs font-medium text-gray-600 border-l-4 border-black pl-3 py-1 bg-gray-50 rounded-r-md">
                        {desc}
                    </p>
                </div>

                <div>
                    <h4 className="font-black text-xs uppercase flex items-center gap-2 mb-2 text-gray-800">
                        <Zap size={14} /> Params
                    </h4>
                    <div className="overflow-x-auto rounded border-2 border-black">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-black text-white uppercase text-[10px]">
                                <tr>
                                    <th className="px-3 py-2">Key</th>
                                    <th className="px-3 py-2">Required</th>
                                    <th className="px-3 py-2">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white font-mono text-[10px]">
                                {params.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-200 last:border-b-0 hover:bg-yellow-50">
                                        <td className="px-3 py-2 font-bold text-red-600">{p.key}</td>
                                        <td className="px-3 py-2 font-bold">{p.req ? 'YES' : 'NO'}</td>
                                        <td className="px-3 py-2 text-gray-600">{p.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </NeoCard>
    )
}

const Docs = () => {
    return (
        <PageWrapper>
            <Helmet><title>API Docs - KAAI</title></Helmet>
            
            <div className="w-full max-w-4xl mx-auto px-2 pb-16 pt-4">
                <div className="mb-8">
                    <Link to="/">
                        <NeoButton variant="white" className="h-8 text-[10px] mb-4 rounded-lg px-3 border-2">
                            <ArrowLeft size={12} className="mr-1"/> HOME
                        </NeoButton>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none mb-2 text-black">
                        API <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">DOCS</span>
                    </h1>
                    <div className="bg-black text-white text-[10px] md:text-xs font-mono p-3 rounded-lg border-2 border-gray-800 flex flex-col md:flex-row gap-2 justify-between items-center">
                        <span>BASE: https://kaai.vercel.app/api</span>
                        <span className="text-green-400 font-bold">● ONLINE</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="h-1 bg-black flex-1 rounded-full"></div>
                        <span className="font-black text-xs uppercase bg-black text-white px-3 py-1 rounded-full">YouTube</span>
                        <div className="h-1 bg-black flex-1 rounded-full"></div>
                    </div>

                    <EndpointCard 
                        method="GET"
                        path="/api/ytdl/mp3"
                        desc="Get direct download link for YouTube Audio (MP3). Auto metadata included."
                        params={[
                            { key: "url", req: true, desc: "YouTube Link" }
                        ]}
                    />

                    <EndpointCard 
                        method="GET"
                        path="/api/ytdl/mp4"
                        desc="Get direct download link for YouTube Video (MP4). Best Quality."
                        params={[
                            { key: "url", req: true, desc: "YouTube Link" }
                        ]}
                    />
                </div>
            </div>
        </PageWrapper>
    )
}

export default Docs;
