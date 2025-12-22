import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const NeoCard = ({ children, className, title, color = "bg-white" }) => {
  return (
    <div className={cn("border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden", color, className)}>
      {title && (
        <div className="border-b-2 border-black bg-white/50 px-3 py-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 border border-black"></div>
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export const NeoButton = ({ children, onClick, variant = "primary", className, disabled }) => {
  const variants = {
    primary: "bg-[#A3E635] hover:bg-[#84cc16]", // Hijau Neon
    secondary: "bg-[#FF90E8] hover:bg-[#ff70d9]", // Pink
    dark: "bg-black text-white hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
    white: "bg-white hover:bg-gray-100"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 1, y: 1 }}
      whileTap={{ scale: 0.98, x: 2, y: 2, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "border-2 border-black px-4 py-2 font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 rounded-md",
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
    {label && <label className="font-bold text-xs uppercase ml-1">{label}</label>}
    <input
      {...props}
      className="w-full border-2 border-black p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md transition-all"
    />
  </div>
);

export const NeoTextArea = ({ label, ...props }) => (
  <div className="w-full space-y-1">
    {label && <label className="font-bold text-xs uppercase ml-1">{label}</label>}
    <textarea
      {...props}
      className="w-full border-2 border-black p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md transition-all min-h-[80px]"
    />
  </div>
);

export const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto pb-20"
  >
    {children}
  </motion.div>
);
