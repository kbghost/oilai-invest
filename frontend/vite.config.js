import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * vite.config.js
 *
 * MODIFIER LE PORT BACKEND :
 *   Changer le target ci-dessous si votre backend tourne sur un autre port
 *   Par défaut : http://localhost:5000
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // En dev local, /api → redirige vers le backend
      '/api': {
        target: 'http://localhost:5000',  // ← MODIFIER si port différent
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          lucide: ['lucide-react'],
        }
      }
    }
  }
})
