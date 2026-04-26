import Phaser from 'phaser'
import { BASE_POINT, BUILD_SPOTS, GAME_HEIGHT, GAME_WIDTH, PATH } from '../../game/content/map'
import { towerById } from '../../game/content/towers'
import {
  buildTower,
  createInitialState,
  getSnapshot,
  selectTower,
  startNextWave,
  tick,
} from '../../game/simulation/state'
import type { BuildResult, BuildSpot, Enemy, GameState, HitEffect, Point, Projectile, Tower } from '../../game/simulation/types'

const BUILD_HIT_RADIUS = 48

const TOWER_SPRITES: Record<Tower['kind'], { key: string; size: number; yOffset: number }> = {
  spark: { key: 'tower-spark', size: 68, yOffset: -10 },
  thumper: { key: 'tower-thumper', size: 74, yOffset: -8 },
  frost: { key: 'tower-frost', size: 70, yOffset: -10 },
}

const ENEMY_SPRITES: Record<Enemy['kind'], { key: string; size: number }> = {
  runner: { key: 'enemy-runner', size: 32 },
  brute: { key: 'enemy-brute', size: 46 },
  skitter: { key: 'enemy-skitter', size: 32 },
  warden: { key: 'enemy-warden', size: 72 },
}

const PROJECTILE_FX: Record<Tower['kind'], { key: string; size: number }> = {
  spark: { key: 'fx-spark-projectile', size: 24 },
  thumper: { key: 'fx-thumper-projectile', size: 30 },
  frost: { key: 'fx-frost-projectile', size: 26 },
}

const IMPACT_FX: Record<Tower['kind'], { key: string; minSize: number }> = {
  spark: { key: 'fx-spark-impact', minSize: 42 },
  thumper: { key: 'fx-thumper-impact', minSize: 86 },
  frost: { key: 'fx-frost-impact', minSize: 58 },
}

export class GameScene extends Phaser.Scene {
  private state: GameState = createInitialState()
  private terrain!: Phaser.GameObjects.Image
  private ambience!: Phaser.GameObjects.Graphics
  private crystalBase!: Phaser.GameObjects.Image
  private board!: Phaser.GameObjects.Graphics
  private entities!: Phaser.GameObjects.Graphics
  private entityImages: Phaser.GameObjects.Image[] = []
  private floatingLabels: Phaser.GameObjects.Text[] = []
  private hoverSpotId: string | null = null
  private elapsedSeconds = 0
  private lastLives = this.state.lives
  private lastHudSignature = ''

  constructor() {
    super('game')
  }

  preload(): void {
    this.load.image('map-base', '/assets/map/wavebreak-forest-base.png')
    this.load.image('tower-spark', '/assets/sprites/spark-spire.png')
    this.load.image('tower-thumper', '/assets/sprites/stone-thumper.png')
    this.load.image('tower-frost', '/assets/sprites/frost-bloom.png')
    this.load.image('enemy-runner', '/assets/sprites/runner.png')
    this.load.image('enemy-brute', '/assets/sprites/brute.png')
    this.load.image('enemy-skitter', '/assets/sprites/skitter.png')
    this.load.image('enemy-warden', '/assets/sprites/warden.png')
    this.load.image('crystal-base', '/assets/sprites/crystal-base.png')
    this.load.image('fx-spark-projectile', '/assets/fx/spark-projectile.png')
    this.load.image('fx-thumper-projectile', '/assets/fx/thumper-projectile.png')
    this.load.image('fx-frost-projectile', '/assets/fx/frost-projectile.png')
    this.load.image('fx-spark-impact', '/assets/fx/spark-impact.png')
    this.load.image('fx-thumper-impact', '/assets/fx/thumper-impact.png')
    this.load.image('fx-frost-impact', '/assets/fx/frost-impact.png')
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#16261d')
    this.createTerrain()
    this.board = this.add.graphics()
    this.board.setDepth(2)
    this.entities = this.add.graphics()
    this.entities.setDepth(5)

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.hoverSpotId = findSpot(pointer.worldX, pointer.worldY)?.id ?? null
    })

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const spot = findSpot(pointer.worldX, pointer.worldY)
      if (!spot) return

      const result = buildTower(this.state, spot.id)
      if (!result.ok) {
        this.state.message = messageForBuildFailure(result.reason)
      }

      this.emitHud()
    })

    window.addEventListener('wavebreak:select-tower', this.handleTowerSelect)
    window.addEventListener('wavebreak:start-wave', this.handleStartWave)
    window.addEventListener('wavebreak:restart', this.handleRestart)
    window.addEventListener('wavebreak:build-spot', this.handleBuildSpot)

    this.drawBoard()
    this.emitHud(true)
  }

  update(_time: number, delta: number): void {
    this.elapsedSeconds += delta / 1000
    tick(this.state, delta / 1000)
    if (this.state.lives < this.lastLives) {
      this.cameras.main.shake(180, 0.004)
      this.tweens.add({
        targets: this.crystalBase,
        scale: { from: 0.54, to: 0.46 },
        duration: 220,
        ease: 'Sine.out',
      })
    }
    this.lastLives = this.state.lives
    this.drawEntities()
    this.emitHud()
  }

  destroy(): void {
    window.removeEventListener('wavebreak:select-tower', this.handleTowerSelect)
    window.removeEventListener('wavebreak:start-wave', this.handleStartWave)
    window.removeEventListener('wavebreak:restart', this.handleRestart)
    window.removeEventListener('wavebreak:build-spot', this.handleBuildSpot)
  }

  private readonly handleTowerSelect = (event: Event): void => {
    const detail = (event as CustomEvent<{ kind: Tower['kind'] }>).detail
    selectTower(this.state, detail.kind)
    this.emitHud(true)
  }

  private readonly handleStartWave = (): void => {
    startNextWave(this.state)
    if (this.state.phase === 'wave') {
      this.cameras.main.flash(160, 145, 232, 212, false)
    }
    this.emitHud(true)
  }

  private readonly handleRestart = (): void => {
    this.state = createInitialState()
    this.hoverSpotId = null
    this.lastLives = this.state.lives
    this.emitHud(true)
  }

  private readonly handleBuildSpot = (event: Event): void => {
    const detail = (event as CustomEvent<{ spotId: string }>).detail
    const result = buildTower(this.state, detail.spotId)
    if (!result.ok) {
      this.state.message = messageForBuildFailure(result.reason)
    }

    this.emitHud(true)
  }

  private emitHud(force = false): void {
    const snapshot = getSnapshot(this.state)
    const signature = JSON.stringify({
      snapshot,
      towers: this.state.towers.map((tower) => [tower.id, tower.kind, tower.spotId, tower.kills]),
    })

    if (!force && signature === this.lastHudSignature) return
    this.lastHudSignature = signature

    window.dispatchEvent(
      new CustomEvent('wavebreak:state', {
        detail: {
          snapshot,
          towers: this.state.towers,
        },
      }),
    )
  }

  private drawBoard(): void {
    this.board.clear()
    this.drawBuildSpots()
    this.drawBase()
  }

  private createTerrain(): void {
    this.terrain = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'map-base')
    this.terrain.setDepth(-30)
    this.terrain.setDisplaySize(GAME_WIDTH, GAME_HEIGHT)

    this.ambience = this.add.graphics()
    this.ambience.setDepth(-24)

    this.crystalBase = this.add.image(BASE_POINT.x, BASE_POINT.y, 'crystal-base')
    this.crystalBase.setDepth(4)
    this.crystalBase.setScale(0.46)
  }

  private drawAmbientDetails(): void {
    this.ambience.clear()
    for (let i = 0; i < 28; i += 1) {
      const x = (i * 139) % GAME_WIDTH
      const y = (i * 83) % GAME_HEIGHT
      const flicker = 0.28 + Math.sin(this.elapsedSeconds * 1.6 + i) * 0.12
      this.ambience.fillStyle(i % 4 === 0 ? 0x91e8d4 : 0xf1c66f, flicker)
      this.ambience.fillCircle(x, y, i % 4 === 0 ? 2.2 : 1.5)
    }
  }

  private drawPathHighlight(): void {
    this.board.lineStyle(3, 0xf0d296, this.state.phase === 'wave' ? 0.36 : 0.2)
    drawPolyline(this.board, PATH)
  }

  private drawBuildSpots(): void {
    for (const spot of BUILD_SPOTS) {
      const occupied = this.state.towers.some((tower) => tower.spotId === spot.id)
      const selected = this.hoverSpotId === spot.id
      const pulse = 1 + Math.sin(this.elapsedSeconds * 3 + spot.x * 0.03) * 0.04

      this.board.fillStyle(occupied ? 0x101915 : 0x10251c, occupied ? 0.26 : 0.18)
      this.board.fillCircle(spot.x, spot.y, 31 * pulse)
      this.board.lineStyle(selected ? 4 : 2, selected ? 0xf3d38a : 0xd7c38f, selected ? 0.9 : 0.48)
      this.board.strokeCircle(spot.x, spot.y, selected ? 36 : 30)
      this.board.lineStyle(2, occupied ? 0x6e7164 : 0x91e8d4, occupied ? 0.26 : 0.46)
      this.board.lineBetween(spot.x - 13, spot.y, spot.x + 13, spot.y)
      this.board.lineBetween(spot.x, spot.y - 13, spot.x, spot.y + 13)
    }
  }

  private drawBase(): void {
    const pulse = 1 + Math.sin(this.elapsedSeconds * 2.2) * 0.04
    this.board.fillStyle(0x79f5d8, 0.12)
    this.board.fillCircle(BASE_POINT.x, BASE_POINT.y, 72 * pulse)
    this.board.lineStyle(3, 0x91e8d4, 0.72)
    this.board.strokeCircle(BASE_POINT.x, BASE_POINT.y, 58 * pulse)
    this.board.fillStyle(0xf9f1dc, 0.06)
    this.board.fillCircle(BASE_POINT.x, BASE_POINT.y, 92 * pulse)
  }

  private drawEntities(): void {
    this.drawAmbientDetails()
    this.drawBoard()
    this.drawPathHighlight()
    this.entities.clear()
    for (const image of this.entityImages) {
      image.destroy()
    }
    this.entityImages = []
    for (const label of this.floatingLabels) {
      label.destroy()
    }
    this.floatingLabels = []

    for (const tower of this.state.towers) {
      this.drawTower(tower)
    }

    for (const enemy of this.state.enemies) {
      this.drawEnemy(enemy)
    }

    for (const projectile of this.state.projectiles) {
      this.drawProjectile(projectile)
    }

    for (const effect of this.state.hitEffects) {
      this.drawHitEffect(effect)
    }

    for (const text of this.state.floatingText) {
      const alpha = Math.max(0, Math.min(1, text.lifetime))
      this.entities.fillStyle(0x101915, alpha * 0.78)
      this.entities.fillRoundedRect(text.x - 18, text.y - 12, 36, 20, 8)
      this.floatingLabels.push(
        this.add
          .text(text.x, text.y - 2, text.text, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: text.color,
          })
          .setOrigin(0.5)
          .setAlpha(alpha)
          .setDepth(7),
      )
    }
  }

  private drawTower(tower: Tower): void {
    const definition = towerById.get(tower.kind)
    if (!definition) return
    const sprite = TOWER_SPRITES[tower.kind]
    const readyRatio = 1 - Math.min(1, tower.cooldownRemaining / definition.cooldown)

    this.entities.lineStyle(1, definition.color, 0.16 + readyRatio * 0.08)
    this.entities.fillStyle(definition.color, 0.045 + readyRatio * 0.035)
    this.entities.fillCircle(tower.x, tower.y, definition.range)

    this.entities.fillStyle(0x101915, 0.38)
    this.entities.fillEllipse(tower.x, tower.y + 14, 56, 22)
    const towerImage = this.add.image(tower.x, tower.y + sprite.yOffset, sprite.key)
    towerImage.setDepth(6 + tower.y / GAME_HEIGHT)
    towerImage.setDisplaySize(sprite.size * (1 + readyRatio * 0.03), sprite.size * (1 + readyRatio * 0.03))
    this.entityImages.push(towerImage)
  }

  private drawEnemy(enemy: Enemy): void {
    const healthRatio = Math.max(0, enemy.health / enemy.maxHealth)
    const isSlowed = enemy.slowRemaining > 0
    const sprite = ENEMY_SPRITES[enemy.kind]
    const bob = Math.sin(this.elapsedSeconds * enemy.speed * 0.14 + enemy.progress * 0.08) * 2
    const target = PATH[Math.min(enemy.waypointIndex, PATH.length - 1)]

    this.entities.fillStyle(0x101915, 0.32)
    this.entities.fillEllipse(enemy.x, enemy.y + enemy.radius * 0.68, enemy.radius * 2.25, enemy.radius * 0.9)
    this.entities.lineStyle(2, isSlowed ? 0x91e8d4 : 0x341e1d, 0.82)
    if (isSlowed) {
      this.entities.strokeCircle(enemy.x, enemy.y, enemy.radius + 6)
    }

    const enemyImage = this.add.image(enemy.x, enemy.y + bob, sprite.key)
    enemyImage.setDepth(6 + enemy.y / GAME_HEIGHT)
    enemyImage.setDisplaySize(sprite.size, sprite.size)
    if (isSlowed) enemyImage.setTint(0xb9fff3)
    enemyImage.setFlipX(target.x < enemy.x)
    this.entityImages.push(enemyImage)

    this.entities.fillStyle(0x1d1718, 1)
    this.entities.fillRoundedRect(enemy.x - 18, enemy.y - enemy.radius - 12, 36, 5, 3)
    this.entities.fillStyle(healthRatio > 0.45 ? 0x9be36d : 0xffcf5d, 1)
    this.entities.fillRoundedRect(enemy.x - 18, enemy.y - enemy.radius - 12, 36 * healthRatio, 5, 3)
  }

  private drawProjectile(projectile: Projectile): void {
    const fx = PROJECTILE_FX[projectile.kind]
    const target = this.state.enemies.find((enemy) => enemy.id === projectile.targetEnemyId)
    const angle = target ? Math.atan2(target.y - projectile.y, target.x - projectile.x) : 0
    const pulse = 1 + Math.sin(this.elapsedSeconds * 16) * 0.08

    const image = this.add.image(projectile.x, projectile.y, fx.key)
    image.setDepth(8 + projectile.y / GAME_HEIGHT)
    image.setDisplaySize(fx.size * pulse, fx.size * pulse)
    image.setRotation(angle)
    image.setBlendMode(Phaser.BlendModes.ADD)
    this.entityImages.push(image)
  }

  private drawHitEffect(effect: HitEffect): void {
    const fx = IMPACT_FX[effect.kind]
    const progress = 1 - effect.lifetime / effect.maxLifetime
    const size = Math.max(fx.minSize, effect.radius * 2) * (0.72 + progress * 0.34)
    const image = this.add.image(effect.x, effect.y, fx.key)
    image.setDepth(9 + effect.y / GAME_HEIGHT)
    image.setDisplaySize(size, size)
    image.setAlpha(Math.max(0, effect.lifetime / effect.maxLifetime) * 0.86)
    image.setBlendMode(effect.kind === 'thumper' ? Phaser.BlendModes.NORMAL : Phaser.BlendModes.ADD)
    this.entityImages.push(image)
  }
}

function findSpot(x: number, y: number): BuildSpot | undefined {
  return BUILD_SPOTS.find((spot) => Phaser.Math.Distance.Between(x, y, spot.x, spot.y) <= BUILD_HIT_RADIUS)
}

function drawPolyline(graphics: Phaser.GameObjects.Graphics, points: Point[]): void {
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    graphics.lineBetween(previous.x, previous.y, current.x, current.y)
  }
}

type BuildFailureReason = Extract<BuildResult, { ok: false }>['reason']

function messageForBuildFailure(reason: BuildFailureReason): string {
  const messages: Record<BuildFailureReason, string> = {
    occupied: 'That grove already has a tower.',
    'insufficient-gold': 'Not enough gold for that tower.',
    'invalid-spot': 'Build on marked circles only.',
    'invalid-tower': 'Choose a tower first.',
    'not-planning': 'Build between waves.',
  }

  return messages[reason]
}
