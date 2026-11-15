import { describe, expect, test } from "bun:test"
import { pointToSegmentClosestPoint, type Point } from "../src"

describe("pointToSegmentClosestPoint", () => {
  const cases = [
    {
      name: "horizontal",
      end: { x: 4, y: 0 },
      queries: [
        { point: { x: 2, y: 3 }, expected: { x: 2, y: 0 } },
        { point: { x: -1, y: 3 }, expected: { x: 0, y: 0 } },
        { point: { x: 5, y: 3 }, expected: { x: 4, y: 0 } },
      ],
    },
    {
      name: "vertical",
      end: { x: 0, y: 4 },
      queries: [
        { point: { x: 3, y: 2 }, expected: { x: 0, y: 2 } },
        { point: { x: 3, y: -1 }, expected: { x: 0, y: 0 } },
        { point: { x: 3, y: 5 }, expected: { x: 0, y: 4 } },
      ],
    },
    {
      name: "diagonal",
      end: { x: 4, y: 4 },
      queries: [
        { point: { x: 2, y: 4 }, expected: { x: 3, y: 3 } },
        { point: { x: -2, y: 0 }, expected: { x: 0, y: 0 } },
        { point: { x: 4, y: 6 }, expected: { x: 4, y: 4 } },
      ],
    },
  ]

  for (const scale of [1, 1e160, 1e-170]) {
    const scaled = (point: Point): Point => ({
      x: point.x * scale,
      y: point.y * scale,
    })
    for (const { name, end, queries } of cases) {
      for (const reversed of [false, true]) {
        test(`${name} at scale ${scale}, reversed=${reversed}`, () => {
          const start = { x: 0, y: 0 }
          const a = scaled(reversed ? end : start)
          const b = scaled(reversed ? start : end)

          for (const { point, expected } of queries) {
            const closest = pointToSegmentClosestPoint(scaled(point), a, b)
            expect(closest.x / scale).toBeCloseTo(expected.x, 12)
            expect(closest.y / scale).toBeCloseTo(expected.y, 12)
          }
        })
      }
    }
  }

  test("preserves a tiny interior projection with a large perpendicular offset", () => {
    expect(
      pointToSegmentClosestPoint(
        { x: 2e-170, y: 1e160 },
        { x: 0, y: 0 },
        { x: 4e-170, y: 0 },
      ),
    ).toEqual({ x: 2e-170, y: 0 })
  })

  test("projects near the largest finite coordinates without overflowing the dot product", () => {
    expect(
      pointToSegmentClosestPoint(
        { x: 9e307, y: 9e307 },
        { x: 0, y: 0 },
        { x: 1e308, y: 1e308 },
      ),
    ).toEqual({ x: 9e307, y: 9e307 })
  })

  test("handles translated segments and clamps to the exact endpoints", () => {
    const a = { x: -4, y: 2 }
    const b = { x: 4, y: 8 }
    expect(pointToSegmentClosestPoint({ x: -3, y: 9 }, a, b)).toEqual({
      x: 0,
      y: 5,
    })
    expect(pointToSegmentClosestPoint({ x: -12, y: -4 }, a, b)).toEqual(a)
    expect(pointToSegmentClosestPoint({ x: 12, y: 14 }, a, b)).toEqual(b)
  })

  test("returns a coincident endpoint for a zero-length segment", () => {
    const endpoint = { x: 2, y: 3 }
    expect(
      pointToSegmentClosestPoint({ x: 4, y: 7 }, endpoint, endpoint),
    ).toEqual(endpoint)
  })
})
