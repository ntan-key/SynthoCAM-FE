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
  server: {
    https: {
      // key: fs.readFileSync('./certs/synthocam.local+4-key.pem'),
      key: fs.readFileSync('./certs/192.168.0.131+1-key.pem'),
      // cert: fs.readFileSync('./certs/synthocam.local+4.pem'),
      cert: fs.readFileSync('./certs/192.168.0.131+1.pem'),
    },
    host: '0.0.0.0',
    port: 5173,
  }
})
