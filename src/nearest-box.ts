import type { Point } from "./common"

export type Box = { center: Point; width: number; height: number }
export type BoxSet = Box[]

export type GridCell = { boxes: Box[] }

export function getBoundingBox(box: Box) {
  const halfWidth = box.width / 2
  const halfHeight = box.height / 2
  return {
    minX: box.center.x - halfWidth,
    maxX: box.center.x + halfWidth,
    minY: box.center.y - halfHeight,
    maxY: box.center.y + halfHeight,
  }
}

export function computeManhattanDistanceBetweenBoxes(
  boxA: Box,
  boxB: Box,
): { distance: number; pointA: Point; pointB: Point } {
  const a = getBoundingBox(boxA)
  const b = getBoundingBox(boxB)

  const dx = Math.max(a.minX - b.maxX, b.minX - a.maxX, 0)
  const dy = Math.max(a.minY - b.maxY, b.minY - a.maxY, 0)

  const pointA: Point = { x: 0, y: 0 }
  const pointB: Point = { x: 0, y: 0 }

  if (dx === 0 && dy === 0) {
    // Boxes overlap
    return { distance: 0, pointA: boxA.center, pointB: boxB.center }
  }

  // Closest point on B to A's center, then closest point on A to that
  // point. pointA must lie on boxA and pointB on boxB.
  pointB.x = clamp(boxA.center.x, b.minX, b.maxX)
  pointB.y = clamp(boxA.center.y, b.minY, b.maxY)

  pointA.x = clamp(pointB.x, a.minX, a.maxX)
  pointA.y = clamp(pointB.y, a.minY, a.maxY)

  const distance = Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y)
  return { distance, pointA, pointB }
}

/**
 * @deprecated Use {@link computeManhattanDistanceBetweenBoxes} instead.
 */
export function computeDistanceBetweenBoxes(
  boxA: Box,
  boxB: Box,
): { distance: number; pointA: Point; pointB: Point } {
  return computeManhattanDistanceBetweenBoxes(boxA, boxB)
}

export function computeGapBetweenBoxes(boxA: Box, boxB: Box): number {
  const a = getBoundingBox(boxA)
  const b = getBoundingBox(boxB)

  const dx = Math.max(a.minX - b.maxX, b.minX - a.maxX, 0)
  const dy = Math.max(a.minY - b.maxY, b.minY - a.maxY, 0)

  const distance = Math.hypot(dx, dy)
  return distance
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function findNearestPointsBetweenBoxSets(
  boxSetA: BoxSet,
  boxSetB: BoxSet,
): { pointA: Point; pointB: Point; distance: number } {
  let minDistance = Number.POSITIVE_INFINITY
  let nearestPointA: Point = { x: 0, y: 0 }
  let nearestPointB: Point = { x: 0, y: 0 }

  for (const boxA of boxSetA) {
    for (const boxB of boxSetB) {
      const { distance, pointA, pointB } = computeManhattanDistanceBetweenBoxes(
        boxA,
        boxB,
      )
      if (distance < minDistance) {
        minDistance = distance
        nearestPointA = pointA
        nearestPointB = pointB
      }
    }
  }

  return {
    pointA: nearestPointA,
    pointB: nearestPointB,
    distance: minDistance,
  }
}
