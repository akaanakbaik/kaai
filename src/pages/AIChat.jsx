import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, ArrowLeft, MoreVertical, Phone, Video, Search, Paperclip, Mic, X, Reply, Check, CheckCheck, Trash2, Info, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const AIChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [model, setModel] = useState('kaai cplt');
    const [sessionId, setSessionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    const models = [
        { id: 'kaai cplt', name: 'Kaai Copilot', desc: 'Model standar cerdas untuk percakapan umum.', type: 'General' },
        { id: 'meta ai', name: 'Meta AI', desc: 'Model canggih dari Meta (Llama 3).', type: 'Advanced' },
        { id: 'qwen ai', name: 'Qwen AI', desc: 'Model pintar dari Alibaba Cloud.', type: 'Reasoning' },
        { id: 'turboseek', name: 'TurboSeek', desc: 'Mesin pencari AI super cepat.', type: 'Search' },
        { id: 'webpilot', name: 'WebPilot', desc: 'Spesialis browsing dan ekstraksi web.', type: 'Web' },
        { id: 'public-ai', name: 'Public AI', desc: 'Model publik untuk pengetahuan umum.', type: 'General' },
        { id: 'perplexed', name: 'Perplexed', desc: 'Alternatif search engine berbasis AI.', type: 'Search' },
        { id: 'perplexity', name: 'Perplexity', desc: 'Jawaban akurat dengan kutipan sumber.', type: 'Search' },
        { id: 'ciciai', name: 'Cici AI', desc: 'Asisten personal yang ramah.', type: 'Chatbot' },
        { id: 'copilot+memori', name: 'Copilot + Memory', desc: 'Model khusus dengan ingatan jangka panjang.', type: 'Memory' }
    ];

    const currentModelInfo = models.find(m => m.id === model) || models[0];

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleSend = async () => {
        if (!input.trim()) return;
        const txt = input;
        const currentReply = replyTo;
        setInput('');
        setReplyTo(null);
        
        const newMessage = {
            id: Date.now(),
            text: txt,
            sender: 'user',
            time: formatTime(),
            status: 'sent',
            reply: currentReply
        };
        
        setMessages(p => [...p, newMessage]);
        setIsTyping(true);
        setLoading(true);

        try {
            let finalQuery = txt;
            if (currentReply) {
                finalQuery = `[Replying to ${currentReply.sender}: "${currentReply.text.substring(0, 50)}..."] \n${txt}`;
            }

            const res = await axios.get('/api/ai', {
                params: {
                    query: finalQuery,
                    model: model,
                    session_id: model === 'copilot+memori' ? sessionId : undefined
                }
            });

            const replyText = res.data.status ? res.data.result : (res.data.msg || "Server sibuk.");
            
            setMessages(p => p.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
            
            setTimeout(() => {
                setMessages(p => [...p, {
                    id: Date.now() + 1,
                    text: replyText,
                    sender: 'bot',
                    time: formatTime(),
                    model: model
                }]);
                setIsTyping(false);
            }, 500);

        } catch (e) {
            toast.error("Gagal mengirim pesan");
            setIsTyping(false);
            setMessages(p => [...p, { id: Date.now(), text: "Error: Jaringan bermasalah.", sender: 'bot', error: true, time: formatTime() }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
        setShowMenu(false);
        toast.success("Chat dibersihkan");
    };

    return (
        <div className="flex justify-center bg-[#111b21] min-h-screen">
            <Helmet><title>KAAI - WhatsApp Clone</title></Helmet>
            
            <div className="w-full max-w-md bg-[#0b141a] relative flex flex-col h-[100dvh] overflow-hidden shadow-2xl border-x border-[#202c33]">
                
                <div className="bg-[#202c33] px-2 py-2 flex items-center justify-between z-20 shrink-0">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowInfo(true)}>
                        <Link to="/" onClick={(e) => e.stopPropagation()}><button className="p-1 text-[#aebac1]"><ArrowLeft size={24}/></button></Link>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden">
                                <img src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" className="w-full h-full rounded-full object-cover"/>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-[#e9edef] font-medium text-base truncate w-32">{currentModelInfo.name}</h1>
                            <p className="text-[#8696a0] text-xs truncate">{isTyping ? 'typing...' : 'online'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pr-2 text-[#aebac1]">
                        <Video size={22} className="cursor-pointer hover:text-white"/>
                        <Phone size={20} className="cursor-pointer hover:text-white"/>
                        <div className="relative">
                            <button onClick={() => setShowMenu(!showMenu)}><MoreVertical size={22}/></button>
                            {showMenu && (
                                <div className="absolute right-0 top-8 bg-[#233138] rounded-md shadow-lg py-2 w-48 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <button onClick={() => { setShowInfo(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-[#e9edef] hover:bg-[#182229] text-sm">Info Model</button>
                                    <button onClick={handleClearChat} className="w-full text-left px-4 py-3 text-[#e9edef] hover:bg-[#182229] text-sm">Clear Chat</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showInfo && (
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="absolute inset-0 z-50 bg-[#0b141a] flex flex-col">
                            <div className="bg-[#202c33] px-4 py-3 flex items-center gap-4 shrink-0">
                                <button onClick={() => setShowInfo(false)} className="text-[#aebac1]"><ArrowLeft size={24}/></button>
                                <h2 className="text-[#e9edef] font-medium text-lg">Contact Info</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto pb-10">
                                <div className="bg-[#111b21] flex flex-col items-center py-8 mb-3">
                                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#202c33]">
                                        <img src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" className="w-full h-full object-cover"/>
                                    </div>
                                    <h2 className="text-[#e9edef] text-2xl font-medium">{currentModelInfo.name}</h2>
                                    <p className="text-[#8696a0] text-sm mt-1">{currentModelInfo.type} • AI Model</p>
                                </div>
                                <div className="bg-[#111b21] p-4 mb-3">
                                    <p className="text-[#8696a0] text-sm font-medium mb-1">About</p>
                                    <p className="text-[#e9edef] text-base">{currentModelInfo.desc}</p>
                                </div>
                                <div className="bg-[#111b21] p-4 mb-3">
                                    <p className="text-[#8696a0] text-sm font-medium mb-2">Select AI Model</p>
                                    <div className="space-y-1">
                                        {models.map(m => (
                                            <button key={m.id} onClick={() => { setModel(m.id); setShowInfo(false); }} className={`w-full flex items-center justify-between p-3 rounded hover:bg-[#202c33] transition-colors ${model === m.id ? 'bg-[#202c33]' : ''}`}>
                                                <div className="text-left">
                                                    <div className="text-[#e9edef] font-medium">{m.name}</div>
                                                    <div className="text-[#8696a0] text-xs">{m.type}</div>
                                                </div>
                                                {model === m.id && <Check size={18} className="text-[#00a884]"/>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {model === 'copilot+memori' && (
                                    <div className="bg-[#111b21] p-4 mb-3 animate-in slide-in-from-top-5">
                                        <p className="text-[#8696a0] text-sm font-medium mb-2">Session ID (Memory)</p>
                                        <div className="flex items-center border-b-2 border-[#00a884]">
                                            <input value={sessionId} onChange={e => setSessionId(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))} placeholder="Isi ID Unik (e.g. user_123)" className="w-full bg-transparent text-[#e9edef] py-2 outline-none"/>
                                        </div>
                                        <p className="text-[#8696a0] text-xs mt-2">Hanya huruf, angka, - dan _</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0b141a] bg-opacity-95 scroll-smooth" ref={scrollRef} style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: 'overlay' }}>
                    {messages.length === 0 && (
                        <div className="flex justify-center mt-10">
                            <div className="bg-[#1f2c34] text-[#ffd279] text-xs px-3 py-2 rounded-lg shadow text-center max-w-[80%]">
                                🔒 Pesan diproses secara aman dengan enkripsi End-to-End oleh Server KAAI.
                            </div>
                        </div>
                    )}
                    
                    {messages.map((m) => (
                        <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative max-w-[85%] rounded-lg px-2 py-1 shadow-sm text-sm group ${m.sender === 'user' ? 'bg-[#005c4b] rounded-tr-none text-[#e9edef]' : 'bg-[#202c33] rounded-tl-none text-[#e9edef]'}`}>
                                {m.reply && (
                                    <div className="mb-1 bg-black/20 border-l-4 border-[#00a884] rounded p-1 text-xs cursor-pointer opacity-80" onClick={() => {
                                        // Scroll to reply logic could be added here
                                    }}>
                                        <div className="font-bold text-[#00a884]">{m.reply.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                        <div className="truncate text-[#cfd3d5]">{m.reply.text}</div>
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap leading-relaxed pb-4 pr-2 pl-1 pt-1 break-words">{m.text}</div>
                                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                                    <span className="text-[10px] text-[#8696a0]">{m.time}</span>
                                    {m.sender === 'user' && (
                                        <span className={m.status === 'read' ? 'text-[#53bdeb]' : 'text-[#8696a0]'}>
                                            <CheckCheck size={14}/> 
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => setReplyTo(m)} className="absolute top-1 right-1 p-1 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Reply size={12} className="text-white"/>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-[#202c33] p-2 flex items-end gap-2 z-20 shrink-0">
                    <AnimatePresence>
                        {replyTo && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="absolute bottom-16 left-2 right-2 bg-[#1f2c34] rounded-lg border-l-4 border-[#00a884] p-2 z-30 shadow-lg overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-[#00a884] text-xs font-bold">{replyTo.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                        <div className="text-[#cfd3d5] text-xs truncate max-w-[250px]">{replyTo.text}</div>
                                    </div>
                                    <button onClick={() => setReplyTo(null)}><X size={16} className="text-[#8696a0]"/></button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="p-3 text-[#8696a0] hover:text-white transition"><Paperclip size={24}/></button>
                    
                    <div className="flex-1 bg-[#2a3942] rounded-2xl flex items-center px-4 py-2 min-h-[45px]">
                        <input
                            ref={inputRef}
                            className="bg-transparent w-full text-[#e9edef] outline-none text-base placeholder-[#8696a0]"
                            placeholder="Ketik pesan..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={loading}
                        />
                    </div>
                    
                    <button onClick={input.trim() ? handleSend : null} className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 ${input.trim() ? 'bg-[#00a884] text-white hover:bg-[#008f6f]' : 'bg-[#2a3942] text-[#8696a0]'}`}>
                        {input.trim() ? <Send size={20}/> : <Mic size={20}/>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
