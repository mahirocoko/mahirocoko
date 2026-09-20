import type { SnapStation } from '../physics/snap.ts'

interface SnapStationAnchorProps {
  station: SnapStation
  isActive: boolean
  isProjectedTarget: boolean
  stageCenter: { x: number; y: number }
  onSelect: (station: SnapStation) => void
}

const SnapStationAnchor = ({
  station,
  isActive,
  isProjectedTarget,
  stageCenter,
  onSelect,
}: SnapStationAnchorProps) => {
  const pixelX = stageCenter.x + station.x
  const pixelY = stageCenter.y + station.y

  const className = [
    'snap-dock-anchor',
    isActive ? 'active' : '',
    isProjectedTarget ? 'projected-target' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      style={{
        left: `${pixelX}px`,
        top: `${pixelY}px`,
        '--station-color': station.colorAccent,
      } as React.CSSProperties}
      onClick={() => onSelect(station)}
      aria-label={`Snap station ${station.title}: ${station.subtitle}. Shortcut ${station.shortcutKey}`}
      title={`Click or press [${station.shortcutKey}] to spring here`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="dock-key-tag">{station.shortcutKey}</span>
        <span className="dock-title">{station.title}</span>
      </div>
      <span className="dock-sub">{station.subtitle}</span>
    </button>
  )
}

export default SnapStationAnchor
