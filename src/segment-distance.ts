import type { Point } from "./common"
import {
  distance,
  doSegmentsIntersect,
  pointToSegmentDistance,
} from "./line-intersections"
import { clamp } from "./nearest-box"

/**
 * Squared gap below which two segments are treated as possibly touching, so
 * the exact intersection predicate decides whether the distance is exactly 0.
 * (1e-9mm)^2 - far below any PCB feature size.
 */
const TOUCHING_GAP_SQ = 1e-18

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

  // Closest points between two segments by clamped parametric solve
  // (Ericson, Real-Time Collision Detection 5.1.9). One sqrt and no
  // intersection predicate, versus four point-to-segment distances (four
  // sqrts) plus four orientation tests in the previous formulation.
  const d1x = b.x - a.x
  const d1y = b.y - a.y
  const d2x = v.x - u.x
  const d2y = v.y - u.y
  const rx = a.x - u.x
  const ry = a.y - u.y

  const segment1LengthSq = d1x * d1x + d1y * d1y
  const segment2LengthSq = d2x * d2x + d2y * d2y
  const f = d2x * rx + d2y * ry
  const c = d1x * rx + d1y * ry
  const dot12 = d1x * d2x + d1y * d2y

  let s: number
  let t: number
  const denom = segment1LengthSq * segment2LengthSq - dot12 * dot12
  if (denom !== 0) {
    s = clamp((dot12 * f - c * segment2LengthSq) / denom, 0, 1)
  } else {
    // parallel or colinear: any point on segment 1 is as good a starting guess
    s = 0
  }

  t = (dot12 * s + f) / segment2LengthSq
  if (t < 0) {
    t = 0
    s = clamp(-c / segment1LengthSq, 0, 1)
  } else if (t > 1) {
    t = 1
    s = clamp((dot12 - c) / segment1LengthSq, 0, 1)
  }

  const dx = a.x + d1x * s - (u.x + d2x * t)
  const dy = a.y + d1y * s - (u.y + d2y * t)
  const gapSq = dx * dx + dy * dy

  // Preserve the exact-zero contract for genuinely intersecting segments:
  // the parametric solve lands within rounding dust of zero there, and
  // callers may compare against 0. The predicate only runs in that rare case.
  if (gapSq <= TOUCHING_GAP_SQ) {
    return doSegmentsIntersect(a, b, u, v) ? 0 : Math.sqrt(gapSq)
  }

  return Math.sqrt(gapSq)
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

/**
 * Returns the minimum distance from a line segment to a circle.
 */
export function segmentToCircleMinDistance(
  a: Point,
  b: Point,
  circle: { x: number; y: number; radius: number },
): number {
  // Calculate the distance from the circle center to the line segment
  const circleCenter = { x: circle.x, y: circle.y }

  // Handle degenerate case: segment of zero length (point to circle)
  if (a.x === b.x && a.y === b.y) {
    return Math.max(0, distance(a, circleCenter) - circle.radius)
  }

  // Vector from a to b
  const ab = { x: b.x - a.x, y: b.y - a.y }
  // Vector from a to circle center
  const ac = { x: circleCenter.x - a.x, y: circleCenter.y - a.y }

  // Length of segment ab squared
  const abLengthSq = ab.x * ab.x + ab.y * ab.y

  // Calculate projection of ac onto ab, normalized by the length of ab
  const t = Math.max(0, Math.min(1, (ab.x * ac.x + ab.y * ac.y) / abLengthSq))

  // Find the closest point on the segment to the circle center
  const closestPoint = {
    x: a.x + t * ab.x,
    y: a.y + t * ab.y,
  }

  // Calculate distance from closest point to circle center
  const distToCenter = distance(closestPoint, circleCenter)

  // Return the distance to the circle (subtract radius from distance to center)
  return Math.max(0, distToCenter - circle.radius)
}

export function pointToSegmentClosestPoint(
  p: Point,
  a: Point,
  b: Point,
): Point {
  const dx_ab = b.x - a.x
  const dy_ab = b.y - a.y
  const l2 = dx_ab * dx_ab + dy_ab * dy_ab

  if (l2 === 0) return { x: a.x, y: a.y } // Segment is a point

  // Project p onto the line defined by a, b
  // t = [(p - a) . (b - a)] / |b - a|^2
  let t = ((p.x - a.x) * dx_ab + (p.y - a.y) * dy_ab) / l2

  // Clamp t to the range [0, 1] to stay on the segment
  t = Math.max(0, Math.min(1, t))

  // Calculate the projection point
  const closestPoint = {
    x: a.x + t * dx_ab,
    y: a.y + t * dy_ab,
  }

  return closestPoint
}
