/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-bg': '#f0f0f0',
        'neo-black': '#0e0e0e',
        'neo-white': '#ffffff',
        'neo-yellow': '#FFDC58',
        'neo-green': '#A3E635',
        'neo-blue': '#60A5FA',
        'neo-pink': '#F472B6',
        'neo-red': '#F87171',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'], // Pastikan import font ini di index.css
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px rgba(14,14,14,1)',
        'neo-sm': '3px 3px 0px 0px rgba(14,14,14,1)',
        'neo-lg': '8px 8px 0px 0px rgba(14,14,14,1)',
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
