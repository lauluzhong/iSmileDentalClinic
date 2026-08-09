import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogSSG from './vite-plugin-blog-ssg.js'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), blogSSG()],
  ssr: {
    // react-helmet-async ships CommonJS, and Node's ESM loader can't pull named
    // exports out of it when Vite leaves it external. Bundle it into the server
    // build instead.
    noExternal: ['react-helmet-async'],
  },
  build: {
    // The SSR pass (src/entry-server.jsx → dist-ssr/) is a single Node bundle
    // consumed by scripts/prerender-home.js. Browser chunking doesn't apply.
    rollupOptions: isSsrBuild ? {} : {
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
}))
