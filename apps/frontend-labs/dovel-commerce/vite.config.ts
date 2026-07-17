import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  build: {
    // The below-fold Three.js preview is lazy-loaded as one auditable capability chunk.
    chunkSizeWarningLimit: 950,
  },
  server: {
    host: 'localhost',
    port: 4176,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
