import { BUILD_SPOTS, GAME_HEIGHT, GAME_WIDTH } from '../game/content/map'
import { TOWERS } from '../game/content/towers'
import type { GameSnapshot, Tower, TowerKind } from '../game/simulation/types'

type HudEventDetail = {
  snapshot: GameSnapshot
  towers: Tower[]
}

const towerPanel = document.querySelector<HTMLDivElement>('#tower-panel')
const hudRoot = document.querySelector<HTMLDivElement>('#hud-root')

let latestDetail: HudEventDetail | null = null
let controlsBound = false
let screen: 'start' | 'playing' = 'start'

const TOWER_ICON_SRC: Record<TowerKind, string> = {
  spark: '/assets/sprites/spark-spire.png',
  thumper: '/assets/sprites/stone-thumper.png',
  frost: '/assets/sprites/frost-bloom.png',
}

export function mountHud(): void {
  if (!towerPanel || !hudRoot) {
    throw new Error('Missing HUD roots')
  }

  bindControls()
  window.addEventListener('resize', syncBuildLayerBounds)

  window.addEventListener('wavebreak:state', (event) => {
    latestDetail = (event as CustomEvent<HudEventDetail>).detail
    render()
  })

  render()
}

function render(): void {
  if (!towerPanel || !hudRoot) return

  const snapshot = latestDetail?.snapshot
  const towers = latestDetail?.towers ?? []
  const selectedTower = snapshot?.selectedTower ?? 'spark'

  towerPanel.hidden = screen !== 'playing'
  towerPanel.innerHTML = `
    <div class="build-layer" aria-label="Build spots">
      ${BUILD_SPOTS.map((spot) => {
        return `<button type="button" class="build-spot-hit" data-spot="${spot.id}" style="left: ${(spot.x / GAME_WIDTH) * 100}%; top: ${(spot.y / GAME_HEIGHT) * 100}%;" aria-label="Build at ${spot.id}"></button>`
      }).join('')}
    </div>
    <div class="tower-dock">
      <div class="dock-label">
        <span>Build</span>
        <strong>${selectedTowerName(selectedTower)}</strong>
      </div>
      <div class="tower-list">
        ${TOWERS.map((tower) => towerButtonMarkup(tower.id, selectedTower)).join('')}
      </div>
    </div>
    <div class="wave-float">
      <button type="button" class="wave-button" data-action="start-wave" ${snapshot?.phase !== 'planning' ? 'disabled' : ''}>
        ${waveButtonLabel(snapshot)}
      </button>
      <button type="button" class="ghost-button" data-action="restart">Restart</button>
      <div class="tower-log">
        <span>${towers.length} towers</span>
        <span>${towers.reduce((total, tower) => total + tower.kills, 0)} takedowns</span>
      </div>
    </div>
  `

  hudRoot.innerHTML = `
    ${screen === 'start' ? startScreenMarkup() : gameHudMarkup(snapshot)}
    ${snapshot?.phase === 'won' || snapshot?.phase === 'lost' ? endStateMarkup(snapshot.phase) : ''}
  `

  requestAnimationFrame(syncBuildLayerBounds)
}

function towerButtonMarkup(kind: TowerKind, selectedTower: TowerKind): string {
  const tower = TOWERS.find((entry) => entry.id === kind)
  if (!tower) return ''

  return `
    <button type="button" class="tower-button ${selectedTower === tower.id ? 'is-selected' : ''}" data-tower="${tower.id}" style="--tower-accent: ${tower.accent}" aria-label="${tower.name}: ${tower.description}">
      <span class="tower-sprite" aria-hidden="true">
        <img src="${TOWER_ICON_SRC[tower.id]}" alt="" />
      </span>
      <span>
        <strong>${tower.shortName}</strong>
        <small>${tower.cost}g</small>
      </span>
    </button>
  `
}

function bindControls(): void {
  if (!towerPanel || !hudRoot || controlsBound) return

  controlsBound = true
  const handlePointer = (event: PointerEvent) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('button')
    if (!button || button.disabled) return

    event.preventDefault()

    if (button.dataset.action === 'start-game') {
      screen = 'playing'
      render()
      return
    }

    const spotId = button.dataset.spot
    if (spotId) {
      window.dispatchEvent(new CustomEvent('wavebreak:build-spot', { detail: { spotId } }))
      return
    }

    const kind = button.dataset.tower as TowerKind | undefined
    if (kind) {
      window.dispatchEvent(new CustomEvent('wavebreak:select-tower', { detail: { kind } }))
      return
    }

    if (button.dataset.action === 'start-wave') {
      window.dispatchEvent(new CustomEvent('wavebreak:start-wave'))
      return
    }

    if (button.dataset.action === 'restart') {
      window.dispatchEvent(new CustomEvent('wavebreak:restart'))
    }
  }

  towerPanel.addEventListener('pointerdown', handlePointer)
  hudRoot.addEventListener('pointerdown', handlePointer)
}

function waveButtonLabel(snapshot?: GameSnapshot): string {
  if (!snapshot) return 'Start Wave'
  if (snapshot.phase === 'wave') return `${snapshot.enemiesAlive + snapshot.enemiesQueued} threats active`
  if (snapshot.phase === 'won') return 'All waves cleared'
  if (snapshot.phase === 'lost') return 'Crystal lost'

  return `Start Wave ${snapshot.waveIndex + 1}`
}

function endStateMarkup(phase: 'won' | 'lost'): string {
  return `
    <div class="end-state ${phase}">
      <strong>${phase === 'won' ? 'Victory' : 'Defeat'}</strong>
      <span>${phase === 'won' ? 'The crystal survived every wave.' : 'The wave broke through the final guard.'}</span>
    </div>
  `
}

function gameHudMarkup(snapshot?: GameSnapshot): string {
  return `
    <div class="hud-strip">
      <div class="hud-meter danger">
        <span><img src="/assets/menu/generated/heart.png" alt="" />Lives</span>
        <strong>${snapshot?.lives ?? 20}</strong>
      </div>
      <div class="hud-meter gold">
        <span><img src="/assets/menu/generated/coin.png" alt="" />Gold</span>
        <strong>${snapshot?.gold ?? 160}</strong>
      </div>
      <div class="hud-meter wave">
        <span><img src="/assets/menu/generated/wave-skull.png" alt="" />Wave</span>
        <strong>${snapshot ? Math.min(snapshot.waveIndex + 1, snapshot.waveCount) : 1}/${snapshot?.waveCount ?? 5}</strong>
      </div>
      <div class="hud-message">${snapshot?.message ?? 'Loading field...'}</div>
    </div>
    <div class="corner-controls" aria-label="Game controls">
      <button type="button" class="icon-button" data-action="restart" aria-label="Restart">&#8635;</button>
    </div>
  `
}

function startScreenMarkup(): string {
  return `
    <div class="start-screen">
      <div class="start-card" aria-label="Start menu">
        <div class="start-logo">
          <img src="/assets/menu/generated/wavebreak-logo-v2.png" alt="Wavebreak" />
        </div>
        <div class="start-actions">
          <button type="button" class="start-button" data-action="start-game">
            <img src="/assets/menu/generated/start-button-frame.png" alt="" />
            <span>Start Game</span>
          </button>
          <div class="start-secondary-row">
            <button type="button" class="secondary-button">
              <img src="/assets/menu/generated/secondary-button-frame.png" alt="" />
              <span>Settings</span>
            </button>
            <button type="button" class="secondary-button">
              <img src="/assets/menu/generated/secondary-button-frame.png" alt="" />
              <span>How to Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}

function selectedTowerName(kind: TowerKind): string {
  return TOWERS.find((tower) => tower.id === kind)?.shortName ?? 'Tower'
}

function syncBuildLayerBounds(): void {
  if (!towerPanel || screen !== 'playing') return

  const canvas = document.querySelector<HTMLCanvasElement>('canvas')
  const buildLayer = towerPanel.querySelector<HTMLDivElement>('.build-layer')
  if (!canvas || !buildLayer) return

  const canvasRect = canvas.getBoundingClientRect()
  const panelRect = towerPanel.getBoundingClientRect()
  buildLayer.style.left = `${canvasRect.left - panelRect.left}px`
  buildLayer.style.top = `${canvasRect.top - panelRect.top}px`
  buildLayer.style.width = `${canvasRect.width}px`
  buildLayer.style.height = `${canvasRect.height}px`
}
