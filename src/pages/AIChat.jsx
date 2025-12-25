import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    Send, ArrowLeft, MoreVertical, Phone, Video, Search, Paperclip, 
    Mic, X, Reply, CheckCheck, Trash2, Info, Smile, Plus, ChevronRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

// --- CONFIGURATION ---
const models = [
    { id: 'kaai cplt', name: 'Kaai Copilot', desc: 'Model standar cerdas untuk percakapan umum.', type: 'General' },
    { id: 'meta ai', name: 'Meta AI', desc: 'Model canggih dari Meta (Llama 3).', type: 'Advanced' },
    { id: 'qwen ai', name: 'Qwen AI', desc: 'Model pintar dari Alibaba Cloud.', type: 'Reasoning' },
    { id: 'turboseek', name: 'TurboSeek', desc: 'Mesin pencari AI super cepat.', type: 'Search' },
    { id: 'webpilot', name: 'WebPilot', desc: 'Spesialis browsing dan ekstraksi web.', type: 'Web' },
    { id: 'ciciai', name: 'Cici AI', desc: 'Asisten personal yang ramah.', type: 'Chatbot' },
    { id: 'copilot+memori', name: 'Copilot + Memory', desc: 'Model khusus dengan ingatan jangka panjang.', type: 'Memory' }
];

const AIChat = () => {
    // --- STATE ---
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [model, setModel] = useState('kaai cplt');
    const [sessionId, setSessionId] = useState(''); // Default kosong
    const [loading, setLoading] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showInfoPanel, setShowInfoPanel] = useState(false); // Pengganti Sidebar, Panel Info Kanan

    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    const currentModelInfo = models.find(m => m.id === model) || models[0];

    // --- EFFECTS ---
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, replyTo]);

    // --- LOGIC ---
    const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleSend = async () => {
        if (!input.trim()) return;

        // Validasi Session ID untuk model Memory
        if (model === 'copilot+memori' && !sessionId.trim()) {
            toast.error("Wajib isi Session ID untuk model Memory!", { icon: '🧠' });
            setShowInfoPanel(true); // Buka panel setting otomatis
            return;
        }

        const txt = input;
        const currentReply = replyTo;
        
        setInput('');
        setReplyTo(null);
        if (inputRef.current) inputRef.current.style.height = 'auto';

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
            }, 800);

        } catch (e) {
            toast.error("Gagal mengirim pesan");
            setIsTyping(false);
            setMessages(p => [...p, { 
                id: Date.now(), 
                text: "Error: Jaringan bermasalah.", 
                sender: 'bot', 
                error: true, 
                time: formatTime() 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        if(window.confirm("Hapus semua pesan?")) {
            setMessages([]);
            toast.success("Chat bersih");
            setShowInfoPanel(false);
        }
    };

    const handleInputResize = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    // --- RENDER ---
    return (
        <div className="relative h-[100dvh] w-full bg-[#111b21] flex justify-center items-center overflow-hidden font-sans">
            <Helmet><title>KAAI Chat</title></Helmet>

            {/* Container Utama (Responsive: Full di Mobile, Card di Desktop) */}
            <div className="relative w-full h-full md:max-w-[500px] md:h-[95vh] bg-[#0b141a] md:rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#202c33]">
                
                {/* === HEADER === */}
                <header className="h-[60px] bg-[#202c33] px-3 py-2 flex items-center justify-between z-20 shrink-0 shadow-sm cursor-pointer" onClick={() => setShowInfoPanel(true)}>
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                            <img src={`https://ui-avatars.com/api/?name=${currentModelInfo.name}&background=00a884&color=fff`} alt="AI" className="w-full h-full object-cover"/>
                        </div>
                        
                        {/* Info Nama & Status */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-[#e9edef] font-medium text-base leading-tight flex items-center gap-1">
                                {currentModelInfo.name} 
                                <span className="text-[10px] bg-[#00a884] text-white px-1 rounded ml-1">{currentModelInfo.type}</span>
                            </h1>
                            <span className="text-[#8696a0] text-[13px] truncate">
                                {isTyping ? <span className="text-[#00a884]">sedang mengetik...</span> : 'Ketuk di sini untuk info kontak'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[#00a884]">
                        <Video size={24} className="opacity-80"/>
                        <Phone size={22} className="opacity-80"/>
                        <MoreVertical size={22} className="opacity-80"/>
                    </div>
                </header>

                {/* === CHAT AREA === */}
                <div 
                    className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0b141a] scroll-smooth custom-scrollbar relative" 
                    ref={scrollRef}
                    style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: 'soft-light', backgroundSize: '300px' }}
                >
                    {/* SYSTEM MESSAGE / END-TO-END BOX (Scrollable Item #1) */}
                    <div className="flex flex-col items-center justify-center mb-6 mt-2 w-full px-4">
                        <div className="bg-[#1f2c34] text-[#ffd279] text-[12.5px] p-3 rounded-lg shadow-sm text-center w-full border border-[#233138] leading-relaxed">
                            <p className="mb-2 font-medium flex justify-center items-center gap-1">
                                🔒 Pesan terenkripsi secara end-to-end.
                            </p>
                            <div className="text-[#8696a0] text-xs text-left space-y-1 bg-[#111b21]/50 p-2 rounded">
                                <p>• <b>Ganti Model:</b> Ketuk nama bot di atas (header) untuk buka menu.</p>
                                <p>• <b>Clear Chat:</b> Ada di menu info kontak paling bawah.</p>
                                {model === 'copilot+memori' && (
                                    <p className="text-[#00a884]">
                                        • <b>Memory Mode:</b> Wajib isi <u>Session ID</u> unik di menu info agar bot mengingat percakapan Anda.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MESSAGES LIST */}
                    {messages.map((m) => (
                        <motion.div 
                            key={m.id} 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className={`flex w-full mb-1 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`relative max-w-[85%] rounded-lg px-2 py-1.5 shadow-sm text-[14.2px] leading-[19px] break-words
                                ${m.sender === 'user' ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'}`}
                            >
                                {/* Reply Context */}
                                {m.reply && (
                                    <div className="mb-1 bg-black/20 border-l-4 border-[#00a884] rounded-[4px] p-1.5 text-xs cursor-pointer opacity-80" onClick={() => {
                                        // Optional scroll logic
                                    }}>
                                        <div className="font-bold text-[#00a884] mb-0.5">{m.reply.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                        <div className="truncate text-[#cfd3d5]">{m.reply.text}</div>
                                    </div>
                                )}

                                {/* Message Text */}
                                <div className="pb-1 pr-1">{m.text}</div>

                                {/* Meta (Time & Check) */}
                                <div className="flex justify-end items-center gap-1 mt-[-2px] float-right relative top-1 ml-3">
                                    <span className="text-[11px] text-[#8696a0]">{m.time}</span>
                                    {m.sender === 'user' && (
                                        <span className={m.status === 'read' ? 'text-[#53bdeb]' : 'text-[#8696a0]'}>
                                            <CheckCheck size={15}/> 
                                        </span>
                                    )}
                                </div>

                                {/* Reply Trigger (Hidden untill hover) */}
                                <button 
                                    onClick={() => setReplyTo(m)} 
                                    className="absolute top-0 right-0 p-1 opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-bl-lg"
                                >
                                    <Reply size={12} className="text-white"/>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* === INPUT AREA === */}
                <footer className="bg-[#202c33] px-2 py-2 flex items-end gap-2 z-20 shrink-0 min-h-[62px]">
                    <AnimatePresence>
                        {replyTo && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute bottom-[62px] left-0 right-0 bg-[#1f2c34] border-t border-[#2a3942] p-2 z-30 flex justify-center">
                                <div className="w-full bg-[#111b21] rounded-lg border-l-4 border-[#00a884] p-2 flex justify-between items-center shadow-md">
                                    <div className="overflow-hidden">
                                        <div className="text-[#00a884] text-xs font-bold">{replyTo.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                        <div className="text-[#8696a0] text-xs truncate">{replyTo.text}</div>
                                    </div>
                                    <button onClick={() => setReplyTo(null)}><X size={20} className="text-[#8696a0]"/></button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="p-2 text-[#8696a0] hover:text-white rounded-full mb-1"><Smile size={24}/></button>
                    <button className="p-2 text-[#8696a0] hover:text-white rounded-full mb-1"><Plus size={24}/></button>
                    
                    <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2 my-1 shadow-sm flex items-center min-h-[42px]">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            className="bg-transparent w-full text-[#e9edef] outline-none text-[15px] placeholder-[#8696a0] resize-none overflow-hidden max-h-[120px]"
                            placeholder="Ketik pesan"
                            value={input}
                            onChange={handleInputResize}
                            onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        />
                    </div>
                    
                    <div className="pb-1">
                        <button 
                            onClick={input.trim() ? handleSend : null} 
                            className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${input.trim() ? 'bg-[#00a884] hover:bg-[#008f6f]' : 'bg-[#2a3942]'}`}
                        >
                            {input.trim() ? <Send size={20} className="text-white ml-0.5" /> : <Mic size={20} className="text-[#8696a0]"/>}
                        </button>
                    </div>
                </footer>

                {/* === INFO PANEL OVERLAY (SETTINGS / CONTACT INFO) === */}
                <AnimatePresence>
                    {showInfoPanel && (
                        <motion.div 
                            initial={{ x: '100%' }} 
                            animate={{ x: 0 }} 
                            exit={{ x: '100%' }} 
                            transition={{ type: 'tween', duration: 0.3 }} 
                            className="absolute inset-0 z-50 bg-[#0b141a] flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="bg-[#202c33] h-[60px] px-4 flex items-center gap-4 shrink-0 shadow-md">
                                <button onClick={() => setShowInfoPanel(false)} className="text-[#aebac1]"><ArrowLeft size={24}/></button>
                                <h2 className="text-[#e9edef] font-medium text-lg">Info Kontak</h2>
                            </div>

                            {/* Panel Content */}
                            <div className="flex-1 overflow-y-auto pb-10 bg-[#0b141a]">
                                {/* Profile Section */}
                                <div className="bg-[#111b21] flex flex-col items-center py-8 mb-3 shadow-sm">
                                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#202c33]">
                                        <img src={`https://ui-avatars.com/api/?name=${currentModelInfo.name}&background=00a884&color=fff`} className="w-full h-full object-cover"/>
                                    </div>
                                    <h2 className="text-[#e9edef] text-2xl font-medium">{currentModelInfo.name}</h2>
                                    <p className="text-[#8696a0] text-lg mt-1">{currentModelInfo.type}</p>
                                </div>

                                {/* Session ID Section (Only for Memory Model) */}
                                {model === 'copilot+memori' && (
                                    <div className="bg-[#111b21] p-4 mb-3 shadow-sm animate-in fade-in">
                                        <p className="text-[#00a884] text-sm font-bold mb-2 uppercase tracking-wider">Memory Settings</p>
                                        <p className="text-[#8696a0] text-xs mb-3">Masukkan ID unik (bebas) agar AI mengingat percakapan ini nanti.</p>
                                        <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-2 border border-[#2a3942]">
                                            <span className="text-[#8696a0] mr-2">ID:</span>
                                            <input 
                                                value={sessionId} 
                                                onChange={e => setSessionId(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))} 
                                                placeholder="Contoh: user_123" 
                                                className="w-full bg-transparent text-[#e9edef] outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Model Selector */}
                                <div className="bg-[#111b21] p-4 mb-3 shadow-sm">
                                    <p className="text-[#8696a0] text-sm font-medium mb-3 uppercase">Pilih Model AI</p>
                                    <div className="space-y-0">
                                        {models.map(m => (
                                            <button 
                                                key={m.id} 
                                                onClick={() => { setModel(m.id); setShowInfoPanel(false); }} 
                                                className={`w-full flex items-center justify-between p-3 border-b border-[#202c33] last:border-0 hover:bg-[#202c33] transition-colors`}
                                            >
                                                <div className="text-left flex-1">
                                                    <div className={`text-[16px] ${model === m.id ? 'text-[#00a884] font-medium' : 'text-[#e9edef]'}`}>{m.name}</div>
                                                    <div className="text-[#8696a0] text-xs mt-0.5">{m.desc}</div>
                                                </div>
                                                {model === m.id && <Check size={18} className="text-[#00a884] ml-3"/>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="bg-[#111b21] p-4 mb-3 shadow-sm">
                                    <button onClick={handleClearChat} className="w-full flex items-center gap-3 text-[#f15c6d] font-medium py-2 hover:bg-[#202c33] px-2 rounded transition">
                                        <Trash2 size={20}/>
                                        Bersihkan Chat
                                    </button>
                                </div>

                                <div className="p-4 text-center">
                                    <p className="text-[#667781] text-xs">KAAI AI v2.0 • End-to-End Encryption</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Styles scrollbar khusus */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AIChat;
