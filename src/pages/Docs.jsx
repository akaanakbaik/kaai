import React from 'react';
import { Link } from 'react-router-dom';
import { NeoCard, NeoButton, PageWrapper } from '../components/NeoUI';
import { ArrowLeft, Server, Terminal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Docs = () => {
    return (
        <PageWrapper>
            <Helmet><title>KAAI - API Documentation</title></Helmet>
            
            <div className="mb-8">
                <Link to="/"><NeoButton variant="white" className="text-xs"><ArrowLeft size={14}/> KEMBALI</NeoButton></Link>
            </div>

            <div className="text-center mb-10">
                <h1 className="text-5xl font-black mb-2">API DOCS</h1>
                <p className="font-bold text-gray-500">Integrasikan fitur KAAI ke aplikasimu.</p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
                <NeoCard title="BASE URL" className="bg-black text-white">
                    <code className="font-mono text-green-400">https://kaai-api.akadev.me/api</code>
                </NeoCard>

                <NeoCard title="ENDPOINTS" className="bg-white">
                    <div className="space-y-4 font-mono text-sm">
                        
                        <div className="border-b-2 border-dashed border-gray-300 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                <span className="font-bold">/ytdl/mp3</span>
                            </div>
                            <p className="text-gray-600 mb-1">Download YouTube Audio</p>
                            <div className="bg-gray-100 p-2 rounded border border-gray-300">
                                ?url=https://youtube.com/...
                            </div>
                        </div>

                        <div className="border-b-2 border-dashed border-gray-300 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                <span className="font-bold">/ytdl/mp4</span>
                            </div>
                            <p className="text-gray-600 mb-1">Download YouTube Video</p>
                            <div className="bg-gray-100 p-2 rounded border border-gray-300">
                                ?url=https://youtube.com/...
                            </div>
                        </div>

                        <div className="border-b-2 border-dashed border-gray-300 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                <span className="font-bold">/ai</span>
                            </div>
                            <p className="text-gray-600 mb-1">Chat dengan AI</p>
                            <div className="bg-gray-100 p-2 rounded border border-gray-300">
                                ?query=Halo&model=kaai cplt
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                <span className="font-bold">/ssweb</span>
                            </div>
                            <p className="text-gray-600 mb-1">Screenshot Website</p>
                            <div className="bg-gray-100 p-2 rounded border border-gray-300">
                                ?url=https://google.com&type=desktop
                            </div>
                        </div>

                    </div>
                </NeoCard>
            </div>
        </PageWrapper>
    );
};

export default Docs;
