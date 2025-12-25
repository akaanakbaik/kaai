import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, Phone, Video, Smile, Plus, Mic, X, Reply, CheckCheck, Trash2, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const models = [
    { id: 'kaai cplt', name: 'Kaai Copilot', desc: 'Asisten cerdas harian', type: 'General' },
    { id: 'meta ai', name: 'Meta AI', desc: 'Llama 3 High Performance', type: 'Advanced' },
    { id: 'qwen ai', name: 'Qwen AI', desc: 'Logika & Coding', type: 'Reasoning' },
    { id: 'turboseek', name: 'TurboSeek', desc: 'Real-time Browsing', type: 'Search' },
    { id: 'webpilot', name: 'WebPilot', desc: 'Analisa Web URL', type: 'Web' },
    { id: 'ciciai', name: 'Cici AI', desc: 'Teman Empatik', type: 'Chatbot' },
    { id: 'copilot+memori', name: 'Copilot + Memory', desc: 'Ingatan Jangka Panjang', type: 'Memory' }
];

const AIChat = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [model, setModel] = useState('kaai cplt');
    const [sessionId, setSessionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showInfoPanel, setShowInfoPanel] = useState(false);

    const currentModelInfo = models.find(m => m.id === model) || models[0];

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping, replyTo]);

    const fmtTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleSend = async () => {
        if (!input.trim()) return;
        if (model === 'copilot+memori' && !sessionId.trim()) {
            toast.error("Mode Memory butuh Session ID", { style: { background: '#333', color: '#fff' } });
            setShowInfoPanel(true);
            return;
        }

        const txt = input;
        const currentReply = replyTo;
        
        setInput('');
        setReplyTo(null);
        if (inputRef.current) inputRef.current.style.height = 'auto';

        const newMessage = { id: Date.now(), text: txt, sender: 'user', time: fmtTime(), status: 'sent', reply: currentReply };
        setMessages(p => [...p, newMessage]);
        setIsTyping(true);
        setLoading(true);

        try {
            const finalQuery = currentReply ? `[Context: Replying to "${currentReply.text.substring(0, 50)}..."] \n${txt}` : txt;
            const res = await axios.get('/api/ai', {
                params: { query: finalQuery, model: model, session_id: model === 'copilot+memori' ? sessionId : undefined }
            });
            const replyText = res.data.status ? res.data.result : (res.data.msg || "Server busy");
            
            setMessages(p => p.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
            setTimeout(() => {
                setMessages(p => [...p, { id: Date.now() + 1, text: replyText, sender: 'bot', time: fmtTime(), model: model }]);
                setIsTyping(false);
            }, 500);
        } catch (e) {
            setIsTyping(false);
            setMessages(p => [...p, { id: Date.now(), text: "Gagal terhubung ke server.", sender: 'bot', error: true, time: fmtTime() }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        if (window.confirm("Hapus riwayat chat?")) {
            setMessages([]);
            setShowInfoPanel(false);
        }
    };

    return (
        <div className="relative h-[100dvh] w-full bg-[#d1d7db] dark:bg-[#111b21] flex justify-center items-center overflow-hidden font-sans transition-colors duration-300">
            <Helmet><title>KAAI • {currentModelInfo.name}</title></Helmet>
            <div className="absolute top-0 left-0 w-full h-[127px] bg-[#00a884] z-0 hidden md:block dark:hidden"></div>
            
            <div className="relative w-full h-full md:max-w-[1200px] md:h-[95vh] bg-[#f0f2f5] dark:bg-[#0b141a] md:rounded-xl shadow-2xl flex flex-col overflow-hidden border border-transparent md:border-[#e9edef] dark:md:border-[#202c33] z-10 transition-colors duration-300">
                <header className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-3 py-2 flex items-center justify-between z-20 shrink-0 border-b border-[#e9edef] dark:border-none transition-colors duration-300">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <button onClick={() => navigate('/')} className="p-2 text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition">
                            <ArrowLeft size={24}/>
                        </button>
                        <div className="flex items-center gap-3" onClick={() => setShowInfoPanel(true)}>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                                <img src={`https://ui-avatars.com/api/?name=${currentModelInfo.name}&background=00a884&color=fff`} alt="AI" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-[#111b21] dark:text-[#e9edef] font-medium text-[16px] leading-tight">{currentModelInfo.name}</h1>
                                <span className="text-[#667781] dark:text-[#8696a0] text-[13px] truncate">
                                    {isTyping ? <span className="text-[#00a884] font-medium">mengetik...</span> : 'Ketuk untuk info kontak'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pr-2 text-[#54656f] dark:text-[#aebac1]">
                        <button className="hidden sm:block p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><Video size={22}/></button>
                        <button className="hidden sm:block p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><Phone size={22}/></button>
                        <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setShowInfoPanel(true)}><MoreVertical size={22}/></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#efeae2] dark:bg-[#0b141a] scroll-smooth custom-scrollbar relative transition-colors duration-300" ref={scrollRef}>
                    <div className="absolute inset-0 z-0 opacity-40 dark:opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundRepeat: 'repeat' }}></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center mb-6 mt-2 w-full px-2">
                        <div className="bg-[#ffeecd] dark:bg-[#182229] text-[#54656f] dark:text-[#ffd279] text-[12.5px] p-3 rounded-lg shadow-sm text-center max-w-[90%] md:max-w-[60%] border border-transparent dark:border-[#2a3942] leading-relaxed select-none">
                            <p className="flex justify-center items-center gap-1.5 mb-1 font-medium"><span className="text-xs">🔒</span> Pesan terenkripsi end-to-end.</p>
                            <div className="text-xs opacity-90">Ketuk nama bot untuk ganti model atau hapus chat.</div>
                        </div>
                    </div>

                    <div className="relative z-10 pb-2">
                        {messages.map((m) => (
                            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full mb-1 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`relative max-w-[85%] md:max-w-[70%] rounded-lg px-2 py-1.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[14.2px] leading-[19px] break-words group ${m.sender === 'user' ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none' : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none'}`}>
                                    <span className={`absolute top-0 w-0 h-0 border-[8px] border-transparent ${m.sender === 'user' ? '-right-[8px] border-t-[#d9fdd3] dark:border-t-[#005c4b]' : '-left-[8px] border-t-white dark:border-t-[#202c33]'}`}></span>
                                    {m.reply && (
                                        <div className="mb-1 bg-black/5 dark:bg-black/20 border-l-4 border-[#00a884] rounded-[4px] p-1.5 text-xs cursor-pointer opacity-90">
                                            <div className="font-bold text-[#00a884] mb-0.5">{m.reply.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                            <div className="truncate opacity-70">{m.reply.text}</div>
                                        </div>
                                    )}
                                    <div className="whitespace-pre-wrap pb-1 pr-1">{m.text}</div>
                                    <div className="flex justify-end items-center gap-1 mt-[-2px] float-right relative top-1 ml-2">
                                        <span className="text-[11px] text-[#667781] dark:text-[#8696a0] min-w-fit">{m.time}</span>
                                        {m.sender === 'user' && <span className={m.status === 'read' ? 'text-[#53bdeb]' : 'text-[#8696a0]'}><CheckCheck size={16}/></span>}
                                    </div>
                                    <button onClick={() => setReplyTo(m)} className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-[#d9fdd3] dark:from-[#005c4b] to-transparent rounded-bl-lg">
                                        <Reply size={16} className="text-[#54656f] dark:text-[#aebac1]"/>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <footer className="bg-[#f0f2f5] dark:bg-[#202c33] px-2 py-2 flex items-end gap-2 z-20 shrink-0 min-h-[62px] transition-colors duration-300">
                    <AnimatePresence>
                        {replyTo && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute bottom-[62px] left-0 right-0 bg-[#f0f2f5] dark:bg-[#202c33] border-t border-[#d1d7db] dark:border-[#2a3942] p-2 z-30 flex justify-center shadow-lg">
                                <div className="w-full max-w-[95%] bg-white dark:bg-[#1f2c34] rounded-lg border-l-4 border-[#00a884] p-2 flex justify-between items-center">
                                    <div className="overflow-hidden">
                                        <div className="text-[#00a884] text-xs font-bold">{replyTo.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                        <div className="text-[#667781] dark:text-[#8696a0] text-xs truncate">{replyTo.text}</div>
                                    </div>
                                    <button onClick={() => setReplyTo(null)}><X size={20} className="text-[#54656f] dark:text-[#8696a0]"/></button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex gap-2 mb-2 ml-1">
                        <button className="text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#aebac1] transition"><Smile size={26}/></button>
                        <button className="text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#aebac1] transition"><Plus size={26}/></button>
                    </div>
                    <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg px-4 py-2 my-1 shadow-sm flex items-center min-h-[42px] border border-transparent focus-within:border-none">
                        <textarea ref={inputRef} rows={1} className="bg-transparent w-full text-[#111b21] dark:text-[#e9edef] outline-none text-[15px] placeholder-[#667781] dark:placeholder-[#8696a0] resize-none overflow-hidden max-h-[120px]" placeholder="Ketik pesan" value={input} onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }} onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}/>
                    </div>
                    <div className="pb-2 mr-1">
                        <button onClick={input.trim() ? handleSend : null} className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${input.trim() ? 'bg-[#00a884] hover:bg-[#008f6f]' : 'bg-[#f0f2f5] dark:bg-[#202c33]'}`}>
                            {input.trim() ? <Send size={20} className="text-white ml-0.5" /> : <Mic size={24} className="text-[#54656f] dark:text-[#8696a0]"/>}
                        </button>
                    </div>
                </footer>

                <AnimatePresence>
                    {showInfoPanel && (
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="absolute inset-0 z-50 bg-[#f0f2f5] dark:bg-[#0b141a] flex flex-col">
                            <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-4 flex items-center gap-4 shrink-0 shadow-sm border-b border-[#e9edef] dark:border-none">
                                <button onClick={() => setShowInfoPanel(false)} className="text-[#54656f] dark:text-[#aebac1]"><ArrowLeft size={24}/></button>
                                <h2 className="text-[#111b21] dark:text-[#e9edef] font-medium text-[19px]">Info Kontak</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
                                <div className="bg-white dark:bg-[#111b21] flex flex-col items-center py-8 mb-3 shadow-sm transition-colors duration-300">
                                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border shadow-sm">
                                        <img src={`https://ui-avatars.com/api/?name=${currentModelInfo.name}&background=00a884&color=fff`} className="w-full h-full object-cover"/>
                                    </div>
                                    <h2 className="text-[#111b21] dark:text-[#e9edef] text-[22px] font-normal">{currentModelInfo.name}</h2>
                                    <p className="text-[#667781] dark:text-[#8696a0] text-[16px] mt-1">{currentModelInfo.type}</p>
                                </div>
                                {model === 'copilot+memori' && (
                                    <div className="bg-white dark:bg-[#111b21] p-4 mb-3 shadow-sm animate-in fade-in transition-colors duration-300">
                                        <p className="text-[#00a884] text-sm font-medium mb-2">MEMORY SESSION</p>
                                        <div className="flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-2 border-b-2 border-[#00a884]">
                                            <span className="text-[#54656f] dark:text-[#8696a0] mr-2 text-sm">ID:</span>
                                            <input value={sessionId} onChange={e => setSessionId(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))} placeholder="Contoh: user123" className="w-full bg-transparent text-[#111b21] dark:text-[#e9edef] outline-none font-medium"/>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white dark:bg-[#111b21] px-4 py-4 mb-3 shadow-sm transition-colors duration-300">
                                    <p className="text-[#667781] dark:text-[#8696a0] text-sm font-medium mb-4">GANTI MODEL AI</p>
                                    <div className="space-y-1">
                                        {models.map(m => (
                                            <button key={m.id} onClick={() => { setModel(m.id); setShowInfoPanel(false); }} className="w-full flex items-center justify-between py-3 cursor-pointer group">
                                                <div className="text-left flex-1 pr-4">
                                                    <div className={`text-[16px] ${model === m.id ? 'text-[#111b21] dark:text-[#e9edef] font-medium' : 'text-[#111b21] dark:text-[#e9edef]'}`}>{m.name}</div>
                                                    <div className="text-[#667781] dark:text-[#8696a0] text-[13px] mt-0.5">{m.desc}</div>
                                                </div>
                                                {model === m.id && <div className="text-[#00a884]"><Check size={20}/></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-[#111b21] p-4 mb-3 shadow-sm transition-colors duration-300">
                                    <button onClick={handleClear} className="w-full flex items-center gap-4 text-[#ea0038] font-medium py-2 rounded transition"><Trash2 size={20}/>Bersihkan Chat</button>
                                </div>
                                <div className="p-6 text-center">
                                    <div className="flex justify-center items-center gap-2 text-[#8696a0] mb-1"><Info size={14}/><span className="text-xs font-medium">KAAI Enterprise Chat</span></div>
                                    <p className="text-[#8696a0] text-[10px]">v2.5.0 • Secure Connection</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar{width:5px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,0.15);border-radius:10px}.dark .custom-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(255,255,255,0.15)}`}</style>
        </div>
    );
};

export default AIChat;
