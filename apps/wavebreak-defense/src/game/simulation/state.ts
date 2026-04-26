import { BASE_POINT, BUILD_SPOTS, PATH } from '../content/map'
import { towerById } from '../content/towers'
import { WAVES } from '../content/waves'
import type {
  BuildResult,
  Enemy,
  EnemyDefinition,
  EnemyKind,
  FloatingText,
  GameSnapshot,
  GameState,
  HitEffect,
  Point,
  Projectile,
  Tower,
  TowerKind,
} from './types'

const ENEMIES: Record<EnemyKind, EnemyDefinition> = {
  runner: {
    kind: 'runner',
    health: 42,
    speed: 72,
    reward: 9,
    damage: 1,
    radius: 12,
    color: 0xff746b,
  },
  brute: {
    kind: 'brute',
    health: 112,
    speed: 43,
    reward: 18,
    damage: 2,
    radius: 16,
    color: 0xc85f36,
  },
  skitter: {
    kind: 'skitter',
    health: 34,
    speed: 104,
    reward: 12,
    damage: 1,
    radius: 10,
    color: 0xffb85d,
  },
  warden: {
    kind: 'warden',
    health: 380,
    speed: 34,
    reward: 55,
    damage: 4,
    radius: 21,
    color: 0x8c4778,
  },
}

let nextId = 1

export function createInitialState(): GameState {
  nextId = 1

  return {
    phase: 'planning',
    lives: 20,
    gold: 160,
    waveIndex: 0,
    selectedTower: 'spark',
    towers: [],
    enemies: [],
    projectiles: [],
    hitEffects: [],
    floatingText: [],
    spawnQueue: [],
    spawnTimer: 0,
    waveTimer: 0,
    message: 'Build two or three towers, then send Wave 1.',
  }
}

export function selectTower(state: GameState, kind: TowerKind): void {
  if (towerById.has(kind)) {
    state.selectedTower = kind
  }
}

export function buildTower(state: GameState, spotId: string): BuildResult {
  if (state.phase !== 'planning') return { ok: false, reason: 'not-planning' }

  const spot = BUILD_SPOTS.find((candidate) => candidate.id === spotId)
  if (!spot) return { ok: false, reason: 'invalid-spot' }
  if (state.towers.some((tower) => tower.spotId === spotId)) return { ok: false, reason: 'occupied' }

  const definition = towerById.get(state.selectedTower)
  if (!definition) return { ok: false, reason: 'invalid-tower' }
  if (state.gold < definition.cost) return { ok: false, reason: 'insufficient-gold' }

  const tower: Tower = {
    id: `tower-${nextId++}`,
    kind: definition.id,
    spotId,
    x: spot.x,
    y: spot.y,
    cooldownRemaining: 0,
    kills: 0,
  }

  state.gold -= definition.cost
  state.towers.push(tower)
  state.message = `${definition.shortName} tower placed.`

  return { ok: true, tower }
}

export function startNextWave(state: GameState): void {
  if (state.phase !== 'planning') return

  const wave = WAVES[state.waveIndex]
  if (!wave) {
    state.phase = 'won'
    state.message = 'The crystal is safe.'
    return
  }

  state.phase = 'wave'
  state.spawnTimer = 0
  state.waveTimer = 0
  state.spawnQueue = wave.enemies.map((entry) => ({ ...entry, remaining: entry.count }))
  state.message = `Wave ${wave.id}: ${wave.name}`
}

export function tick(state: GameState, deltaSeconds: number): void {
  if (state.phase !== 'wave') {
    updateFloatingText(state, deltaSeconds)
    return
  }

  state.waveTimer += deltaSeconds
  spawnEnemies(state, deltaSeconds)
  moveEnemies(state, deltaSeconds)
  fireTowers(state, deltaSeconds)
  moveProjectiles(state, deltaSeconds)
  updateFloatingText(state, deltaSeconds)
  finishWaveIfCleared(state)
}

export function getSnapshot(state: GameState): GameSnapshot {
  return {
    phase: state.phase,
    lives: state.lives,
    gold: state.gold,
    waveIndex: state.waveIndex,
    waveCount: WAVES.length,
    selectedTower: state.selectedTower,
    message: state.message,
    enemiesAlive: state.enemies.length,
    enemiesQueued: state.spawnQueue.reduce((total, entry) => total + entry.remaining, 0),
  }
}

function spawnEnemies(state: GameState, deltaSeconds: number): void {
  const wave = WAVES[state.waveIndex]
  const nextGroup = state.spawnQueue.find((entry) => entry.remaining > 0)

  if (!wave || !nextGroup) return

  state.spawnTimer -= deltaSeconds
  if (state.spawnTimer > 0) return

  const definition = ENEMIES[nextGroup.kind]
  const start = PATH[0]

  state.enemies.push({
    id: `enemy-${nextId++}`,
    kind: definition.kind,
    x: start.x,
    y: start.y,
    health: definition.health,
    maxHealth: definition.health,
    speed: definition.speed,
    reward: definition.reward,
    damage: definition.damage,
    radius: definition.radius,
    color: definition.color,
    waypointIndex: 1,
    progress: 0,
    slowRemaining: 0,
    slowMultiplier: 1,
  })

  nextGroup.remaining -= 1
  state.spawnTimer = wave.interval
}

function moveEnemies(state: GameState, deltaSeconds: number): void {
  for (const enemy of state.enemies) {
    if (enemy.slowRemaining > 0) {
      enemy.slowRemaining -= deltaSeconds
    } else {
      enemy.slowMultiplier = 1
    }

    let remainingDistance = enemy.speed * enemy.slowMultiplier * deltaSeconds

    while (remainingDistance > 0 && enemy.waypointIndex < PATH.length) {
      const target = PATH[enemy.waypointIndex]
      const distanceToTarget = distance(enemy, target)

      if (distanceToTarget <= remainingDistance) {
        enemy.x = target.x
        enemy.y = target.y
        enemy.waypointIndex += 1
        enemy.progress += distanceToTarget
        remainingDistance -= distanceToTarget
      } else {
        const angle = Math.atan2(target.y - enemy.y, target.x - enemy.x)
        enemy.x += Math.cos(angle) * remainingDistance
        enemy.y += Math.sin(angle) * remainingDistance
        enemy.progress += remainingDistance
        remainingDistance = 0
      }
    }
  }

  const reachedBase = state.enemies.filter((enemy) => enemy.waypointIndex >= PATH.length)
  if (reachedBase.length > 0) {
    for (const enemy of reachedBase) {
      state.lives -= enemy.damage
      addFloatingText(state, BASE_POINT.x, BASE_POINT.y, `-${enemy.damage}`, '#ff746b')
    }

    state.enemies = state.enemies.filter((enemy) => enemy.waypointIndex < PATH.length)
    state.message = 'Enemies reached the crystal.'

    if (state.lives <= 0) {
      state.lives = 0
      state.phase = 'lost'
      state.message = 'The crystal fell. Restart and adjust the tower mix.'
    }
  }
}

function fireTowers(state: GameState, deltaSeconds: number): void {
  for (const tower of state.towers) {
    const definition = towerById.get(tower.kind)
    if (!definition) continue

    tower.cooldownRemaining = Math.max(0, tower.cooldownRemaining - deltaSeconds)
    if (tower.cooldownRemaining > 0) continue

    const target = findTarget(state, tower, definition.range)
    if (!target) continue

    state.projectiles.push({
      id: `projectile-${nextId++}`,
      sourceTowerId: tower.id,
      targetEnemyId: target.id,
      kind: tower.kind,
      x: tower.x,
      y: tower.y,
      speed: definition.projectileSpeed,
      damage: definition.damage,
      color: definition.color,
      splashRadius: definition.splashRadius,
      slowAmount: definition.slowAmount,
      slowDuration: definition.slowDuration,
    })

    tower.cooldownRemaining = definition.cooldown
  }
}

function moveProjectiles(state: GameState, deltaSeconds: number): void {
  const activeProjectiles: Projectile[] = []

  for (const projectile of state.projectiles) {
    const target = state.enemies.find((enemy) => enemy.id === projectile.targetEnemyId)
    if (!target) continue

    const travel = projectile.speed * deltaSeconds
    const distanceToTarget = distance(projectile, target)

    if (distanceToTarget <= travel + target.radius) {
      applyHit(state, projectile, target)
      addHitEffect(state, projectile, target)
      continue
    }

    const angle = Math.atan2(target.y - projectile.y, target.x - projectile.x)
    projectile.x += Math.cos(angle) * travel
    projectile.y += Math.sin(angle) * travel
    activeProjectiles.push(projectile)
  }

  state.projectiles = activeProjectiles
}

function applyHit(state: GameState, projectile: Projectile, target: Enemy): void {
  const splashRadius = projectile.splashRadius
  const targets = splashRadius
    ? state.enemies.filter((enemy) => distance(enemy, target) <= splashRadius)
    : [target]

  for (const enemy of targets) {
    enemy.health -= projectile.damage

    if (projectile.slowAmount && projectile.slowDuration) {
      enemy.slowMultiplier = Math.min(enemy.slowMultiplier, 1 - projectile.slowAmount)
      enemy.slowRemaining = Math.max(enemy.slowRemaining, projectile.slowDuration)
    }
  }

  const defeated = state.enemies.filter((enemy) => enemy.health <= 0)
  if (defeated.length === 0) return

  for (const enemy of defeated) {
    state.gold += enemy.reward
    addFloatingText(state, enemy.x, enemy.y - 12, `+${enemy.reward}`, '#f3d38a')

    const sourceTower = state.towers.find((tower) => tower.id === projectile.sourceTowerId)
    if (sourceTower) sourceTower.kills += 1
  }

  const defeatedIds = new Set(defeated.map((enemy) => enemy.id))
  state.enemies = state.enemies.filter((enemy) => !defeatedIds.has(enemy.id))
}

function addHitEffect(state: GameState, projectile: Projectile, target: Enemy): HitEffect {
  const effect = {
    id: `hit-${nextId++}`,
    kind: projectile.kind,
    x: target.x,
    y: target.y,
    radius: projectile.splashRadius ?? target.radius + 16,
    lifetime: 0.28,
    maxLifetime: 0.28,
  }

  state.hitEffects.push(effect)
  return effect
}

function finishWaveIfCleared(state: GameState): void {
  const queueEmpty = state.spawnQueue.every((entry) => entry.remaining <= 0)
  if (!queueEmpty || state.enemies.length > 0 || state.projectiles.length > 0) return

  const completedWave = WAVES[state.waveIndex]
  state.gold += completedWave.reward
  state.waveIndex += 1
  state.phase = state.waveIndex >= WAVES.length ? 'won' : 'planning'
  state.message =
    state.phase === 'won'
      ? 'All waves cleared. The crystal holds.'
      : `Wave cleared. +${completedWave.reward} gold. Fortify before the next wave.`
}

function updateFloatingText(state: GameState, deltaSeconds: number): void {
  state.hitEffects = state.hitEffects
    .map((effect) => ({ ...effect, lifetime: effect.lifetime - deltaSeconds }))
    .filter((effect) => effect.lifetime > 0)

  state.floatingText = state.floatingText
    .map((text) => ({ ...text, y: text.y - 18 * deltaSeconds, lifetime: text.lifetime - deltaSeconds }))
    .filter((text) => text.lifetime > 0)
}

function findTarget(state: GameState, tower: Tower, range: number): Enemy | undefined {
  return state.enemies
    .filter((enemy) => distance(tower, enemy) <= range)
    .sort((left, right) => right.progress - left.progress)[0]
}

function addFloatingText(state: GameState, x: number, y: number, text: string, color: string): FloatingText {
  const floatingText = {
    id: `text-${nextId++}`,
    x,
    y,
    text,
    color,
    lifetime: 0.9,
  }

  state.floatingText.push(floatingText)
  return floatingText
}

function distance(left: Point, right: Point): number {
  return Math.hypot(left.x - right.x, left.y - right.y)
}
