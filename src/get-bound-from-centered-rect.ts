import type { Bounds, Point } from "./common"

/**
 * Calculates the bounds of a rectangle given its center point, width, and height.
 * @param params Object containing center point (x, y), width, and height of the rectangle
 * @returns Bounds object containing minX, minY, maxX, maxY
 */
export const getBoundFromCenteredRect = (params: {
  center: Point
  width: number
  height: number
}): Bounds => {
  const { center, width, height } = params
  const halfWidth = width / 2
  const halfHeight = height / 2

  return {
    minX: center.x - halfWidth,
    maxX: center.x + halfWidth,
    minY: center.y - halfHeight,
    maxY: center.y + halfHeight,
  }
}
