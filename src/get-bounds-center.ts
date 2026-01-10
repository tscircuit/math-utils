import type { Bounds, Point } from "./common"

/**
 * Calculates the center point of a bounds rectangle.
 * @param bounds Bounds object containing minX, minY, maxX, maxY
 * @returns Center point of the bounds
 */
export const getBoundsCenter = (bounds: Bounds): Point => ({
  x: (bounds.minX + bounds.maxX) / 2,
  y: (bounds.minY + bounds.maxY) / 2,
})
