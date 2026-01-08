import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // SECURITY: Sembunyikan source code asli di production
    sourcemap: false, 
  },
  server: {
    port: 3000, // Port default lokal
    // Proxy lokal hanya untuk development (agar npm run dev bisa akses backend YTDL)
    proxy: {
      '/api/ytdl': {
        target: 'https://api-ytdlpy.akadev.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ytdl/, '/api/v1/ytdl')
      },
      '/api/v1': {
        target: 'https://api-ytdlpy.akadev.me',
        changeOrigin: true
      }
    }
  }
})
