import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Relative base so the build works on GitHub Pages under any repo name.
// Pages: the demo, the building blocks, and the film previs exploration.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lessons: resolve(__dirname, 'lessons.html'),
        previs: resolve(__dirname, 'previs.html'),
      },
    },
  },
})
