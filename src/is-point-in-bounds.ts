import type { Bounds, Point } from "./common"

/**
 * Determines if a point is inside or on the boundary of a bounds rectangle
 * @param point The point to check
 * @param bounds The bounding rectangle
 * @returns true if the point is within the bounds, false otherwise
 */
export const isPointInBounds = (point: Point, bounds: Bounds): boolean => {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  )
}
