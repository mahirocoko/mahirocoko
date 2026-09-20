/**
 * Spatial snap station solver.
 *
 * Evaluates projected destination coordinates against spatial anchor points
 * to determine the intended landing dock.
 */

import type { Point2D } from './projection.ts'

export interface SnapStation {
  id: string
  title: string
  subtitle: string
  x: number
  y: number
  shortcutKey: string
  colorAccent: string
}

export const DEFAULT_SNAP_STATIONS: readonly SnapStation[] = [
  {
    id: 'preview-deck',
    title: 'Preview Deck',
    subtitle: 'Top-Left viewport slot',
    x: -260,
    y: -170,
    shortcutKey: '1',
    colorAccent: 'rgba(52, 199, 89, 0.9)', // Apple green
  },
  {
    id: 'stage-anchor',
    title: 'Stage Canvas',
    subtitle: 'Center focal stage',
    x: 0,
    y: 0,
    shortcutKey: '2',
    colorAccent: 'rgba(0, 122, 255, 0.9)', // Apple system blue
  },
  {
    id: 'inspector-dock',
    title: 'Inspector Dock',
    subtitle: 'Top-Right telemetry slot',
    x: 260,
    y: -170,
    shortcutKey: '3',
    colorAccent: 'rgba(255, 149, 0, 0.9)', // Apple orange
  },
  {
    id: 'quick-stash',
    title: 'Quick Stash',
    subtitle: 'Bottom-Left temporary bay',
    x: -260,
    y: 170,
    shortcutKey: '4',
    colorAccent: 'rgba(175, 82, 222, 0.9)', // Apple purple
  },
  {
    id: 'archive-tray',
    title: 'Archive Tray',
    subtitle: 'Bottom-Right persistent tray',
    x: 260,
    y: 170,
    shortcutKey: '5',
    colorAccent: 'rgba(255, 59, 48, 0.9)', // Apple red
  },
]

/**
 * Finds the nearest snap station to the given projected coordinate.
 *
 * @param point Projected or current 2D coordinates
 * @param stations List of available snap stations
 * @returns Nearest SnapStation
 */
export const findNearestSnapStation = (
  point: Point2D,
  stations: readonly SnapStation[] = DEFAULT_SNAP_STATIONS
): SnapStation => {
  if (stations.length === 0) {
    throw new Error('At least one snap station is required')
  }

  let nearest = stations[0]
  let minDistanceSq = Infinity

  for (const station of stations) {
    const dx = station.x - point.x
    const dy = station.y - point.y
    const distanceSq = dx * dx + dy * dy

    if (distanceSq < minDistanceSq) {
      minDistanceSq = distanceSq
      nearest = station
    }
  }

  return nearest
}

/**
 * Calculates euclidean distance between two 2D points.
 */
export const distanceBetween = (a: Point2D, b: Point2D): number => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}
