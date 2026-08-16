import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/analyze': {
        target: 'https://mio2mio22-stuttermodelapi.hf.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/analyze/, '/analyze'),
      },
    },
  },
})
