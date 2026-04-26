import type { WaveDefinition } from '../simulation/types'

export const WAVES: WaveDefinition[] = [
  {
    id: 1,
    name: 'Scouts',
    budget: 10,
    interval: 0.88,
    enemies: [{ kind: 'runner', count: 10 }],
    reward: 50,
  },
  {
    id: 2,
    name: 'Barklings',
    budget: 16,
    interval: 0.74,
    enemies: [
      { kind: 'runner', count: 8 },
      { kind: 'brute', count: 4 },
    ],
    reward: 70,
  },
  {
    id: 3,
    name: 'Split Pack',
    budget: 24,
    interval: 0.62,
    enemies: [
      { kind: 'runner', count: 12 },
      { kind: 'skitter', count: 8 },
      { kind: 'brute', count: 4 },
    ],
    reward: 90,
  },
  {
    id: 4,
    name: 'Heavy Grove',
    budget: 34,
    interval: 0.58,
    enemies: [
      { kind: 'brute', count: 10 },
      { kind: 'skitter', count: 10 },
    ],
    reward: 120,
  },
  {
    id: 5,
    name: 'Crystal Break',
    budget: 46,
    interval: 0.5,
    enemies: [
      { kind: 'runner', count: 14 },
      { kind: 'skitter', count: 12 },
      { kind: 'brute', count: 10 },
      { kind: 'warden', count: 2 },
    ],
    reward: 160,
  },
]
