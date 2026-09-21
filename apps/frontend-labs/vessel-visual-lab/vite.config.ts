import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

const parseAllowedHosts = (value = '') =>
  value
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      allowedHosts: parseAllowedHosts(env.VESSEL_DEV_ALLOWED_HOSTS),
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          website: resolve(__dirname, 'website/index.html'),
          app: resolve(__dirname, 'app/index.html'),
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  }
})
