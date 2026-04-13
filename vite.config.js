import { defineConfig } from 'vite'
import fs from 'fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: {}
  },
  // server: {
  //   host: true,
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.0.131:8000',
  //       ws: true,
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})
