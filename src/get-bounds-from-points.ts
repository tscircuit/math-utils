import type { Bounds, Point } from "./common"

/**
 * Calculates the bounding rectangle from an array of points
 * @param points Array of points to calculate bounds from
 * @returns Bounds object containing minX, minY, maxX, maxY, or null if array is empty
 */
export const getBoundsFromPoints = (points: Point[]): Bounds | null => {
  if (points.length === 0) {
    return null
  }

  let minX = points[0].x
  let minY = points[0].y
  let maxX = points[0].x
  let maxY = points[0].y

  for (let i = 1; i < points.length; i++) {
    const point = points[i]
    if (point.x < minX) minX = point.x
    if (point.y < minY) minY = point.y
    if (point.x > maxX) maxX = point.x
    if (point.y > maxY) maxY = point.y
  }

  return { minX, minY, maxX, maxY }
}
