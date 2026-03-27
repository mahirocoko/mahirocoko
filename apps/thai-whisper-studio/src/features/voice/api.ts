import { WHISPER_BASE_URL } from './constants'

const buildWhisperUrl = (path: string) => `${WHISPER_BASE_URL}${path}`

const getErrorMessage = async (response: Response) => {
  const responseText = await response.text()

  if (!responseText) {
    return 'Whisper server ตอบกลับแบบไม่สมบูรณ์'
  }

  try {
    const parsed = JSON.parse(responseText) as { error?: string }

    return parsed.error ?? responseText
  } catch {
    return responseText
  }
}

export const checkWhisperServer = async () => {
  try {
    const response = await fetch(buildWhisperUrl('/health'))

    return response.ok
  } catch {
    return false
  }
}

export const transcribeThaiAudio = async (audioBlob: Blob) => {
  const formData = new FormData()

  formData.append('file', new File([audioBlob], 'thai-recording.wav', { type: 'audio/wav' }))
  formData.append('language', 'th')
  formData.append('response_format', 'json')
  formData.append('temperature', '0.0')
  formData.append('temperature_inc', '0.0')
  formData.append('beam_size', '5')
  formData.append('suppress_non_speech', 'true')
  formData.append('no_timestamps', 'true')

  const response = await fetch(buildWhisperUrl('/inference'), {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const payload = (await response.json()) as { text?: string }

  return (payload.text ?? '').trim()
}
