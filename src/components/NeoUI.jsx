import React from 'react';
import { motion } from 'framer-motion';

// 1. Wrapper Halaman (Untuk Transisi Mulus saat ganti menu)
export const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        className="w-full"
    >
        {children}
    </motion.div>
);

// 2. Tombol Full Interaksi
export const NeoButton = ({ children, onClick, className, variant = 'primary', type = 'button', disabled = false }) => {
    const variants = {
        primary: 'bg-[#FFDC58] text-black hover:bg-[#ffe58a]', // Kuning
        secondary: 'bg-[#A3E635] text-black hover:bg-[#bcf266]', // Hijau
        accent: 'bg-[#F472B6] text-black hover:bg-[#ff9bc9]', // Pink
        dark: 'bg-[#1a1a1a] text-white hover:bg-[#333]', // Hitam
        blue: 'bg-[#60A5FA] text-black hover:bg-[#8bbbf7]', // Biru
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, x: -4, y: -4, boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' } : {}}
            whileTap={!disabled ? { scale: 0.95, x: 0, y: 0, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' } : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                border-2 border-black px-6 py-3 font-black text-sm md:text-base tracking-wide
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors duration-200
                flex items-center justify-center gap-2 rounded-none
                ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
            `}
        >
            {children}
        </motion.button>
    );
};

// 3. Kartu/Kotak Konten
export const NeoCard = ({ children, title, className, color = 'bg-white' }) => {
    return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className={`border-2 border-black p-5 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${color} ${className}`}
        >
            {title && (
                <div className="mb-6 border-b-2 border-black pb-3">
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">{title}</h3>
                </div>
            )}
            {children}
        </motion.div>
    );
};

// 4. Input Field Interaktif
export const NeoInput = ({ label, ...props }) => {
    return (
        <div className="w-full group">
            {label && (
                <motion.label 
                    className="mb-2 block font-bold text-sm bg-black text-white w-fit px-3 py-1 transform -rotate-1 group-focus-within:rotate-0 transition-transform"
                >
                    {label}
                </motion.label>
            )}
            <motion.input 
                whileFocus={{ scale: 1.01, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', backgroundColor: '#fff' }}
                {...props}
                className="w-full border-2 border-black p-3 md:p-4 font-bold bg-[#f9f9f9] focus:outline-none placeholder-gray-500 transition-all"
            />
        </div>
    );
};
