const AUDIO_SUPPORTED =
  typeof window !== 'undefined' &&
  ('AudioContext' in window || 'webkitAudioContext' in window)

type AudioContextConstructor = typeof AudioContext

const getAudioContextConstructor = (): AudioContextConstructor | null => {
  if (!AUDIO_SUPPORTED) return null

  return (window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext ??
    null) as AudioContextConstructor | null
}

class AtlasAudioEngine {
  private context: AudioContext | null = null
  private output: GainNode | null = null
  private enabled = false

  get supported() {
    return AUDIO_SUPPORTED
  }

  get isEnabled() {
    return this.enabled
  }

  async setEnabled(enabled: boolean) {
    this.enabled = enabled

    if (!enabled) {
      this.output?.gain.setTargetAtTime(0, this.context?.currentTime ?? 0, 0.03)
      return true
    }

    const context = await this.ensureContext()
    if (!context || !this.output) {
      this.enabled = false
      return false
    }

    this.output.gain.setTargetAtTime(0.22, context.currentTime, 0.04)
    this.playTone(392, 0.12, 'sine')
    return true
  }

  playTone(
    frequency: number,
    duration = 0.72,
    wave: OscillatorType = 'sine',
  ) {
    const context = this.context
    const output = this.output

    if (!this.enabled || !context || !output) return false

    const now = context.currentTime
    const oscillator = context.createOscillator()
    const harmonic = context.createOscillator()
    const filter = context.createBiquadFilter()
    const envelope = context.createGain()
    const harmonicGain = context.createGain()

    oscillator.type = wave
    oscillator.frequency.setValueAtTime(frequency, now)
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.995, now + duration)

    harmonic.type = 'sine'
    harmonic.frequency.setValueAtTime(frequency * 2.01, now)
    harmonicGain.gain.setValueAtTime(0.08, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(Math.min(4600, frequency * 11), now)
    filter.Q.setValueAtTime(1.1, now)

    envelope.gain.setValueAtTime(0.0001, now)
    envelope.gain.exponentialRampToValueAtTime(0.75, now + 0.018)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    oscillator.connect(filter)
    harmonic.connect(harmonicGain)
    harmonicGain.connect(filter)
    filter.connect(envelope)
    envelope.connect(output)

    oscillator.start(now)
    harmonic.start(now)
    oscillator.stop(now + duration + 0.04)
    harmonic.stop(now + duration + 0.04)

    return true
  }

  private async ensureContext() {
    if (!this.context) {
      const Constructor = getAudioContextConstructor()
      if (!Constructor) return null

      this.context = new Constructor({ latencyHint: 'interactive' })
      this.output = this.context.createGain()
      this.output.gain.value = 0
      this.output.connect(this.context.destination)
    }

    if (this.context.state === 'suspended') {
      await this.context.resume()
    }

    return this.context
  }
}

export const atlasAudio = new AtlasAudioEngine()
