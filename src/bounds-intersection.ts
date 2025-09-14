import type { Bounds } from "./common"

/**
 * Calculates the overlapping bounds of two rectangles
 * @param bounds1 First bounding rectangle
 * @param bounds2 Second bounding rectangle
 * @returns The overlapping bounds or null if there is no overlap
 */
export const boundsIntersection = (
  bounds1: Bounds,
  bounds2: Bounds,
): Bounds | null => {
  const minX = Math.max(bounds1.minX, bounds2.minX)
  const minY = Math.max(bounds1.minY, bounds2.minY)
  const maxX = Math.min(bounds1.maxX, bounds2.maxX)
  const maxY = Math.min(bounds1.maxY, bounds2.maxY)

  if (minX > maxX || minY > maxY) {
    return null
  }

  return { minX, minY, maxX, maxY }
}
