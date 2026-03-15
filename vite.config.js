import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import PrerenderSPAPlugin from 'prerender-spa-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    new PrerenderSPAPlugin({
      routes: [
        '/',
        '/about',
        '/services',
        '/blog',
        '/contact',
        '/services/children/myobrace',
        '/services/children',
        '/services/protect',
        '/services/straighten',
        '/services/replace',
        '/services/其它'
      ],
      renderTarget: '#app',
      postProcess: (html) => {
        // Remove any script tags that might break prerendering
        return html
      }
    })
  ],
})
