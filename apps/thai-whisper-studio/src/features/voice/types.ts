export type WhisperServerState = 'checking' | 'online' | 'offline'

export type RecordedAudio = {
  blob: Blob
  durationSeconds: number
}

export type ActiveRecording = {
  stop: () => Promise<RecordedAudio>
  cancel: () => Promise<void>
}

export type TranscriptResult = {
  text: string
  durationSeconds: number
  requestMs: number
  createdAt: string
}
