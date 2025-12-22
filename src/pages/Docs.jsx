import React from 'react';
import { NeoCard } from '../components/NeoUI';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const Docs = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Disalin ke clipboard!');
    };

    const CodeBlock = ({ method, url, body }) => (
        <div className="bg-[#1e1e1e] border-2 border-black p-4 text-sm font-mono text-gray-300 relative group overflow-x-auto">
            <button 
                onClick={() => copyToClipboard(`${method} ${url}`)}
                className="absolute top-2 right-2 p-1 bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Copy size={14}/>
            </button>
            <div className="flex gap-2 mb-2 border-b border-gray-700 pb-2">
                <span className={`font-bold ${method === 'GET' ? 'text-blue-400' : 'text-green-400'}`}>{method}</span>
                <span className="text-white">{url}</span>
            </div>
            {body && <pre className="text-yellow-300 whitespace-pre-wrap">{body}</pre>}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-black border-b-4 border-black pb-4">📖 DOKUMENTASI API</h1>
            
            <p className="font-medium text-lg">
                Gunakan API Kaai secara gratis untuk project anda. Harap sertakan kredit author.
            </p>

            <NeoCard title="1. SEARCH YOUTUBE" className="bg-white">
                <CodeBlock 
                    method="GET" 
                    url={`${baseUrl}/api/ytdl/search?query={keyword}`} 
                />
            </NeoCard>

            <NeoCard title="2. DOWNLOAD MP3" className="bg-white">
                <CodeBlock 
                    method="GET" 
                    url={`${baseUrl}/api/ytdl/mp3?url={youtube_url}`} 
                />
                <div className="my-2 text-center font-bold text-sm">- ATAU POST -</div>
                <CodeBlock 
                    method="POST" 
                    url={`${baseUrl}/api/ytdl/mp3`} 
                    body={`{ "url": "https://youtu.be/..." }`}
                />
            </NeoCard>

            <NeoCard title="3. DOWNLOAD MP4" className="bg-white">
                <CodeBlock 
                    method="POST" 
                    url={`${baseUrl}/api/ytdl/mp4`} 
                    body={`{ "url": "https://youtu.be/..." }`}
                />
            </NeoCard>
        </div>
    );
};

export default Docs;
