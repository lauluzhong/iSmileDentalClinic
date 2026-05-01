import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogSSG from './vite-plugin-blog-ssg.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), blogSSG()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core React + ReactDOM (fundamental, loaded on every page)
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'vendor-react';
            }
            // Framer Motion (used by every page for transitions/animations)
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            // Lucide React icons (used across many pages — tree-shaken per chunk)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Routing + Helmet (used by App.jsx and most pages)
            if (id.includes('react-router') || id.includes('react-helmet')) {
              return 'vendor-routing';
            }
            // All other vendor dependencies in a single catch-all
            return 'vendor-other';
          }
        }
      }
    }
  }
})
