import type { TowerDefinition } from '../simulation/types'

export const TOWERS: TowerDefinition[] = [
  {
    id: 'spark',
    name: 'Spark Spire',
    shortName: 'Spark',
    cost: 65,
    range: 154,
    damage: 18,
    cooldown: 0.46,
    projectileSpeed: 540,
    color: 0x28d8ff,
    accent: '#28d8ff',
    description: 'Fast single-target shots for early waves.',
  },
  {
    id: 'thumper',
    name: 'Stone Thumper',
    shortName: 'Stone',
    cost: 95,
    range: 132,
    damage: 45,
    cooldown: 1.08,
    projectileSpeed: 410,
    splashRadius: 54,
    color: 0xd79f4a,
    accent: '#d79f4a',
    description: 'Slow shots with splash damage on packed groups.',
  },
  {
    id: 'frost',
    name: 'Frost Bloom',
    shortName: 'Frost',
    cost: 80,
    range: 142,
    damage: 10,
    cooldown: 0.82,
    projectileSpeed: 460,
    slowAmount: 0.38,
    slowDuration: 1.6,
    color: 0x91e8d4,
    accent: '#91e8d4',
    description: 'Weak damage, strong control against runners.',
  },
]

export const towerById = new Map(TOWERS.map((tower) => [tower.id, tower]))
