import { describe, expect, test } from "bun:test"
import { coverPolygonWithRects, type Point } from "../src"

const options = { maxBandHeight: 0.6, maxSideOverhang: 0.3 }
const contains = (
  rectangles: ReturnType<typeof coverPolygonWithRects>,
  point: Point,
) =>
  rectangles.some(
    ({ center, width, height }) =>
      Math.abs(center.x - point.x) <= width / 2 + 1e-12 &&
      Math.abs(center.y - point.y) <= height / 2 + 1e-12,
  )

describe("coverPolygonWithRects", () => {
  test("covers a slot thinner than a scanline band and merges tall rectangles", () => {
    for (const height of [0.2, 30]) {
      const points = [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: height },
        { x: 0, y: height },
      ]
      expect(coverPolygonWithRects(points, options)).toEqual([
        { center: { x: 1, y: height / 2 }, width: 2, height },
      ])
    }
  })

  test("covers triangle sides and interior with bounded horizontal overhang", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 2, y: 2 },
    ]
    const rectangles = coverPolygonWithRects(points, options)
    for (let yStep = 0; yStep <= 200; yStep++) {
      const y = yStep / 100
      for (let xStep = 0; xStep <= 20; xStep++) {
        expect(
          contains(rectangles, { x: y + ((4 - 2 * y) * xStep) / 20, y }),
        ).toBe(true)
      }
    }
    for (const rect of rectangles) {
      const top = rect.center.y + rect.height / 2
      const left = rect.center.x - rect.width / 2
      const right = rect.center.x + rect.width / 2
      expect(top - left).toBeLessThanOrEqual(options.maxSideOverhang + 1e-12)
      expect(right - (4 - top)).toBeLessThanOrEqual(
        options.maxSideOverhang + 1e-12,
      )
      expect(rect.height).toBeLessThanOrEqual(options.maxBandHeight)
    }
  })

  test("preserves a narrow concave notch for either winding and a closing vertex", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 2.05, y: 4 },
      { x: 2.05, y: 1 },
      { x: 1.95, y: 1 },
      { x: 1.95, y: 4 },
      { x: 0, y: 4 },
    ]
    const original = structuredClone(points)
    for (const ring of [points, points.toReversed(), [...points, points[0]]]) {
      const rectangles = coverPolygonWithRects(ring, options)
      expect(rectangles).toEqual([
        { center: { x: 2, y: 0.5 }, width: 4, height: 1 },
        { center: { x: 0.975, y: 2.5 }, width: 1.95, height: 3 },
        { center: { x: 3.025, y: 2.5 }, width: 1.9500000000000002, height: 3 },
      ])
      expect(contains(rectangles, { x: 2, y: 3 })).toBe(false)
    }
    expect(points).toEqual(original)
  })

  test("keeps a nonzero band when its midpoint rounds to a vertex height", () => {
    const bottom = 100
    const top = bottom + Number.EPSILON * 64
    const points = [
      { x: 0, y: bottom },
      { x: 2, y: bottom },
      { x: 2, y: top },
      { x: 0, y: top },
    ]
    const rectangles = coverPolygonWithRects(points, options)
    expect(rectangles).toHaveLength(1)
    expect(rectangles[0].height).toBe(top - bottom)
    expect(contains(rectangles, { x: 1, y: top })).toBe(true)
  })

  test("returns no rectangles for empty rings or invalid subdivision lengths", () => {
    expect(coverPolygonWithRects([], options)).toEqual([])
    const triangle = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]
    for (const length of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(
        coverPolygonWithRects(triangle, { ...options, maxBandHeight: length }),
      ).toEqual([])
      expect(
        coverPolygonWithRects(triangle, {
          ...options,
          maxSideOverhang: length,
        }),
      ).toEqual([])
    }
  })
})
