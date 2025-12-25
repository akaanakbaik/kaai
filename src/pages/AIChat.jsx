import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    Send, ArrowLeft, MoreVertical, Phone, Video, Search, Paperclip, 
    Mic, X, Reply, CheckCheck, Trash2, Info, Smile, Plus, Image as ImageIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

// --- CONFIGURATION ---
const models = [
    { id: 'kaai cplt', name: 'Kaai Copilot', desc: 'Model standar cerdas.', type: 'General', time: 'Now' },
    { id: 'meta ai', name: 'Meta AI', desc: 'Model canggih Meta (Llama 3).', type: 'Advanced', time: '10:00' },
    { id: 'qwen ai', name: 'Qwen AI', desc: 'Pintar dari Alibaba Cloud.', type: 'Reasoning', time: 'Yesterday' },
    { id: 'turboseek', name: 'TurboSeek', desc: 'Mesin pencari AI cepat.', type: 'Search', time: 'Yesterday' },
    { id: 'webpilot', name: 'WebPilot', desc: 'Browsing & ekstraksi web.', type: 'Web', time: 'Tue' },
    { id: 'ciciai', name: 'Cici AI', desc: 'Asisten personal ramah.', type: 'Chatbot', time: 'Mon' },
    { id: 'copilot+memori', name: 'Copilot + Memory', desc: 'Ingatan jangka panjang.', type: 'Memory', time: 'Sun' }
];

const AIChat = () => {
    // --- STATE MANAGEMENT ---
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [model, setModel] = useState('kaai cplt'); // Default Model
    const [sessionId, setSessionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true); // Control Sidebar di Mobile
    const [replyTo, setReplyTo] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showModelMenu, setShowModelMenu] = useState(false); // Dropdown menu header

    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // Get Current Model Details
    const currentModelInfo = models.find(m => m.id === model) || models[0];

    // --- EFFECTS ---
    // Auto Scroll ke bawah
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, replyTo]);

    // Handle Mobile View: Hide Sidebar saat masuk chat room
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setShowSidebar(true); // Default tampilkan list chat di mobile awal
            } else {
                setShowSidebar(true); // Desktop selalu tampil
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- LOGIC FUNCTIONS ---
    const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleModelSelect = (selectedModelId) => {
        setModel(selectedModelId);
        // Di mobile, setelah pilih model langsung masuk ke chat room
        if (window.innerWidth < 768) setShowSidebar(false); 
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const txt = input;
        const currentReply = replyTo;
        
        // Reset Input UI
        setInput('');
        setReplyTo(null);
        if (inputRef.current) inputRef.current.style.height = 'auto'; // Reset height textarea
        
        // Optimistic Update
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
            // Prepare Query
            let finalQuery = txt;
            if (currentReply) {
                finalQuery = `[Replying to ${currentReply.sender}: "${currentReply.text.substring(0, 50)}..."] \n${txt}`;
            }

            // API Call
            const res = await axios.get('/api/ai', {
                params: {
                    query: finalQuery,
                    model: model,
                    session_id: model === 'copilot+memori' ? sessionId : undefined
                }
            });

            const replyText = res.data.status ? res.data.result : (res.data.msg || "Server sibuk.");
            
            // Update Message Status (Centang Dua Biru)
            setMessages(p => p.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
            
            // Simulate Typing Delay for Realism
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
                text: "Error: Jaringan bermasalah atau API down.", 
                sender: 'bot', 
                error: true, 
                time: formatTime() 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToSidebar = () => {
        setShowSidebar(true);
    };

    // Auto-resize Textarea
    const handleInputResize = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    // --- RENDER ---
    return (
        <div className="relative h-[100dvh] w-full bg-[#d1d7db] flex justify-center items-center overflow-hidden font-sans">
            <Helmet><title>WhatsApp AI - {currentModelInfo.name}</title></Helmet>

            {/* Desktop Background Strip (Hijau di atas) */}
            <div className="absolute top-0 left-0 w-full h-[127px] bg-[#00a884] z-0 hidden md:block"></div>

            {/* APP CONTAINER (Card Floating di Desktop, Full di Mobile) */}
            <div className="relative w-full h-full md:h-[95%] md:max-w-[1600px] md:w-[calc(100%-38px)] bg-[#f0f2f5] md:rounded-lg shadow-lg flex overflow-hidden z-10">
                
                {/* === LEFT SIDEBAR (CHAT LIST) === */}
                <aside className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[30%] md:min-w-[350px] md:max-w-[450px] bg-white border-r border-[#e9edef] h-full absolute md:relative z-20`}>
                    
                    {/* Sidebar Header */}
                    <header className="h-[60px] bg-[#f0f2f5] px-4 flex justify-between items-center shrink-0 border-b border-[#e9edef] md:border-none">
                        <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                            <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex gap-6 text-[#54656f]">
                            <button title="Komunitas"><i className="hidden md:block">👥</i></button>
                            <button title="Status"><div className="w-6 h-6 rounded-full border-2 border-[#54656f] border-dashed"></div></button>
                            <button title="Saluran Baru"><Plus size={24}/></button>
                            <button title="Menu"><MoreVertical size={24}/></button>
                        </div>
                    </header>

                    {/* Search Bar */}
                    <div className="px-3 py-2 bg-white border-b border-[#e9edef]">
                        <div className="bg-[#f0f2f5] rounded-lg px-3 py-1.5 flex items-center gap-3">
                            <Search size={18} className="text-[#54656f]"/>
                            <input type="text" placeholder="Cari atau mulai chat baru" className="bg-transparent w-full outline-none text-sm text-[#3b4a54] placeholder:text-[#54656f]"/>
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                        <div className="px-3 pt-3 pb-2 text-[#008069] text-sm font-medium">AI Models Available</div>
                        {models.map((m) => (
                            <div 
                                key={m.id} 
                                onClick={() => handleModelSelect(m.id)}
                                className={`flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors ${model === m.id ? 'bg-[#f0f2f5]' : ''}`}
                            >
                                <div className="relative shrink-0">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${m.name.replace(' ', '+')}&background=${model === m.id ? '00a884' : 'random'}&color=fff`} 
                                        alt={m.name} 
                                        className="w-[49px] h-[49px] rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 border-b border-[#f0f2f5] pb-3 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className="text-[#111b21] font-normal text-[17px] truncate">{m.name}</h3>
                                        <span className={`text-xs ${model === m.id ? 'text-[#00a884]' : 'text-[#667781]'}`}>{m.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[#667781] text-[14px] truncate pr-2">{m.desc}</p>
                                        {model === m.id && (
                                            <span className="w-5 h-5 bg-[#00a884] text-white text-[10px] flex items-center justify-center rounded-full shrink-0">1</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>


                {/* === RIGHT SIDE (CHAT ROOM) === */}
                <main className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-[#efeae2] h-full relative`}>
                    
                    {/* Chat Background Pattern */}
                    <div className="absolute inset-0 opacity-40 z-0 pointer-events-none" 
                         style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
                    </div>

                    {/* Chat Header */}
                    <header className="h-[60px] bg-[#f0f2f5] px-4 py-2 flex items-center justify-between shrink-0 z-10 border-b border-[#e9edef] md:border-none">
                        <div className="flex items-center gap-3">
                            <button onClick={handleBackToSidebar} className="md:hidden text-[#54656f] mr-1">
                                <ArrowLeft size={24}/>
                            </button>
                            <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                                <img src={`https://ui-avatars.com/api/?name=${currentModelInfo.name}&background=00a884&color=fff`} alt="AI" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex flex-col justify-center cursor-pointer">
                                <h1 className="text-[#111b21] font-medium text-base leading-tight">{currentModelInfo.name}</h1>
                                <span className="text-[#667781] text-[13px] truncate">
                                    {isTyping ? <span className="text-[#00a884] font-medium">sedang mengetik...</span> : 'Online'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 text-[#54656f]">
                            <button className="hidden md:block"><Video size={22}/></button>
                            <button className="hidden md:block"><Phone size={22}/></button>
                            <div className="relative">
                                <button onClick={() => setShowModelMenu(!showModelMenu)}><Search size={22} className="md:hidden"/><MoreVertical size={22} className="hidden md:block"/></button>
                                {/* Dropdown Menu (Optional Logic) */}
                                {showModelMenu && (
                                    <div className="absolute right-0 top-10 bg-white shadow-xl rounded-lg py-2 w-48 z-50 animate-in fade-in zoom-in-95">
                                        <button onClick={() => setMessages([])} className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] text-[#111b21]">Bersihkan Chat</button>
                                        <button onClick={() => setShowModelMenu(false)} className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] text-[#111b21]">Info Kontak</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 z-10 scroll-smooth custom-scrollbar" ref={scrollRef}>
                        {/* Encryption Notice */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#ffeecd] text-[#54656f] text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm text-center max-w-[90%] md:max-w-[60%]">
                                🔒 Pesan dan panggilan dilindungi enkripsi end-to-end. KAAI tidak dapat membaca atau mendengarkannya.
                            </div>
                        </div>

                        {/* Messages Map */}
                        {messages.map((m) => (
                            <motion.div 
                                key={m.id} 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className={`flex w-full mb-1 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`relative max-w-[85%] md:max-w-[65%] rounded-lg px-2 py-1.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[14.2px] leading-[19px] 
                                    ${m.sender === 'user' ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}
                                >
                                    {/* Tail SVG (Segitiga Bubble) */}
                                    <span className={`absolute top-0 w-0 h-0 border-[6px] border-transparent 
                                        ${m.sender === 'user' ? '-right-[8px] border-t-[#d9fdd3]' : '-left-[8px] border-t-white'}`}>
                                    </span>

                                    {/* Reply Preview */}
                                    {m.reply && (
                                        <div className="mb-1 bg-black/5 border-l-4 border-[#00a884] rounded-[4px] p-1.5 text-xs cursor-pointer" onClick={() => {
                                            // Scroll logic optional
                                        }}>
                                            <div className="font-bold text-[#00a884] mb-0.5">{m.reply.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                            <div className="truncate text-[#667781]">{m.reply.text}</div>
                                        </div>
                                    )}

                                    {/* Message Text */}
                                    <div className="whitespace-pre-wrap break-words text-[#111b21] pb-1 pr-1">{m.text}</div>

                                    {/* Meta Info (Time & Check) */}
                                    <div className="flex justify-end items-center gap-1 mt-[-4px] float-right relative top-1 ml-2">
                                        <span className="text-[11px] text-[#667781] min-w-fit">{m.time}</span>
                                        {m.sender === 'user' && (
                                            <span className={m.status === 'read' ? 'text-[#53bdeb]' : 'text-[#8696a0]'}>
                                                <CheckCheck size={16}/> 
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover Options (Reply) */}
                                    <button 
                                        onClick={() => setReplyTo(m)} 
                                        className="absolute top-0 right-0 p-1 bg-gradient-to-l from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-tr-lg"
                                    >
                                        <Reply size={14} className="text-[#54656f]"/>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chat Input Area */}
                    <footer className="bg-[#f0f2f5] px-2 py-2 flex items-end gap-2 z-20 shrink-0 min-h-[62px]">
                        
                        {/* Reply Indicator Panel */}
                        <AnimatePresence>
                            {replyTo && (
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }} 
                                    animate={{ y: 0, opacity: 1 }} 
                                    exit={{ y: 20, opacity: 0 }} 
                                    className="absolute bottom-[62px] left-0 right-0 bg-[#f0f2f5] border-t border-black/5 p-2 z-30 flex justify-center"
                                >
                                    <div className="w-full max-w-[95%] bg-white rounded-lg border-l-4 border-[#00a884] p-2 flex justify-between items-center shadow-md">
                                        <div className="overflow-hidden">
                                            <div className="text-[#00a884] text-xs font-bold">{replyTo.sender === 'user' ? 'Anda' : currentModelInfo.name}</div>
                                            <div className="text-[#667781] text-xs truncate">{replyTo.text}</div>
                                        </div>
                                        <button onClick={() => setReplyTo(null)}><X size={20} className="text-[#54656f]"/></button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-2 pb-2">
                            <button className="p-2 text-[#54656f] hover:bg-black/5 rounded-full"><Smile size={26}/></button>
                            <button className="p-2 text-[#54656f] hover:bg-black/5 rounded-full"><Plus size={26}/></button>
                        </div>
                        
                        <div className="flex-1 bg-white rounded-lg px-4 py-2 my-1 shadow-sm flex items-center min-h-[42px]">
                            <textarea
                                ref={inputRef}
                                rows={1}
                                className="bg-transparent w-full text-[#111b21] outline-none text-[15px] placeholder-[#667781] resize-none overflow-hidden max-h-[120px]"
                                placeholder="Ketik pesan"
                                value={input}
                                onChange={handleInputResize}
                                onKeyDown={e => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                        </div>
                        
                        <div className="pb-2">
                            {input.trim() ? (
                                <button onClick={handleSend} className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] shadow-sm transition-all transform hover:scale-105">
                                    <Send size={20} fill="white" />
                                </button>
                            ) : (
                                <button className="p-3 text-[#54656f] hover:bg-black/5 rounded-full">
                                    <Mic size={24}/>
                                </button>
                            )}
                        </div>
                    </footer>

                </main>
            </div>
            
            {/* Custom Scrollbar Styles for Tailwind (Inject via style tag or global css) */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
};

export default AIChat;
