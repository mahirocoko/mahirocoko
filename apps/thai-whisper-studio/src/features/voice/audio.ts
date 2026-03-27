import { RECORDER_SAMPLE_RATE } from './constants'
import type { ActiveRecording, RecordedAudio } from './types'

const mergeChunks = (chunks: Float32Array[]) => {
  const mergedLength = chunks.reduce((total, chunk) => total + chunk.length, 0)
  const merged = new Float32Array(mergedLength)

  let offset = 0

  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.length
  }

  return merged
}

const downsampleBuffer = (input: Float32Array, sourceRate: number, targetRate: number) => {
  if (sourceRate === targetRate) {
    return input
  }

  const sampleRateRatio = sourceRate / targetRate
  const outputLength = Math.round(input.length / sampleRateRatio)
  const output = new Float32Array(outputLength)

  let inputOffset = 0

  for (let index = 0; index < outputLength; index += 1) {
    const nextOffset = Math.round((index + 1) * sampleRateRatio)
    let sum = 0
    let count = 0

    for (; inputOffset < nextOffset && inputOffset < input.length; inputOffset += 1) {
      sum += input[inputOffset]
      count += 1
    }

    output[index] = count > 0 ? sum / count : 0
  }

  return output
}

const clampSample = (value: number) => Math.max(-1, Math.min(1, value))

const createWavBlob = (samples: Float32Array, sampleRate: number) => {
  const bytesPerSample = 2
  const blockAlign = bytesPerSample
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  const view = new DataView(buffer)

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, samples.length * bytesPerSample, true)

  for (let index = 0; index < samples.length; index += 1) {
    const sample = clampSample(samples[index])
    view.setInt16(44 + index * bytesPerSample, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

export const startAudioRecording = async (): Promise<ActiveRecording> => {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('เบราว์เซอร์นี้ยังไม่รองรับการอัดเสียงจากไมค์')
  }

  const AudioContextConstructor = window.AudioContext

  if (!AudioContextConstructor) {
    throw new Error('เบราว์เซอร์นี้ยังไม่รองรับ Web Audio API')
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    },
  })

  const audioContext = new AudioContextConstructor()
  const source = audioContext.createMediaStreamSource(stream)
  const processor = audioContext.createScriptProcessor(4096, 1, 1)
  const silence = audioContext.createGain()
  const chunks: Float32Array[] = []

  silence.gain.value = 0

  processor.onaudioprocess = (event) => {
    const channelData = event.inputBuffer.getChannelData(0)
    chunks.push(new Float32Array(channelData))
  }

  source.connect(processor)
  processor.connect(silence)
  silence.connect(audioContext.destination)

  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }

  let isClosed = false

  const cleanup = async () => {
    if (isClosed) {
      return
    }

    isClosed = true
    processor.disconnect()
    source.disconnect()
    silence.disconnect()
    stream.getTracks().forEach((track) => {
      track.stop()
    })

    if (audioContext.state !== 'closed') {
      await audioContext.close()
    }
  }

  return {
    stop: async (): Promise<RecordedAudio> => {
      const sourceRate = audioContext.sampleRate
      const merged = mergeChunks(chunks)
      const downsampled = downsampleBuffer(merged, sourceRate, RECORDER_SAMPLE_RATE)

      await cleanup()

      if (downsampled.length === 0) {
        throw new Error('ยังไม่มีเสียงพอให้ถอดข้อความ ลองพูดใหม่อีกครั้ง')
      }

      return {
        blob: createWavBlob(downsampled, RECORDER_SAMPLE_RATE),
        durationSeconds: downsampled.length / RECORDER_SAMPLE_RATE,
      }
    },
    cancel: cleanup,
  }
}
