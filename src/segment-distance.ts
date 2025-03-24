import type { Point } from "./common"
import {
  distance,
  doSegmentsIntersect,
  pointToSegmentDistance,
} from "./line-intersections"

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
