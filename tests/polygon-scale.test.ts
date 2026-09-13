import { describe, expect, test } from "bun:test"
import {
  type Point,
  areBoundsOverlappingPolygon,
  isPointInsidePolygon,
  isRectOverlappingPolygon,
} from "../src"

for (const size of [1e-9, 1e-5, 1, 1e9]) {
  describe(`polygon containment at scale ${size}`, () => {
    const square: Point[] = [
      { x: 0, y: 0 },
      { x: size, y: 0 },
      { x: size, y: size },
      { x: 0, y: size },
    ]

    test("distinguishes exterior points from interior and boundary points", () => {
      for (const polygon of [square, [...square].reverse()]) {
        expect(isPointInsidePolygon({ x: size / 2, y: -size }, polygon)).toBe(
          false,
        )
        expect(
          isPointInsidePolygon({ x: size / 2, y: size / 2 }, polygon),
        ).toBe(true)
        expect(isPointInsidePolygon({ x: size / 2, y: 0 }, polygon)).toBe(true)
        expect(isPointInsidePolygon({ x: 0, y: 0 }, polygon)).toBe(true)
      }
    })

    test("rejects points outside a diagonal edge within its bounding box", () => {
      const triangle: Point[] = [
        { x: 0, y: 0 },
        { x: size, y: size },
        { x: 0, y: size },
      ]
      expect(
        isPointInsidePolygon({ x: 0.75 * size, y: size / 2 }, triangle),
      ).toBe(false)
      expect(isPointInsidePolygon({ x: size / 2, y: size / 2 }, triangle)).toBe(
        true,
      )
    })

    test("does not overlap a rectangle separated from the polygon", () => {
      expect(
        areBoundsOverlappingPolygon(
          {
            minX: size / 4,
            maxX: (3 * size) / 4,
            minY: -size,
            maxY: -size / 2,
          },
          square,
        ),
      ).toBe(false)
      expect(
        isRectOverlappingPolygon(
          {
            center: { x: size / 2, y: (-3 * size) / 4 },
            width: size / 2,
            height: size / 2,
          },
          square,
        ),
      ).toBe(false)
    })
  })
}

test("includes a decimal midpoint despite floating point roundoff", () => {
  for (const thirdPoint of [
    { x: 0.1, y: 0.7 },
    { x: 0.9, y: 0.2 },
  ]) {
    expect(
      isPointInsidePolygon({ x: 0.5, y: 0.45 }, [
        { x: 0.1, y: 0.2 },
        { x: 0.9, y: 0.7 },
        thirdPoint,
      ]),
    ).toBe(true)
  }
})

test("does not widen the boundary tolerance for a long edge", () => {
  expect(
    isPointInsidePolygon({ x: 5e8, y: -0.5 }, [
      { x: 0, y: 0 },
      { x: 1e9, y: 0 },
      { x: 1e9, y: 1e9 },
      { x: 0, y: 1e9 },
    ]),
  ).toBe(false)
})

test("includes an interpolated midpoint on a shallow decimal edge", () => {
  const start = { x: 0, y: 0.1 }
  const end = { x: 1, y: start.y + 0.0001 }
  const midpoint = {
    x: start.x + (end.x - start.x) / 2,
    y: start.y + (end.y - start.y) / 2,
  }
  for (const thirdPoint of [
    { x: 0, y: 1.1 },
    { x: 0, y: -0.9 },
  ]) {
    expect(isPointInsidePolygon(midpoint, [start, end, thirdPoint])).toBe(true)
  }
})

test("includes the midpoint of a short edge translated away from the origin", () => {
  const start = { x: 1000, y: 1000 }
  const end = { x: start.x + 1e-5, y: start.y + 1e-6 }
  const midpoint = {
    x: start.x + (end.x - start.x) / 2,
    y: start.y + (end.y - start.y) / 2,
  }
  for (const thirdPoint of [
    { x: 1000, y: 1001 },
    { x: 1000, y: 999 },
  ]) {
    expect(isPointInsidePolygon(midpoint, [start, end, thirdPoint])).toBe(true)
  }
})
