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

  // On each axis: if the boxes are separated, the closest points sit on the two
  // facing edges; if they overlap on that axis, both points share a coordinate
  // in the overlap so it contributes 0 to the distance.
  const [pax, pbx] = closestCoordsOnAxis(a.minX, a.maxX, b.minX, b.maxX)
  const [pay, pby] = closestCoordsOnAxis(a.minY, a.maxY, b.minY, b.maxY)
  pointA.x = pax
  pointA.y = pay
  pointB.x = pbx
  pointB.y = pby

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

function closestCoordsOnAxis(
  aMin: number,
  aMax: number,
  bMin: number,
  bMax: number,
): [number, number] {
  if (aMax < bMin) return [aMax, bMin]
  if (bMax < aMin) return [aMin, bMax]
  const shared = Math.max(aMin, bMin)
  return [shared, shared]
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
