export const WHISPER_BASE_URL =
  import.meta.env.VITE_WHISPER_BASE_URL?.replace(/\/$/, '') ?? '/api/whisper'

export const QUICK_START_COMMANDS = [
  'npm install',
  'npm run whisper:setup',
  'npm run whisper:server',
  'npm run dev',
]

export const RECORDER_SAMPLE_RATE = 16_000
