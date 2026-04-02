import { useEffect, useState, useRef } from 'react'
import './App.css'
import { checkWhisperServer, transcribeThaiAudio } from './features/voice/api'
import { startAudioRecording } from './features/voice/audio'
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
  const [errorMessage, setErrorMessage] = useState('')
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('')
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null)

  useEffect(() => {
    let isActive = true
    const syncServerState = async () => {
      const isOnline = await checkWhisperServer()
      if (!isActive) return
      setServerState(isOnline ? 'online' : 'offline')
    }
    void syncServerState()
    const intervalId = window.setInterval(() => { void syncServerState() }, 10_000)
    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [isRecording, isSubmitting])

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
      void recorderRef.current?.cancel()
    }
  }, [audioPreviewUrl])

  const handleStartRecording = async () => {
    setErrorMessage('')
    setTranscript(null)
    try {
      const activeRecording = await startAudioRecording()
      recorderRef.current = activeRecording
      setIsRecording(true)
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : 'เปิดไมโครโฟนไม่สำเร็จ'
      setErrorMessage(nextMessage)
    }
  }

  const handleStopRecording = async () => {
    if (!recorderRef.current) return
    setErrorMessage('')
    setIsRecording(false)
    setIsSubmitting(true)
    try {
      const recording = await recorderRef.current.stop()
      recorderRef.current = null
      setAudioPreviewUrl((currentUrl: string) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl)
        return URL.createObjectURL(recording.blob)
      })
      const startedAt = performance.now()
      const text = await transcribeThaiAudio(recording.blob)
      const requestMs = performance.now() - startedAt
      setTranscript({
        text: text || 'ไม่พบข้อความที่ชัดเจนพอจะถอดเสียงได้ ลองบันทึกใหม่อีกครั้ง',
        durationSeconds: recording.durationSeconds,
        requestMs,
        createdAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      })
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : 'ถอดเสียงไม่สำเร็จ'
      setErrorMessage(nextMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = async () => {
    setErrorMessage('')
    setTranscript(null)
    if (recorderRef.current) {
      await recorderRef.current.cancel()
      recorderRef.current = null
    }
    setIsRecording(false)
    setIsSubmitting(false)
    setAudioPreviewUrl((currentUrl: string) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
      return ''
    })
  }

  const operationalHint = (() => {
    if (serverState === 'offline') return 'กรุณาเชื่อมต่อกับ Local Engine เพื่อเริ่มต้น'
    if (isRecording) return 'กำลังบันทึกเสียง... ระบบพร้อมรับข้อมูลประโยคสั้นๆ'
    if (isSubmitting) return 'กำลังประมวลผลและวิเคราะห์ข้อมูลเสียง...'
    if (transcript) return 'การถอดความเสร็จสมบูรณ์'
    return 'เลือก "เริ่มบันทึกเสียง" เพื่อเริ่มต้นใช้งาน'
  })()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <h1>Thai Whisper Studio</h1>
          <p>ระบบถอดความเสียงภาษาไทยผ่าน Local Whisper Engine</p>
        </div>
        <div className={`server-status status-${serverState}`}>
          <span className="status-dot" />
          {serverState === 'online' ? 'พร้อมใช้งาน' : serverState === 'offline' ? 'ออฟไลน์' : 'กำลังเชื่อมต่อ...'}
        </div>
      </header>

      <main className="main-content">
        {serverState === 'offline' && (
          <div className="alert-box">
            <strong>เชื่อมต่อกับ Local Engine ไม่สำเร็จ</strong>
            <p>กรุณาตรวจสอบสถานะของ Whisper Server ใน Terminal หรือรัน <code>npm run whisper:server</code></p>
          </div>
        )}

        <div className="studio-card">
          <div className="studio-controls">
            {!isRecording && !isSubmitting && !transcript ? (
              <button 
                type="button" 
                className="btn-primary btn-large" 
                disabled={serverState !== 'online'} 
                onClick={handleStartRecording}
              >
                เริ่มบันทึกเสียง
              </button>
            ) : isRecording ? (
              <button 
                type="button" 
                className="btn-danger btn-large recording-pulse" 
                onClick={handleStopRecording}
              >
                หยุดและถอดความ
              </button>
            ) : isSubmitting ? (
              <div className="processing-state">
                <div className="spinner" />
                <span>กำลังถอดความ...</span>
              </div>
            ) : null}
            <p className="operational-hint">{operationalHint}</p>
          </div>

          {errorMessage && <div className="error-box">{errorMessage}</div>}

          {audioPreviewUrl && (
            <div className="audio-player">
              <audio controls src={audioPreviewUrl} />
            </div>
          )}

          <div className="transcript-area">
            {transcript ? (
              <div className="transcript-content">
                <p className="transcript-text">{transcript.text}</p>
                <div className="transcript-meta">
                  <span>ความยาว: {formatSeconds(transcript.durationSeconds)}</span>
                  <span>เวลาประมวลผล: {formatRequestTime(transcript.requestMs)}</span>
                  <span>บันทึกเมื่อ: {transcript.createdAt}</span>
                </div>
                <div className="result-actions">
                  <button type="button" className="btn-secondary btn-small" onClick={handleReset}>
                    ล้างข้อมูลและบันทึกใหม่
                  </button>
                </div>
              </div>
            ) : (
              <div className="transcript-empty">
                <p>พร้อมรับสัญญาณเสียง</p>
                <span>กดปุ่มบันทึกเสียงด้านบนเพื่อเริ่มต้นถอดความภาษาไทย</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="helper-text">
          เพื่อผลลัพธ์ที่แม่นยำที่สุด แนะนำให้เว้นจังหวะก่อนเริ่มพูดและหลีกเลี่ยงเสียงรบกวนรอบข้าง
        </p>
      </main>
    </div>
  )
}

export default App
