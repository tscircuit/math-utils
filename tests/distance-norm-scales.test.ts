import { expect, test } from "bun:test"
import { boundsDistance, distance, pointToBoundsDistance } from "../src"

for (const scale of [1, 1e200, 1e-200]) {
  test(`point and bounds distances retain a 3-4-5 gap at scale ${scale}`, () => {
    const origin = { x: 0, y: 0 }
    const point = { x: 3 * scale, y: 4 * scale }
    expect(distance(origin, point) / scale).toBeCloseTo(5, 12)
    expect(distance(point, origin) / scale).toBeCloseTo(5, 12)
    const bounds = { minX: -scale, minY: -scale, maxX: 0, maxY: 0 }
    const other = {
      minX: point.x,
      minY: point.y,
      maxX: 6 * scale,
      maxY: 7 * scale,
    }
    expect(boundsDistance(bounds, other) / scale).toBeCloseTo(5, 12)
    expect(boundsDistance(other, bounds) / scale).toBeCloseTo(5, 12)
    expect(pointToBoundsDistance(point, bounds) / scale).toBeCloseTo(5, 12)
  })
}

test("overlap and coincident points still have zero distance", () => {
  expect(distance({ x: 1e200, y: -1e200 }, { x: 1e200, y: -1e200 })).toBe(0)
  const bounds = { minX: 0, minY: 0, maxX: 1e200, maxY: 1e200 }
  expect(boundsDistance(bounds, bounds)).toBe(0)
})
