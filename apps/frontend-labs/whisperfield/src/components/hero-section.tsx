import { useEffect, useMemo, useRef, useState } from 'react'
import { IntegrationIcon } from './integration-icon'
import type { IntegrationName } from '../constants/integrations'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { useSectionVisibility } from '../hooks/use-section-visibility'
import { GlassDownloadButton } from './glass-button'

const HERO_REQUEST = 'Turn the launch note into a warm reply, block a review window tomorrow, and save the open questions beside the project.'

const FLOW_INTEGRATIONS: IntegrationName[] = [
  'Messages', 'Gmail', 'Notion', 'Calendar', 'Search', 'Whisperfield', 'Notes',
  'Linear', 'Figma', 'GitHub', 'Mail', 'Calendar', 'Messages', 'Notion',
  'GitHub', 'Linear', 'Gmail',
]

const MOBILE_FLOW_INDEXES = [0, 2, 5, 7, 10, 12, 15]
const FLOW_POINTS: Array<[number, number]> = [
  [2.04309, 563.872],
  [111.592, 558.268],
  [316.491, 554.016],
  [517.963, 490.064],
  [703.017, 431.323],
  [875.319, 444.531],
  [1021.88, 453.216],
]

const cubicPoint = (start: [number, number], controlA: [number, number], controlB: [number, number], end: [number, number], progress: number) => {
  const inverse = 1 - progress
  const inverseSquared = inverse * inverse
  const progressSquared = progress * progress
  return [
    inverseSquared * inverse * start[0] + 3 * inverseSquared * progress * controlA[0] + 3 * inverse * progressSquared * controlB[0] + progressSquared * progress * end[0],
    inverseSquared * inverse * start[1] + 3 * inverseSquared * progress * controlA[1] + 3 * inverse * progressSquared * controlB[1] + progressSquared * progress * end[1],
  ] as const
}

const pointOnFlow = (progress: number) => {
  const segmentProgress = ((FLOW_POINTS.length - 1) / 3) * Math.min(progress, 0.999999)
  const segment = Math.floor(segmentProgress)
  const pointIndex = segment * 3
  return cubicPoint(
    FLOW_POINTS[pointIndex],
    FLOW_POINTS[pointIndex + 1],
    FLOW_POINTS[pointIndex + 2],
    FLOW_POINTS[pointIndex + 3],
    segmentProgress - segment,
  )
}

const edgeOpacity = (progress: number, mobile: boolean) => {
  if (mobile) return 1
  if (progress < 0.06) return progress / 0.06
  if (progress > 0.94) return Math.max(0, (1 - progress) / 0.06)
  return 1
}

const AnimatedAudioBars = ({ active }: { active: boolean }) => {
  const barRefs = useRef<Array<HTMLElement | null>>([])
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const heights = [0.45, 0.5, 0.55, 0.5, 0.45]
    const opacities = [0.6, 0.6, 0.6, 0.6, 0.6]
    const multipliers = [0.75, 1.1, 1.4, 1.1, 0.75]
    const phases = [0, 0.618, 1.236, 1.854, 2.472]
    const speeds = [1, 1.1, 0.95, 1.05, 1]

    const animate = (now: number) => {
      const seconds = (now - start) / 1000
      barRefs.current.forEach((bar, index) => {
        if (!bar) return
        const waveA = 0.5 * Math.sin(2.5 * seconds * speeds[index] + phases[index]) + 0.5
        const waveB = 0.3 * Math.sin(3.7 * seconds * speeds[index] + 1.5 * phases[index]) + 0.5
        const envelope = 0.15 * Math.sin(1.1 * seconds + 0.3 * phases[index]) + 0.85
        const energy = Math.max(0.15, Math.min(1, (0.6 * waveA + 0.4 * waveB) * envelope)) * multipliers[index]
        const nextHeight = 10 + Math.min(energy, 1) * 12
        const nextOpacity = 0.5 + ((nextHeight - 10) / 12) * 0.5
        heights[index] += (nextHeight / 22 - heights[index]) * 0.2
        opacities[index] += (nextOpacity - opacities[index]) * 0.2
        bar.style.height = `${heights[index] * 22}px`
        bar.style.opacity = `${opacities[index]}`
      })
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [active])

  return (
    <span className="wf-hero-pill-bars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => <i key={index} ref={(element) => { barRefs.current[index] = element }} />)}
    </span>
  )
}

const HeroOutputFlow = ({ active }: { active: boolean }) => {
  const [mobile, setMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<Array<HTMLSpanElement | null>>([])
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const frameRef = useRef<number | null>(null)
  const integrations = useMemo(
    () => mobile ? MOBILE_FLOW_INDEXES.map((index) => FLOW_INTEGRATIONS[index]) : FLOW_INTEGRATIONS,
    [mobile],
  )

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(max-width: 540px)')
    const sync = () => setMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver !== 'function') return
    const sync = () => { dimensionsRef.current = { width: container.clientWidth, height: container.clientHeight } }
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const duration = 30000
    const animate = (now: number) => {
      const { width, height } = dimensionsRef.current
      if (document.visibilityState !== 'hidden' && width > 0 && height > 0) {
        integrations.forEach((_, index) => {
          const icon = iconRefs.current[index]
          if (!icon) return
          const progress = (((now - start - (index / integrations.length) * duration) % duration) + duration) % duration / duration
          const [pathX, pathY] = pointOnFlow(progress)
          const x = mobile ? progress * width : (pathX / 1024) * width
          const y = (pathY / 620) * height
          icon.style.opacity = `${edgeOpacity(progress, mobile)}`
          icon.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        })
      }
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [active, integrations, mobile])

  return (
    <div ref={containerRef} className="wf-hero-flow-output" aria-hidden="true">
      {integrations.map((name, index) => (
        <span className="wf-hero-flow-icon" ref={(element) => { iconRefs.current[index] = element }} key={`${name}-${index}`}>
          <IntegrationIcon name={name} compact />
        </span>
      ))}
    </div>
  )
}

const StaticHeroOutput = () => {
  const integrations = MOBILE_FLOW_INDEXES.map((index) => FLOW_INTEGRATIONS[index])
  return (
    <div className="wf-hero-flow-output is-static" aria-hidden="true">
      {integrations.map((name, index) => (
        <span className="wf-hero-flow-icon" style={{ left: `${8 + index * 14}%`, top: `${68 - index * 2.5}%` }} key={`${name}-${index}`}>
          <IntegrationIcon name={name} compact />
        </span>
      ))}
    </div>
  )
}

const HeroFlow = ({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) => (
  <div className="wf-hero-flow" style={{ '--wf-pill-play-state': active ? 'running' : 'paused' } as React.CSSProperties} aria-hidden="true">
    <div className="wf-hero-flow-input">
      <svg className="wf-hero-flow-svg" viewBox="0 0 1048 594" fill="none" preserveAspectRatio="none">
        <path id="wf-hero-input-curve" d="M0.597656 50.924805C17.4612 143.2965 97.8522 293.141 284.508 353.548C440.828 399.056 583.839 294.067 500.618 184.7492C417.397 75.4309 238.217 282.098 499.258 441.668C551.913 477.802 817.468 561.26 1046.43 565.235" />
        <text className="wf-hero-flow-text" x={reducedMotion ? '-350' : '-1400'}>
          <textPath href="#wf-hero-input-curve">{HERO_REQUEST} · {HERO_REQUEST} · {HERO_REQUEST}</textPath>
          {!reducedMotion ? <animate attributeName="x" dur="35s" values="-1400; 900" repeatCount="indefinite" /> : null}
        </text>
      </svg>
    </div>
    <div className="wf-hero-pill">
      <div className="wf-hero-pill-frost" />
      <div className="wf-hero-pill-border" />
      <div className="wf-hero-pill-inner"><AnimatedAudioBars active={active && !reducedMotion} /></div>
    </div>
    {reducedMotion ? <StaticHeroOutput /> : <HeroOutputFlow active={active} />}
  </div>
)

const HeroSection = () => {
  const reducedMotion = useReducedMotion()
  const { ref, visible } = useSectionVisibility<HTMLElement>(0.1)

  return (
    <section ref={ref} className="wf-hero" id="top">
      <div className="wf-hero-clouds" aria-hidden="true">
        <img className="is-top-left" src="/assets/generated/cloud-top-left.webp" alt="" />
        <img className="is-top-right" src="/assets/generated/cloud-top-right.webp" alt="" />
        <img className="is-bottom-left" src="/assets/generated/cloud-bottom-left.webp" alt="" />
        <img className="is-bottom-right" src="/assets/generated/cloud-bottom-right.webp" alt="" />
      </div>
      <div className="wf-hero-copy">
        <p className="wf-hero-proof"><img src="/assets/generated/whisperfield-mark.svg" alt="" />Independent preview build</p>
        <h1>Say it. Watch the work move.</h1>
        <p>Turn a thought into a clear action or finished draft without leaving the surface in front of you.</p>
        <GlassDownloadButton />
        <small>Fictional product · downloadable preview assets, no installer</small>
      </div>
      <div className="wf-hero-flow-anchor"><HeroFlow active={visible && !reducedMotion} reducedMotion={reducedMotion} /></div>
    </section>
  )
}

export { HeroSection }
