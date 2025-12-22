import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AIChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [model, setModel] = useState('kaai cplt');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const hour = new Date().getHours();
        let greeting = "Selamat Pagi";
        if (hour >= 11 && hour < 15) greeting = "Selamat Siang";
        else if (hour >= 15 && hour < 19) greeting = "Selamat Sore";
        else greeting = "Selamat Malam";

        setMessages([{
            id: 'init',
            text: `Halo ${greeting}, saya Kaai. Ada yang bisa saya bantu?`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, []);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = { id: Date.now(), text: input, sender: 'user', time: userTime };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Tentukan pesan loading
        let progressText = "progres";
        const lowerInput = userMsg.text.toLowerCase();
        if (lowerInput.includes('gambar') || lowerInput.includes('image') || lowerInput.includes('foto')) {
            progressText = "membuat gambar...";
        }

        const loadingId = Date.now() + 1;
        setMessages(prev => [...prev, {
            id: loadingId,
            text: progressText,
            sender: 'ai',
            time: userTime,
            isTemp: true
        }]);

        try {
            const res = await axios.get(`/api/ai?query=${encodeURIComponent(userMsg.text)}&model=${model}`);
            const reply = res.data.status ? res.data.result : res.data.msg;

            setMessages(prev => prev.map(msg => {
                if (msg.id === loadingId) {
                    return {
                        ...msg,
                        text: reply,
                        isTemp: false,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }
                return msg;
            }));
        } catch (e) {
            setMessages(prev => prev.map(msg => {
                if (msg.id === loadingId) return { ...msg, text: "Maaf, terjadi kesalahan jaringan.", isTemp: false };
                return msg;
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#E5DDD5] font-sans max-w-md mx-auto shadow-2xl overflow-hidden md:rounded-xl md:my-4 md:h-[90vh] md:border-4 md:border-black">
            {/* HEADER WA STYLE SIMPLE */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 shadow-md z-10">
                <Link to="/">
                    <button className="text-white"><ArrowLeft size={24}/></button>
                </Link>
                <div className="w-10 h-10 rounded-full bg-white border border-white/30 overflow-hidden flex-shrink-0">
                     <img src="https://raw.githubusercontent.com/akaanakbaik/belajar-frontand-dan-backend-terpisah/main/media/logo.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-white font-bold text-lg leading-none truncate">kaai</h1>
                    <select 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)}
                        className="bg-transparent text-white/80 text-xs border-none outline-none p-0 mt-1 cursor-pointer hover:text-white"
                    >
                        <option className="text-black" value="kaai cplt">Model: Copilot</option>
                        <option className="text-black" value="kaai qwn">Model: Qwen (Cepat)</option>
                        <option className="text-black" value="kaai pxd">Model: Perplexed</option>
                        <option className="text-black" value="kaai tbsk">Model: TurboSeek</option>
                        <option className="text-black" value="kaai plc">Model: PublicAI</option>
                    </select>
                </div>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-fixed">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[85%] px-3 py-2 rounded-lg text-sm relative shadow-sm pb-5
                                ${msg.sender === 'user' ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'}
                                ${msg.isTemp ? 'italic opacity-80' : ''}
                            `}>
                                <div className="whitespace-pre-wrap leading-relaxed text-gray-800 break-words">
                                    {msg.text}
                                </div>
                                <span className="absolute bottom-1 right-2 text-[10px] text-gray-500 flex items-center gap-1">
                                    {msg.time}
                                    {msg.sender === 'user' && <span className="text-blue-500">✓✓</span>}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="bg-[#F0F0F0] p-2 flex items-end gap-2">
                <div className="flex-1 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                    <textarea 
                        rows={1}
                        className="w-full bg-transparent outline-none text-sm resize-none max-h-24 py-1"
                        placeholder="Ketik pesan..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        // Enter = New Line (Seperti WA di HP)
                    />
                </div>
                <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-[#00897B] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#00796B] active:scale-90 transition-transform disabled:opacity-50 disabled:scale-100"
                >
                    <Send size={20} className={loading ? "animate-pulse" : "ml-1"} />
                </button>
            </div>
        </div>
    );
};

export default AIChat;
