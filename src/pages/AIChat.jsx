import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, ArrowLeft, Bot, User, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const AIChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [model, setModel] = useState('kaai cplt');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const h = new Date().getHours();
        const greet = h < 12 ? "Pagi" : h < 15 ? "Siang" : h < 19 ? "Sore" : "Malam";
        setMessages([{
            id: 'init',
            text: `Halo, Selamat ${greet}! Saya Kaai (v12). Pilih model dan mulailah bertanya.`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const txt = input;
        setInput('');
        
        const userMsg = { id: Date.now(), text: txt, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(p => [...p, userMsg]);
        setLoading(true);

        try {
            const res = await axios.get(`/api/ai?query=${encodeURIComponent(txt)}&model=${model}`);
            const reply = res.data.status ? res.data.result : "Maaf, server sedang sibuk.";
            setMessages(p => [...p, {
                id: Date.now() + 1,
                text: reply,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (e) {
            toast.error("Gagal terhubung ke AI.");
            setMessages(p => [...p, { id: Date.now(), text: "Error: Jaringan bermasalah.", sender: 'ai', error: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#f0f2f5] max-w-lg mx-auto md:border-x-2 md:border-black overflow-hidden shadow-2xl">
            <Helmet><title>Kaai Chat AI</title></Helmet>
            
            <div className="bg-white px-4 py-3 flex items-center gap-3 border-b-2 border-black shadow-sm z-10 shrink-0">
                <Link to="/"><button className="p-2 hover:bg-gray-100 rounded-full border border-black transition"><ArrowLeft size={20}/></button></Link>
                <div className="flex-1">
                    <h1 className="font-black text-lg leading-none">KAAI CHAT</h1>
                    <select value={model} onChange={e => setModel(e.target.value)} className="text-xs font-bold bg-transparent outline-none cursor-pointer text-gray-500 mt-1">
                        <option value="kaai cplt">🧠 Copilot (Cerdas)</option>
                        <option value="kaai qwn">🚀 Qwen (Cepat)</option>
                        <option value="kaai tbsk">🔍 TurboSeek</option>
                    </select>
                </div>
                <button onClick={() => setMessages([])} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth" ref={scrollRef}>
                <AnimatePresence>
                    {messages.map((m) => (
                        <motion.div key={m.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end gap-2 max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${m.sender === 'user' ? 'bg-[#FFDC58]' : 'bg-[#A3E635]'}`}>
                                    {m.sender === 'user' ? <User size={14}/> : <Bot size={14}/>}
                                </div>
                                <div className={`px-4 py-2 rounded-2xl border-2 border-black text-sm font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] ${m.sender === 'user' ? 'bg-white rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                                    <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                                    <div className={`text-[10px] mt-1 font-bold opacity-40 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>{m.time}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex justify-start">
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] flex gap-1">
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></span>
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-3 bg-white border-t-2 border-black shrink-0">
                <div className="flex gap-2">
                    <input 
                        className="flex-1 bg-gray-100 border-2 border-black rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_black] transition-all"
                        placeholder="Ketik pesan..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        disabled={loading}
                    />
                    <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center border-2 border-black hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-90">
                        <Send size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
