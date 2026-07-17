import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import type { Finish, ModuleId, RailSize } from '../types'
import { BuilderPreviewFallback } from './builder-preview-fallback'

const LazySystemBuilder3D = lazy(async () => {
  const module = await import('./system-builder-3d')
  return { default: module.SystemBuilder3D }
})

interface BuilderPreviewProps {
  railSize: RailSize
  finish: Finish
  modules: ModuleId[]
}

interface BuilderPreviewBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onFallback: () => void
}

interface BuilderPreviewBoundaryState {
  failed: boolean
}

class BuilderPreviewBoundary extends Component<BuilderPreviewBoundaryProps, BuilderPreviewBoundaryState> {
  state: BuilderPreviewBoundaryState = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onFallback()
    console.error('DOVEL 3D preview fell back to concept geometry.', error, info)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const supportsWebGl = () => {
  const canvas = document.createElement('canvas')
  return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
}

export const BuilderPreview = ({ railSize, finish, modules }: BuilderPreviewProps) => {
  const [runtime, setRuntime] = useState({ ready: false, reducedMotion: false, webgl: false })
  const [nearViewport, setNearViewport] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const handleModelReady = useCallback(() => setModelReady(true), [])
  const handlePreviewFallback = useCallback(() => setPreviewFailed(true), [])

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setRuntime({ ready: true, reducedMotion: motion.matches, webgl: supportsWebGl() })
    }
    update()
    motion.addEventListener('change', update)
    return () => motion.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return
    const stage = stageRef.current
    if (!stage || !('IntersectionObserver' in window)) {
      setNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setNearViewport(true)
        observer.disconnect()
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const fallback = (
    <BuilderPreviewFallback railSize={railSize} finish={finish} modules={modules} />
  )
  const moduleNames = modules.length
    ? modules.map((moduleId) => moduleId.replaceAll('-', ' ')).join(', ')
    : 'rail only'
  const shouldRender3D = runtime.ready && runtime.webgl && nearViewport && !previewFailed
  const isLive3D = shouldRender3D && modelReady

  return (
    <>
      <div
        className="builder-preview-stage"
        role="img"
        aria-label={`${railSize} centimetre ${finish} DOVEL rail configured with ${moduleNames}`}
        ref={stageRef}
      >
        {shouldRender3D ? (
          <BuilderPreviewBoundary fallback={fallback} onFallback={handlePreviewFallback}>
            <Suspense fallback={fallback}>
              <LazySystemBuilder3D
                railSize={railSize}
                finish={finish}
                modules={modules}
                reducedMotion={runtime.reducedMotion}
                onReady={handleModelReady}
              />
            </Suspense>
          </BuilderPreviewBoundary>
        ) : (
          fallback
        )}
        <div className="builder-preview-meta" aria-hidden="true">
          <span>{isLive3D ? 'System 01 · GLB' : 'System 01 · CSS fallback'}</span>
          <span>{isLive3D ? 'Live 3D configuration' : 'Static geometry fallback'}</span>
        </div>
      </div>
      <p className="canvas-note">
        {isLive3D
          ? 'Live 3D concept · dimensions follow the selected rail span'
          : 'Static concept geometry · attachment positions are illustrative'}
      </p>
    </>
  )
}
