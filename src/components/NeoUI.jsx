import React from 'react';
import { motion } from 'framer-motion';

// Tombol Neobrutalis
export const NeoButton = ({ children, onClick, className, variant = 'primary', type = 'button', disabled = false }) => {
    const colors = {
        primary: 'bg-neo-yellow hover:bg-yellow-300',
        secondary: 'bg-neo-blue hover:bg-blue-300',
        danger: 'bg-neo-red hover:bg-red-400',
        success: 'bg-neo-green hover:bg-green-400',
        dark: 'bg-neo-black text-white hover:bg-gray-800'
    };

    return (
        <motion.button
            whileHover={!disabled ? { x: -2, y: -2, boxShadow: '7px 7px 0px 0px black' } : {}}
            whileTap={!disabled ? { x: 2, y: 2, boxShadow: '0px 0px 0px 0px black' } : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                border-2 border-black px-6 py-3 font-bold text-neo-black shadow-neo transition-all duration-200
                flex items-center justify-center gap-2
                ${colors[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {children}
        </motion.button>
    );
};

// Kartu/Kotak
export const NeoCard = ({ children, title, className, color = 'bg-white' }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-black p-6 shadow-neo ${color} ${className}`}
        >
            {title && (
                <div className="mb-4 border-b-2 border-black pb-2">
                    <h3 className="text-xl font-black uppercase tracking-wider">{title}</h3>
                </div>
            )}
            {children}
        </motion.div>
    );
};

// Input Field
export const NeoInput = ({ label, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="mb-1 block font-bold text-sm bg-neo-black text-white w-fit px-2">{label}</label>}
            <input 
                {...props}
                className="w-full border-2 border-black p-3 font-bold shadow-neo-sm focus:outline-none focus:bg-yellow-50 transition-colors"
            />
        </div>
    );
};
