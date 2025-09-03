import type { Bounds } from "./common"

/**
 * Computes the overlapping area between two bounding rectangles
 * @param bounds1 First bounding rectangle
 * @param bounds2 Second bounding rectangle
 * @returns The area of overlap. Returns 0 if the bounds do not overlap
 */
export const boundsAreaOverlap = (bounds1: Bounds, bounds2: Bounds): number => {
  const overlapX = Math.max(
    0,
    Math.min(bounds1.maxX, bounds2.maxX) - Math.max(bounds1.minX, bounds2.minX),
  )
  const overlapY = Math.max(
    0,
    Math.min(bounds1.maxY, bounds2.maxY) - Math.max(bounds1.minY, bounds2.minY),
  )
  return overlapX * overlapY
}
