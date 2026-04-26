export type TowerKind = 'spark' | 'thumper' | 'frost'
export type EnemyKind = 'runner' | 'brute' | 'skitter' | 'warden'
export type GamePhase = 'planning' | 'wave' | 'won' | 'lost'

export type Point = {
  x: number
  y: number
}

export type BuildSpot = Point & {
  id: string
}

export type TowerDefinition = {
  id: TowerKind
  name: string
  shortName: string
  cost: number
  range: number
  damage: number
  cooldown: number
  projectileSpeed: number
  splashRadius?: number
  slowAmount?: number
  slowDuration?: number
  color: number
  accent: string
  description: string
}

export type EnemyDefinition = {
  kind: EnemyKind
  health: number
  speed: number
  reward: number
  damage: number
  radius: number
  color: number
}

export type WaveDefinition = {
  id: number
  name: string
  budget: number
  interval: number
  enemies: Array<{ kind: EnemyKind; count: number }>
  reward: number
}

export type Tower = {
  id: string
  kind: TowerKind
  spotId: string
  x: number
  y: number
  cooldownRemaining: number
  kills: number
}

export type Enemy = {
  id: string
  kind: EnemyKind
  x: number
  y: number
  health: number
  maxHealth: number
  speed: number
  reward: number
  damage: number
  radius: number
  color: number
  waypointIndex: number
  progress: number
  slowRemaining: number
  slowMultiplier: number
}

export type Projectile = {
  id: string
  sourceTowerId: string
  targetEnemyId: string
  kind: TowerKind
  x: number
  y: number
  speed: number
  damage: number
  color: number
  splashRadius?: number
  slowAmount?: number
  slowDuration?: number
}

export type HitEffect = {
  id: string
  kind: TowerKind
  x: number
  y: number
  radius: number
  lifetime: number
  maxLifetime: number
}

export type FloatingText = {
  id: string
  x: number
  y: number
  text: string
  color: string
  lifetime: number
}

export type SpawnQueueItem = {
  kind: EnemyKind
  remaining: number
}

export type GameState = {
  phase: GamePhase
  lives: number
  gold: number
  waveIndex: number
  selectedTower: TowerKind
  towers: Tower[]
  enemies: Enemy[]
  projectiles: Projectile[]
  hitEffects: HitEffect[]
  floatingText: FloatingText[]
  spawnQueue: SpawnQueueItem[]
  spawnTimer: number
  waveTimer: number
  message: string
}

export type BuildResult =
  | { ok: true; tower: Tower }
  | { ok: false; reason: 'occupied' | 'insufficient-gold' | 'invalid-spot' | 'invalid-tower' | 'not-planning' }

export type GameSnapshot = {
  phase: GamePhase
  lives: number
  gold: number
  waveIndex: number
  waveCount: number
  selectedTower: TowerKind
  message: string
  enemiesAlive: number
  enemiesQueued: number
}
