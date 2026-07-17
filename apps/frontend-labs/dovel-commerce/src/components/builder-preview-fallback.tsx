import type { CSSProperties } from 'react'
import type { Finish, ModuleId, RailSize } from '../types'

export interface BuilderPreviewFallbackProps {
  railSize: RailSize
  finish: Finish
  modules: readonly ModuleId[]
}

const moduleIsPresent = (modules: readonly ModuleId[], moduleId: ModuleId) => modules.includes(moduleId)

export const BuilderPreviewFallback = ({
  railSize,
  finish,
  modules,
}: BuilderPreviewFallbackProps) => (
  <div
    className="desk-scene"
    data-finish={finish}
    style={{ '--rail-width': `${58 + (railSize - 90) * 0.24}%` } as CSSProperties}
    aria-hidden="true"
  >
    <div className="desk-plane" />
    <div className="system-rail">
      <i className="rail-slot" />
      <span className={`attached attached--dock ${moduleIsPresent(modules, 'arc-dock') ? 'is-present' : 'is-absent'}`} aria-hidden="true"><b /><small>ARC</small></span>
      <span className={`attached attached--light ${moduleIsPresent(modules, 'halo-light') ? 'is-present' : 'is-absent'}`} aria-hidden="true"><b /><small>HALO</small></span>
      <span className={`attached attached--tray ${moduleIsPresent(modules, 'pocket-tray') ? 'is-present' : 'is-absent'}`} aria-hidden="true"><b /><small>POCKET</small></span>
    </div>
    <span className="canvas-scale">{railSize}0 mm</span>
  </div>
)

export default BuilderPreviewFallback
