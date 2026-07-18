import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // The only large chunk is the isolated, lazy WebGL field (about 136 kB gzip).
    // Keep the semantic application and interaction shell in the smaller entry chunk.
    chunkSizeWarningLimit: 550,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
