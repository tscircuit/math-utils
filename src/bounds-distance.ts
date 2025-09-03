import type { Bounds } from "./common"

/**
 * Computes the minimum distance between two bounding rectangles
 * @param bounds1 First bounding rectangle
 * @param bounds2 Second bounding rectangle
 * @returns The minimum distance. Returns 0 if the bounds overlap or touch
 */
export const boundsDistance = (bounds1: Bounds, bounds2: Bounds): number => {
  const dx =
    bounds1.maxX < bounds2.minX
      ? bounds2.minX - bounds1.maxX
      : bounds2.maxX < bounds1.minX
        ? bounds1.minX - bounds2.maxX
        : 0

  const dy =
    bounds1.maxY < bounds2.minY
      ? bounds2.minY - bounds1.maxY
      : bounds2.maxY < bounds1.minY
        ? bounds1.minY - bounds2.maxY
        : 0

  return Math.sqrt(dx * dx + dy * dy)
}
