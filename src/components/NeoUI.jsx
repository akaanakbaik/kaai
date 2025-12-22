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
      whileHover={{ translateY: -2, boxShadow: '2px 2px 0px 0px #000' }}
      className={cn("border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden transition-all duration-200", color, className)}
    >
      {title && (
        <div className="border-b-2 border-black bg-white/90 backdrop-blur-sm px-3 py-2 font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-black opacity-30"></div>
          </div>
        </div>
      )}
      <div className="p-3 md:p-5">{children}</div>
    </motion.div>
  );
};

export const NeoButton = ({ children, onClick, variant = "primary", className, disabled }) => {
  const variants = {
    primary: "bg-[#A3E635] hover:bg-[#84cc16] text-black", 
    secondary: "bg-[#FF90E8] hover:bg-[#ff70d9] text-black",
    dark: "bg-black text-white hover:bg-gray-800",
    white: "bg-white hover:bg-gray-50 text-black"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "border-2 border-black px-3 py-2 md:px-4 md:py-2.5 font-bold text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 rounded-md uppercase tracking-wide",
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
    {label && <label className="font-bold text-[10px] md:text-xs uppercase ml-1 bg-black text-white px-1.5 py-0.5 rounded-sm inline-block">{label}</label>}
    <input
      {...props}
      className="w-full border-2 border-black p-2 md:p-3 text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md transition-all placeholder:text-gray-400 bg-white"
    />
  </div>
);

export const NeoTextArea = ({ label, ...props }) => (
  <div className="w-full space-y-1">
    {label && <label className="font-bold text-[10px] md:text-xs uppercase ml-1 bg-black text-white px-1.5 py-0.5 rounded-sm inline-block">{label}</label>}
    <textarea
      {...props}
      className="w-full border-2 border-black p-2 md:p-3 text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md transition-all placeholder:text-gray-400 bg-white min-h-[80px]"
    />
  </div>
);

export const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="min-h-screen p-3 md:p-6 max-w-5xl mx-auto pb-20"
  >
    {children}
  </motion.div>
);
