import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false 
      }
    },
    port: 3000,
    host: true
  }
})
