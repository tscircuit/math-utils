import type { Point } from "./common"
import {
  distance,
  doSegmentsIntersect,
  pointToSegmentDistance,
} from "./line-intersections"
import { clamp } from "./nearest-box"

/**
 * Returns the minimum distance between two line segments.
 */
export function segmentToSegmentMinDistance(
  a: Point,
  b: Point,
  u: Point,
  v: Point,
): number {
  // Handle degenerate cases: segments of zero length
  if (a.x === b.x && a.y === b.y) {
    return pointToSegmentDistance(a, u, v)
  }
  if (u.x === v.x && u.y === v.y) {
    return pointToSegmentDistance(u, a, b)
  }

  // Check if segments intersect
  if (doSegmentsIntersect(a, b, u, v)) {
    return 0
  }

  // Compute the minimum distance between the segments
  const distances = [
    pointToSegmentDistance(a, u, v),
    pointToSegmentDistance(b, u, v),
    pointToSegmentDistance(u, a, b),
    pointToSegmentDistance(v, a, b),
  ]

  return Math.min(...distances)
}

/**
 * Returns the minimum distance from a line segment to a bounding box.
 */
export function segmentToBoundsMinDistance(
  a: Point,
  b: Point,
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
): number {
  // Check if segment intersects with the bounds
  // Create the four edges of the bounds
  const topLeft = { x: bounds.minX, y: bounds.minY }
  const topRight = { x: bounds.maxX, y: bounds.minY }
  const bottomLeft = { x: bounds.minX, y: bounds.maxY }
  const bottomRight = { x: bounds.maxX, y: bounds.maxY }

  // Check if segment intersects with any of the bounds edges
  if (
    doSegmentsIntersect(a, b, topLeft, topRight) ||
    doSegmentsIntersect(a, b, topRight, bottomRight) ||
    doSegmentsIntersect(a, b, bottomRight, bottomLeft) ||
    doSegmentsIntersect(a, b, bottomLeft, topLeft)
  ) {
    return 0
  }

  // Check if segment is entirely inside the bounds
  if (
    a.x >= bounds.minX &&
    a.x <= bounds.maxX &&
    a.y >= bounds.minY &&
    a.y <= bounds.maxY &&
    b.x >= bounds.minX &&
    b.x <= bounds.maxX &&
    b.y >= bounds.minY &&
    b.y <= bounds.maxY
  ) {
    return 0
  }

  // If not intersecting, calculate the minimum distance
  const distances = [
    pointToSegmentDistance(topLeft, a, b),
    pointToSegmentDistance(topRight, a, b),
    pointToSegmentDistance(bottomLeft, a, b),
    pointToSegmentDistance(bottomRight, a, b),
  ]

  // If one of the segment endpoints is inside the bounds, we need to consider its distance to the bounds as 0
  if (
    a.x >= bounds.minX &&
    a.x <= bounds.maxX &&
    a.y >= bounds.minY &&
    a.y <= bounds.maxY
  ) {
    return 0
  }

  if (
    b.x >= bounds.minX &&
    b.x <= bounds.maxX &&
    b.y >= bounds.minY &&
    b.y <= bounds.maxY
  ) {
    return 0
  }

  // Calculate distances from segment endpoints to bounds if outside
  if (
    a.x < bounds.minX ||
    a.x > bounds.maxX ||
    a.y < bounds.minY ||
    a.y > bounds.maxY
  ) {
    const closestX = clamp(a.x, bounds.minX, bounds.maxX)
    const closestY = clamp(a.y, bounds.minY, bounds.maxY)
    distances.push(distance(a, { x: closestX, y: closestY }))
  }

  if (
    b.x < bounds.minX ||
    b.x > bounds.maxX ||
    b.y < bounds.minY ||
    b.y > bounds.maxY
  ) {
    const closestX = clamp(b.x, bounds.minX, bounds.maxX)
    const closestY = clamp(b.y, bounds.minY, bounds.maxY)
    distances.push(distance(b, { x: closestX, y: closestY }))
  }

  return Math.min(...distances)
}

/**
 * Returns the minimum distance from a line segment to a box.
 */
export function segmentToBoxMinDistance(
  a: Point,
  b: Point,
  box: { center: Point; width: number; height: number },
): number {
  const halfWidth = box.width / 2
  const halfHeight = box.height / 2
  const bounds = {
    minX: box.center.x - halfWidth,
    maxX: box.center.x + halfWidth,
    minY: box.center.y - halfHeight,
    maxY: box.center.y + halfHeight,
  }

  return segmentToBoundsMinDistance(a, b, bounds)
}
