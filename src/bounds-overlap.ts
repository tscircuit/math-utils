import type { Bounds } from "./common"

/**
 * Determines if two bounding rectangles overlap
 * @param bounds1 First bounding rectangle
 * @param bounds2 Second bounding rectangle
 * @returns true if the bounds overlap, false otherwise
 */
export const doBoundsOverlap = (bounds1: Bounds, bounds2: Bounds): boolean => {
  return !(
    bounds1.maxX < bounds2.minX ||
    bounds2.maxX < bounds1.minX ||
    bounds1.maxY < bounds2.minY ||
    bounds2.maxY < bounds1.minY
  )
}
