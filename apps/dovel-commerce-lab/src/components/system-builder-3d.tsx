import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import {
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  type Material,
} from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Finish, ModuleId, RailSize } from '../types'

const MODEL_URL = '/assets/models/dovel-system-01.glb'
const RAIL_SCALE: Record<RailSize, number> = {
  90: 0.82,
  120: 1,
  150: 1.18,
}
const MODULE_NAMES: Record<ModuleId, 'ArcDock' | 'HaloLight' | 'PocketTray'> = {
  'arc-dock': 'ArcDock',
  'halo-light': 'HaloLight',
  'pocket-tray': 'PocketTray',
}
const MODULE_OFFSETS: Record<ModuleId, number> = {
  'arc-dock': -0.36,
  'halo-light': 0,
  'pocket-tray': 0.36,
}
const FINISH_COLOR: Record<Finish, Color> = {
  graphite: new Color('#565c58'),
  silver: new Color('#c3c0b6'),
}
const FINISH_ROUGHNESS: Record<Finish, number> = {
  graphite: 0.5,
  silver: 0.34,
}
const FINISH_INSET_COLOR: Record<Finish, Color> = {
  graphite: new Color('#3d4240'),
  silver: new Color('#b4b1a8'),
}
const FINISH_INSET_ROUGHNESS: Record<Finish, number> = {
  graphite: 0.64,
  silver: 0.48,
}
const FINISH_METALNESS: Record<Finish, number> = {
  graphite: 0.5,
  silver: 0.68,
}

export interface SystemBuilder3DProps {
  railSize: RailSize
  finish: Finish
  modules: readonly ModuleId[]
  reducedMotion?: boolean
  onReady?: () => void
  /** Override only for tests or asset experiments; production uses the public DOVEL GLB. */
  modelUrl?: string
}

interface PreparedModel {
  scene: Group
  railAssembly: Object3D | null
  railBody: Object3D | null
  modules: Record<ModuleId, Object3D | null>
  baseModuleX: Record<ModuleId, number>
  baseModuleY: Record<ModuleId, number>
  clonedMaterials: Material[]
  finishMaterials: MeshStandardMaterial[]
}

const cloneMaterial = (material: Material) => {
  const cloned = material.clone()
  cloned.transparent = true
  return cloned
}

const setObjectOpacity = (object: Object3D | null, opacity: number) => {
  if (!object) return

  const visibleOpacity = opacity < 0.04 ? 0 : opacity
  object.visible = visibleOpacity > 0
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return

    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      material.transparent = true
      material.opacity = visibleOpacity
      material.needsUpdate = true
    })
  })
}

const getObjectOpacity = (object: Object3D | null) => {
  if (!object || object.visible === false) return 0

  let opacity = 1
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return

    const material = Array.isArray(child.material) ? child.material[0] : child.material
    opacity = material.opacity
  })
  return opacity
}

const prepareModel = (gltf: GLTF): PreparedModel => {
  const clonedMaterials: Material[] = []
  const finishMaterials: MeshStandardMaterial[] = []
  const scene = gltf.scene.clone(true) as Group
  const runtimeHiddenModules = scene.getObjectByName('RuntimeHiddenModules')
  if (runtimeHiddenModules) runtimeHiddenModules.visible = false

  scene.traverse((child) => {
    if (!(child instanceof Mesh)) return

    child.castShadow = true
    child.receiveShadow = true
    if (child.name === 'ArcDock_inset' || child.name === 'ArcDock_ledgeNotch') {
      child.castShadow = false
      child.receiveShadow = false
    }

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => {
        const cloned = cloneMaterial(material)
        clonedMaterials.push(cloned)
        if (
          cloned instanceof MeshStandardMaterial &&
          (cloned.name === 'FinishMetal' || cloned.name === 'FinishInset')
        ) {
          finishMaterials.push(cloned)
        }
        return cloned
      })
    } else {
      const cloned = cloneMaterial(child.material)
      clonedMaterials.push(cloned)
      if (
        cloned instanceof MeshStandardMaterial &&
        (cloned.name === 'FinishMetal' || cloned.name === 'FinishInset')
      ) {
        finishMaterials.push(cloned)
      }
      child.material = cloned
    }
  })

  const modules = {
    'arc-dock': scene.getObjectByName(MODULE_NAMES['arc-dock']) ?? null,
    'halo-light': scene.getObjectByName(MODULE_NAMES['halo-light']) ?? null,
    'pocket-tray': scene.getObjectByName(MODULE_NAMES['pocket-tray']) ?? null,
  }

  return {
    scene,
    railAssembly: scene.getObjectByName('RailAssembly') ?? null,
    railBody: scene.getObjectByName('RailBody') ?? null,
    modules,
    baseModuleX: {
      'arc-dock': modules['arc-dock']?.position.x ?? 0,
      'halo-light': modules['halo-light']?.position.x ?? 0,
      'pocket-tray': modules['pocket-tray']?.position.x ?? 0,
    },
    baseModuleY: {
      'arc-dock': modules['arc-dock']?.position.y ?? 0,
      'halo-light': modules['halo-light']?.position.y ?? 0,
      'pocket-tray': modules['pocket-tray']?.position.y ?? 0,
    },
    clonedMaterials,
    finishMaterials,
  }
}

const CameraAim = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const { camera, invalidate, size } = useThree()

  /* eslint-disable react-hooks/immutability -- The R3F camera is an imperative Three.js object. */
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      const compact = size.width < 560
      camera.position.set(compact ? 1 : 1.25, compact ? 1.02 : 1, compact ? 2.55 : 1.85)
      camera.fov = compact ? 34 : 31
      camera.updateProjectionMatrix()
    }
    camera.lookAt(0, 0.28, 0)
    if (reducedMotion) invalidate()
  }, [camera, invalidate, reducedMotion, size.width])
  /* eslint-enable react-hooks/immutability */

  return null
}

interface SceneProps extends Required<Pick<SystemBuilder3DProps, 'modelUrl'>> {
  railSize: RailSize
  finish: Finish
  modules: readonly ModuleId[]
  reducedMotion: boolean
  onReady?: () => void
}

const DovelSystemScene = ({ railSize, finish, modules, reducedMotion, modelUrl, onReady }: SceneProps) => {
  const gltf = useLoader(GLTFLoader, modelUrl)
  const rigRef = useRef<Group>(null)
  const pointerTarget = useRef({ x: 0, y: 0 })
  const prepared = useMemo(() => prepareModel(gltf), [gltf])
  const selectedModules = useMemo(() => new Set<ModuleId>(modules), [modules])
  const { invalidate } = useThree()

  useEffect(() => () => {
    prepared.clonedMaterials.forEach((material) => material.dispose())
  }, [prepared])

  useEffect(() => {
    if (reducedMotion) invalidate()
  }, [finish, invalidate, modules, railSize, reducedMotion])

  useEffect(() => onReady?.(), [onReady])

  /* eslint-disable react-hooks/immutability -- Three.js scene graphs are intentionally mutated per frame. */
  useFrame(({ pointer }, delta) => {
    const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * 11)
    const railTargetScale = RAIL_SCALE[railSize]

    if (reducedMotion) {
      pointerTarget.current.x = 0
      pointerTarget.current.y = 0
    } else {
      pointerTarget.current.x = MathUtils.clamp(pointer.y * 0.055, -0.04, 0.04)
      pointerTarget.current.y = MathUtils.clamp(pointer.x * 0.075, -0.06, 0.06)
    }

    if (rigRef.current) {
      rigRef.current.rotation.x = MathUtils.lerp(rigRef.current.rotation.x, pointerTarget.current.x, ease)
      rigRef.current.rotation.y = MathUtils.lerp(rigRef.current.rotation.y, pointerTarget.current.y, ease)
    }

    const railTarget = prepared.railBody ?? prepared.railAssembly
    if (railTarget) {
      railTarget.scale.x = MathUtils.lerp(railTarget.scale.x, railTargetScale, ease)
    }

    prepared.finishMaterials.forEach((material) => {
      const isInset = material.name === 'FinishInset'
      const targetFinish = isInset ? FINISH_INSET_COLOR[finish] : FINISH_COLOR[finish]
      const targetRoughness = isInset
        ? FINISH_INSET_ROUGHNESS[finish]
        : FINISH_ROUGHNESS[finish]
      material.color.lerp(targetFinish, ease)
      material.roughness = MathUtils.lerp(material.roughness, targetRoughness, ease)
      const targetMetalness = isInset
        ? finish === 'graphite' ? 0.34 : 0.42
        : FINISH_METALNESS[finish]
      material.metalness = MathUtils.lerp(material.metalness, targetMetalness, ease)
    })

    Object.entries(prepared.modules).forEach(([moduleId, object]) => {
      const typedModuleId = moduleId as ModuleId
      const isSelected = selectedModules.has(typedModuleId)
      const targetOpacity = isSelected ? 1 : 0
      const currentOpacity = getObjectOpacity(object)
      const nextOpacity = MathUtils.lerp(currentOpacity, targetOpacity, ease)
      const baseX = prepared.baseModuleX[typedModuleId]
      const sizeOffset = (railTargetScale - 1) * MODULE_OFFSETS[typedModuleId]

      if (object) {
        object.position.x = MathUtils.lerp(object.position.x, baseX + sizeOffset, ease)
        object.position.y = MathUtils.lerp(
          object.position.y,
          prepared.baseModuleY[typedModuleId] + (isSelected ? 0 : -0.08),
          ease,
        )
        const targetScale = isSelected ? 1 : 0.94
        object.scale.setScalar(MathUtils.lerp(object.scale.x, targetScale, ease))
      }
      setObjectOpacity(object, nextOpacity)
    })
  })
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <CameraAim reducedMotion={reducedMotion} />
      <color attach="background" args={[finish === 'graphite' ? '#303431' : '#c1beb4']} />
      <ambientLight intensity={1.05} />
      <hemisphereLight args={['#f4efe5', '#3d3026', 1.25]} />
      <directionalLight
        position={[-2.4, 3.6, 3.2]}
        intensity={1.8}
        castShadow
        shadow-bias={-0.0002}
        shadow-normalBias={0.025}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[2.2, 1.8, 2.6]} intensity={0.72} color="#dce7e2" />
      <spotLight position={[2.5, 2.8, 1.8]} angle={0.34} penumbra={0.7} intensity={0.68} color="#f4ddbb" />
      <group ref={rigRef} position={[0, 0.04, 0]} rotation={[0.06, -0.14, 0]}>
        <primitive object={prepared.scene} />
      </group>
      <mesh position={[0, -0.08, 1.28]} receiveShadow>
        <boxGeometry args={[4.8, 0.16, 2.6]} />
        <meshStandardMaterial color={finish === 'graphite' ? '#725b43' : '#8a7154'} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.005, -0.015]} receiveShadow>
        <boxGeometry args={[4.8, 0.012, 0.026]} />
        <meshStandardMaterial color={finish === 'graphite' ? '#4f3d2d' : '#66503a'} roughness={0.88} />
      </mesh>
    </>
  )
}

export const SystemBuilder3D = ({
  railSize,
  finish,
  modules,
  reducedMotion = false,
  modelUrl = MODEL_URL,
  onReady,
}: SystemBuilder3DProps) => (
  <Canvas
    aria-hidden="true"
    camera={{ position: [1.25, 1, 1.85], fov: 31, near: 0.1, far: 20 }}
    dpr={[1, 1.5]}
    frameloop={reducedMotion ? 'demand' : 'always'}
    shadows
    gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
  >
    <Suspense fallback={null}>
      <DovelSystemScene railSize={railSize} finish={finish} modules={modules} reducedMotion={reducedMotion} modelUrl={modelUrl} onReady={onReady} />
    </Suspense>
  </Canvas>
)

SystemBuilder3D.preload = (modelUrl = MODEL_URL) => {
  useLoader.preload(GLTFLoader, modelUrl)
}

export default SystemBuilder3D
