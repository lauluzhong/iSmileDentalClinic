import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogSSG from './vite-plugin-blog-ssg.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), blogSSG()],
})
