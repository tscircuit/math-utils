import type { Point, Bounds } from "./common"
import { distance } from "./line-intersections"
import { clamp } from "./nearest-box"
import type { Box } from "./nearest-box"

/**
 * Returns the minimum distance from a point to a box.
 * If the point is inside the box, the distance is 0.
 */
export function pointToBoxDistance(p: Point, box: Box): number {
  const halfWidth = box.width / 2
  const halfHeight = box.height / 2
  const minX = box.center.x - halfWidth
  const maxX = box.center.x + halfWidth
  const minY = box.center.y - halfHeight
  const maxY = box.center.y + halfHeight

  // Check if the point is inside the box
  if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
    return 0
  }

  // Find the closest point on the box boundary
  const closestX = clamp(p.x, minX, maxX)
  const closestY = clamp(p.y, minY, maxY)

  // Calculate the distance to the closest point
  return distance(p, { x: closestX, y: closestY })
}

/**
 * Returns the minimum distance from a point to a bounds rectangle.
 * If the point is inside the bounds, the distance is 0.
 */
export function pointToBoundsDistance(p: Point, bounds: Bounds): number {
  // Check if the point is inside the bounds
  if (
    p.x >= bounds.minX &&
    p.x <= bounds.maxX &&
    p.y >= bounds.minY &&
    p.y <= bounds.maxY
  ) {
    return 0
  }

  // Find the closest point on the bounds boundary
  const closestX = clamp(p.x, bounds.minX, bounds.maxX)
  const closestY = clamp(p.y, bounds.minY, bounds.maxY)

  // Calculate the distance to the closest point
  return distance(p, { x: closestX, y: closestY })
}

export function midpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}

export function distSq(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return dx * dx + dy * dy
}
