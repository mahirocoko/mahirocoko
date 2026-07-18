import { useEffect, useRef } from 'react'
import { SRGBColorSpace } from 'three/src/constants.js'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js'
import { BufferGeometry } from 'three/src/core/BufferGeometry.js'
import { Euler } from 'three/src/math/Euler.js'
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js'
import { IcosahedronGeometry } from 'three/src/geometries/IcosahedronGeometry.js'
import { TorusGeometry } from 'three/src/geometries/TorusGeometry.js'
import { Group } from 'three/src/objects/Group.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { Material } from 'three/src/materials/Material.js'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js'
import { Scene } from 'three/src/scenes/Scene.js'

interface ToneFieldProps {
  energy: number
  reducedMotion: boolean
  onPluck: () => void
}

const RING_COLORS = ['#ff5b3d', '#2947ff', '#11110f', '#d8ff5f', '#2947ff']

const ToneField = ({ energy, reducedMotion, onPluck }: ToneFieldProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const energyRef = useRef(energy)
  const keyboardPointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    energyRef.current = energy
  }, [energy])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let frame = 0
    let inView = true
    let disposed = false
    let currentX = 0
    let currentY = 0

    const scene = new Scene()
    const camera = new PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0, 7.8)

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        antialias: window.devicePixelRatio <= 1.5,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      mount.dataset.fallback = 'true'
      return
    }

    renderer.setClearAlpha(0)
    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.tabIndex = -1
    mount.prepend(renderer.domElement)

    const group = new Group()
    group.rotation.x = -0.22
    scene.add(group)

    const geometries: BufferGeometry[] = []
    const materials: Material[] = []
    const rings: Mesh[] = []

    RING_COLORS.forEach((color, index) => {
      const geometry = new TorusGeometry(1.06 + index * 0.28, 0.025 + index * 0.003, 8, 144)
      const material = new MeshBasicMaterial({ color })
      const ring = new Mesh(geometry, material)
      ring.rotation.x = Math.PI * (0.16 + index * 0.105)
      ring.rotation.y = Math.PI * (index * 0.13)
      ring.rotation.z = Math.PI * (index * 0.08)
      ring.userData.baseRotation = ring.rotation.clone()
      geometries.push(geometry)
      materials.push(material)
      rings.push(ring)
      group.add(ring)
    })

    const coreGeometry = new IcosahedronGeometry(0.78, 1)
    const coreMaterial = new MeshBasicMaterial({
      color: '#11110f',
      wireframe: true,
      transparent: true,
      opacity: 0.76,
    })
    const core = new Mesh(coreGeometry, coreMaterial)
    geometries.push(coreGeometry)
    materials.push(coreMaterial)
    group.add(core)

    const nodes = new Group()
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2
      const geometry = new BoxGeometry(0.05, 0.05, 0.34 + (index % 3) * 0.08)
      const material = new MeshBasicMaterial({
        color: index % 2 === 0 ? '#ff5b3d' : '#2947ff',
      })
      const node = new Mesh(geometry, material)
      node.position.set(Math.cos(angle) * 1.83, Math.sin(angle) * 1.83, 0)
      node.rotation.z = angle
      geometries.push(geometry)
      materials.push(material)
      nodes.add(node)
    }
    group.add(nodes)

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const render = (time = 0) => {
      if (disposed || !inView || document.hidden) return

      currentX += (keyboardPointerRef.current.x - currentX) * 0.055
      currentY += (keyboardPointerRef.current.y - currentY) * 0.055
      const pulse = Math.max(0, 1 - (performance.now() - energyRef.current) / 760)

      group.rotation.y = currentX * 0.22 + (reducedMotion ? 0 : time * 0.00008)
      group.rotation.x = -0.22 + currentY * 0.15
      core.rotation.y = reducedMotion ? 0.25 : time * 0.00021
      core.rotation.x = reducedMotion ? -0.15 : time * 0.00013
      core.scale.setScalar(1 + pulse * 0.18)
      nodes.rotation.z = reducedMotion ? 0.18 : -time * 0.00011

      rings.forEach((ring, index) => {
        const base = ring.userData.baseRotation as Euler
        ring.rotation.z = base.z + Math.sin(time * 0.00042 + index) * 0.035 * (reducedMotion ? 0 : 1)
        ring.scale.setScalar(1 + pulse * (0.045 + index * 0.016))
      })

      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect()
      keyboardPointerRef.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      keyboardPointerRef.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    }
    const handlePointerLeave = () => {
      keyboardPointerRef.current = { x: 0, y: 0 }
    }
    const handleVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && inView) frame = requestAnimationFrame(render)
    }
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      mount.dataset.fallback = 'true'
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        cancelAnimationFrame(frame)
        if (inView && !document.hidden) frame = requestAnimationFrame(render)
      },
      { rootMargin: '160px' },
    )

    resizeObserver.observe(mount)
    intersectionObserver.observe(mount)
    mount.addEventListener('pointermove', handlePointerMove)
    mount.addEventListener('pointerleave', handlePointerLeave)
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost)
    document.addEventListener('visibilitychange', handleVisibility)
    resize()
    renderer.compile(scene, camera)
    renderer.render(scene, camera)
    frame = requestAnimationFrame(render)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      mount.removeEventListener('pointermove', handlePointerMove)
      mount.removeEventListener('pointerleave', handlePointerLeave)
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost)
      document.removeEventListener('visibilitychange', handleVisibility)
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [reducedMotion])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = 0.28
    const next = { ...keyboardPointerRef.current }

    if (event.key === 'ArrowLeft') next.x -= step
    else if (event.key === 'ArrowRight') next.x += step
    else if (event.key === 'ArrowUp') next.y -= step
    else if (event.key === 'ArrowDown') next.y += step
    else if (event.key === 'Home') {
      next.x = 0
      next.y = 0
    } else return

    event.preventDefault()
    keyboardPointerRef.current = {
      x: Math.max(-1, Math.min(1, next.x)),
      y: Math.max(-1, Math.min(1, next.y)),
    }
  }

  return (
    <div className="tone-field" ref={mountRef}>
      <div className="tone-field__fallback" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <button
        className="tone-field__control"
        type="button"
        aria-describedby="tone-field-hint"
        onClick={onPluck}
        onKeyDown={handleKeyDown}
      >
        <span>Pluck field</span>
        <span aria-hidden="true">↗</span>
      </button>
      <p className="tone-field__caption" id="tone-field-hint">
        Drag or use arrow keys to bend. Sound requires consent.
      </p>
    </div>
  )
}

export { ToneField }
