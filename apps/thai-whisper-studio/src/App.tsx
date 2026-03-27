import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { checkWhisperServer, transcribeThaiAudio } from './features/voice/api'
import { startAudioRecording } from './features/voice/audio'
import { QUICK_START_COMMANDS, WHISPER_BASE_URL } from './features/voice/constants'
import type { ActiveRecording, TranscriptResult, WhisperServerState } from './features/voice/types'

const formatSeconds = (value: number) => `${value.toFixed(1)} วิ`

const formatRequestTime = (value: number) => {
  if (value < 1_000) {
    return `${Math.round(value)} ms`
  }

  return `${(value / 1_000).toFixed(1)} วิ`
}

function App() {
  const recorderRef = useRef<ActiveRecording | null>(null)
  const [serverState, setServerState] = useState<WhisperServerState>('checking')
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('กำลังเช็กว่า Whisper server พร้อมใช้งานหรือยัง')
  const [errorMessage, setErrorMessage] = useState('')
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('')
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null)

  useEffect(() => {
    let isActive = true

    const syncServerState = async () => {
      const isOnline = await checkWhisperServer()

      if (!isActive) {
        return
      }

      setServerState(isOnline ? 'online' : 'offline')

      if (!isRecording && !isSubmitting) {
        setStatusMessage(
          isOnline
            ? 'Whisper server พร้อมแล้ว กดอัดเสียงแล้วพูดภาษาไทยได้เลย'
            : 'ยังไม่เจอ Whisper server ลองเปิด `npm run whisper:server` ก่อน',
        )
      }
    }

    void syncServerState()

    const intervalId = window.setInterval(() => {
      void syncServerState()
    }, 10_000)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [isRecording, isSubmitting])

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl)
      }

      void recorderRef.current?.cancel()
    }
  }, [audioPreviewUrl])

  const canRecord = serverState === 'online' && !isRecording && !isSubmitting

  const serverBadgeLabel = useMemo(() => {
    if (serverState === 'checking') {
      return 'checking server'
    }

    return serverState === 'online' ? 'server online' : 'server offline'
  }, [serverState])

  const handleStartRecording = async () => {
    setErrorMessage('')

    try {
      const activeRecording = await startAudioRecording()
      recorderRef.current = activeRecording
      setIsRecording(true)
      setStatusMessage('กำลังอัดเสียงอยู่ ลองพูดเป็นประโยคสั้น ๆ ชัด ๆ ได้เลย')
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : 'เปิดไมค์ไม่สำเร็จ'
      setErrorMessage(nextMessage)
    }
  }

  const handleStopRecording = async () => {
    if (!recorderRef.current) {
      return
    }

    setErrorMessage('')
    setIsRecording(false)
    setIsSubmitting(true)
    setStatusMessage('กำลังแปลงเสียงเป็นข้อความภาษาไทย...')

    try {
      const recording = await recorderRef.current.stop()
      recorderRef.current = null

      setAudioPreviewUrl((currentUrl: string) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }

        return URL.createObjectURL(recording.blob)
      })

      const startedAt = performance.now()
      const text = await transcribeThaiAudio(recording.blob)
      const requestMs = performance.now() - startedAt

      setTranscript({
        text: text || 'Whisper ได้ยินเสียงแล้ว แต่ยังไม่เจอข้อความที่ชัดพอจะถอดออกมา',
        durationSeconds: recording.durationSeconds,
        requestMs,
        createdAt: new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      setStatusMessage('เสร็จแล้ว ลองฟังคลิปเดิมหรืออัดรอบใหม่ได้เลย')
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : 'ถอดเสียงไม่สำเร็จ'
      setErrorMessage(nextMessage)
      setStatusMessage('ยังถอดเสียงไม่สำเร็จ ลองใหม่อีกครั้งได้เลย')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = async () => {
    setErrorMessage('')
    setTranscript(null)
    setStatusMessage('พร้อมเริ่มรอบใหม่แล้ว')

    if (recorderRef.current) {
      await recorderRef.current.cancel()
      recorderRef.current = null
    }

    setIsRecording(false)
    setIsSubmitting(false)
    setAudioPreviewUrl((currentUrl: string) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }

      return ''
    })
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="page">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Thai Whisper Studio</p>
            <h1>พูดภาษาไทยลงไมค์ แล้วให้ `whisper.cpp` ถอดออกมาเป็นข้อความ</h1>
            <p className="hero-description">
              เดโมนี้อัดเสียงในเบราว์เซอร์, แปลงเป็นไฟล์ `wav`, แล้วส่งเข้า local
              `whisper-server` ที่รันจาก `whisper.cpp`
            </p>
          </div>

          <div className="hero-status-grid">
            <div className={`status-card status-${serverState}`}>
              <span className="status-label">engine</span>
              <strong>{serverBadgeLabel}</strong>
              <p>{WHISPER_BASE_URL}</p>
            </div>
            <div className={`status-card ${isRecording ? 'status-recording' : 'status-ready'}`}>
              <span className="status-label">microphone</span>
              <strong>{isRecording ? 'recording now' : 'ready for voice'}</strong>
              <p>{statusMessage}</p>
            </div>
          </div>
        </section>

        <section className="workspace-grid">
          <article className="panel recorder-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">ทดลองพูดภาษาไทย</p>
                <h2>อัดเสียงแล้วถอดข้อความทันที</h2>
              </div>
              <span className={`record-dot ${isRecording ? 'record-dot-live' : ''}`} />
            </div>

            <p className="panel-copy">
              แนะนำให้พูดทีละประโยคสั้น ๆ ในที่เงียบหน่อย จะได้เห็นผลของโมเดลชัดขึ้น
            </p>

            <div className="recorder-actions">
              <button type="button" className="primary-button" disabled={!canRecord} onClick={handleStartRecording}>
                เริ่มอัดเสียง
              </button>
              <button type="button" className="secondary-button" disabled={!isRecording} onClick={handleStopRecording}>
                หยุดแล้วถอดข้อความ
              </button>
              <button type="button" className="ghost-button" disabled={isRecording || isSubmitting} onClick={handleReset}>
                ล้างผลลัพธ์
              </button>
            </div>

            <div className="status-strip">
              <strong>สถานะตอนนี้</strong>
              <p>{statusMessage}</p>
            </div>

            {errorMessage ? (
              <div className="error-box">
                <strong>มีบางอย่างสะดุด</strong>
                <p>{errorMessage}</p>
              </div>
            ) : null}

            {audioPreviewUrl ? (
              <div className="preview-box">
                <div>
                  <strong>ลองฟังคลิปที่เพิ่งอัด</strong>
                  <p>ถ้าเสียงไม่ชัด ลองอัดใหม่ได้ทันที</p>
                </div>
                <audio controls src={audioPreviewUrl}>
                  <track kind="captions" />
                </audio>
              </div>
            ) : null}
          </article>

          <article className="panel transcript-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">ผลลัพธ์จาก whisper.cpp</p>
                <h2>ข้อความถอดเสียง</h2>
              </div>
            </div>

            {transcript ? (
              <>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <span>ความยาวคลิป</span>
                    <strong>{formatSeconds(transcript.durationSeconds)}</strong>
                  </div>
                  <div className="metric-card">
                    <span>เวลาที่ใช้ถอด</span>
                    <strong>{formatRequestTime(transcript.requestMs)}</strong>
                  </div>
                  <div className="metric-card">
                    <span>รอบล่าสุด</span>
                    <strong>{transcript.createdAt}</strong>
                  </div>
                </div>

                <div className="transcript-card">
                  <p>{transcript.text}</p>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <strong>ยังไม่มีข้อความ</strong>
                <p>พอคุณกดอัดเสียงแล้วหยุด เดโมนี้จะส่งไฟล์ wav ไปที่ whisper-server และโชว์ transcript ตรงนี้</p>
              </div>
            )}
          </article>
        </section>

        <section className="guide-grid">
          <article className="panel guide-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">quick start</p>
                <h2>สั่งรันให้ครบแบบเร็วสุด</h2>
              </div>
            </div>

            <div className="command-list">
              {QUICK_START_COMMANDS.map((command) => (
                <code key={command}>{command}</code>
              ))}
            </div>
          </article>

          <article className="panel guide-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">tips</p>
                <h2>ถ้าอยากได้ผลดีขึ้น</h2>
              </div>
            </div>

            <div className="tip-list">
              <p>พูดใกล้ไมค์นิดหนึ่ง และเว้นช่วงก่อนเริ่มพูดประมาณครึ่งวินาที</p>
              <p>ตอนนี้เดโมตั้งค่าเป็น `small` แล้ว ถ้ายังเพี้ยนมาก ให้ลองพูดช้าลงและอยู่ใกล้ไมค์อีกนิด</p>
              <p>ถ้า server ยัง offline อยู่ ให้เปิด `npm run whisper:server` ทิ้งไว้ก่อน แล้วค่อยรีเฟรชหน้าเดโม</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
