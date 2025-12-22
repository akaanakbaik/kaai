import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const NeoCard = ({ children, className, title, color = "bg-white" }) => {
  return (
    <motion.div 
      whileHover={{ translateX: 4, translateY: 4, boxShadow: '0px 0px 0px 0px #000' }}
      className={cn("border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden transition-all duration-200", color, className)}
    >
      {title && (
        <div className="border-b-2 border-black bg-white/80 backdrop-blur-sm px-4 py-3 font-black text-sm uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-black opacity-50"></div>
          </div>
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  );
};

export const NeoButton = ({ children, onClick, variant = "primary", className, disabled }) => {
  const variants = {
    primary: "bg-[#A3E635] hover:bg-[#84cc16] text-black", 
    secondary: "bg-[#FF90E8] hover:bg-[#ff70d9] text-black",
    dark: "bg-black text-white hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
    white: "bg-white hover:bg-gray-50 text-black"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95, translate: "2px 2px", boxShadow: "0px 0px 0px 0px #000" }}
      whileHover={{ scale: 1.02 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "border-2 border-black px-5 py-3 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 rounded-lg uppercase tracking-wide",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
    >
      {children}
    </motion.button>
  );
};

export const NeoInput = ({ label, ...props }) => (
  <div className="w-full space-y-1">
    {label && <label className="font-bold text-xs uppercase ml-1 bg-black text-white px-2 py-0.5 rounded-sm inline-block transform -rotate-1">{label}</label>}
    <input
      {...props}
      className="w-full border-2 border-black p-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/20 focus:border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg transition-all placeholder:text-gray-400 bg-white"
    />
  </div>
);

export const NeoTextArea = ({ label, ...props }) => (
  <div className="w-full space-y-1">
    {label && <label className="font-bold text-xs uppercase ml-1 bg-black text-white px-2 py-0.5 rounded-sm inline-block">{label}</label>}
    <textarea
      {...props}
      className="w-full border-2 border-black p-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/20 focus:border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg transition-all placeholder:text-gray-400 bg-white min-h-[100px]"
    />
  </div>
);

export const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto pb-24"
  >
    {children}
  </motion.div>
);
