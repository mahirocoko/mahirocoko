import type { BuildSpot, Point } from '../simulation/types'

export const GAME_WIDTH = 1024
export const GAME_HEIGHT = 640
export const TILE = 64

export const PATH: Point[] = [
  { x: 1024, y: 42 },
  { x: 900, y: 62 },
  { x: 784, y: 92 },
  { x: 668, y: 120 },
  { x: 546, y: 122 },
  { x: 418, y: 112 },
  { x: 318, y: 134 },
  { x: 284, y: 188 },
  { x: 318, y: 238 },
  { x: 440, y: 262 },
  { x: 532, y: 292 },
  { x: 556, y: 350 },
  { x: 494, y: 390 },
  { x: 358, y: 392 },
  { x: 246, y: 428 },
  { x: 230, y: 488 },
  { x: 320, y: 536 },
  { x: 472, y: 554 },
  { x: 626, y: 526 },
  { x: 742, y: 474 },
  { x: 824, y: 420 },
  { x: 858, y: 376 },
]

export const BASE_POINT: Point = { x: 858, y: 376 }

export const BUILD_SPOTS: BuildSpot[] = [
  { id: 'upper-rune', x: 512, y: 76 },
  { id: 'moss-rune', x: 386, y: 202 },
  { id: 'bend-guard', x: 516, y: 226 },
  { id: 'low-rune', x: 292, y: 318 },
  { id: 'center-rune', x: 446, y: 334 },
  { id: 'lantern-rune', x: 646, y: 254 },
  { id: 'south-rune', x: 362, y: 452 },
  { id: 'crystal-left', x: 582, y: 434 },
  { id: 'crystal-gate', x: 704, y: 524 },
]
