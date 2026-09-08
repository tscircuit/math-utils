import type { Bounds, Point } from "./common"
import { average } from "./average"

/**
 * Calculates the center point of a bounds rectangle.
 * @param bounds Bounds object containing minX, minY, maxX, maxY
 * @returns Center point of the bounds
 */
export const getBoundsCenter = (bounds: Bounds): Point => ({
  x: average(bounds.minX, bounds.maxX),
  y: average(bounds.minY, bounds.maxY),
})
