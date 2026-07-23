import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://phplaravel-1634996-6476481.cloudwaysapps.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
