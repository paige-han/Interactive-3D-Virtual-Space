import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Relative base so the build works on GitHub Pages under any repo name.
// Two pages: the demo (index.html) and the course lessons (lessons.html).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lessons: resolve(__dirname, 'lessons.html'),
      },
    },
  },
})
