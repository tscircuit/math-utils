import { describe, expect, test } from "bun:test"
import { doSegmentsIntersect } from "../src/line-intersections"
import {
  segmentToBoundsMinDistance,
  segmentToBoxMinDistance,
  segmentToCircleMinDistance,
  segmentToSegmentMinDistance,
} from "../src/segment-distance"

describe("segmentToSegmentMinDistance", () => {
  test("separated ButterStick DDR diagonals keep their distance in either direction", () => {
    const a = { x: -5.999999999999999, y: -1.5999999999999996 }
    const b = { x: -1.1764999999999946, y: 3.223500000000005 }
    const u = { x: -6.799999999999999, y: -2.4 }
    const v = { x: -6.358000000000001, y: -1.9580000000000024 }
    const expectedDistance = Math.hypot(a.x - v.x, a.y - v.y)

    for (const [p, q, r, s] of [
      [a, b, u, v],
      [b, a, u, v],
      [a, b, v, u],
      [b, a, v, u],
      [u, v, a, b],
      [v, u, a, b],
      [u, v, b, a],
      [v, u, b, a],
    ]) {
      expect(segmentToSegmentMinDistance(p, q, r, s)).toBeCloseTo(
        expectedDistance,
        12,
      )
      expect(doSegmentsIntersect(p, q, r, s)).toBe(false)
    }
  })

  test("intersecting segments return distance 0", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 10 }
    const u = { x: 0, y: 10 }
    const v = { x: 10, y: 0 }

    expect(segmentToSegmentMinDistance(a, b, u, v)).toBe(0)
  })

  test("parallel segments return correct distance", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 0 }
    const u = { x: 0, y: 5 }
    const v = { x: 10, y: 5 }

    expect(segmentToSegmentMinDistance(a, b, u, v)).toBe(5)
  })

  test("perpendicular segments return correct distance", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 0, y: 10 }
    const u = { x: 5, y: 5 }
    const v = { x: 15, y: 5 }

    expect(segmentToSegmentMinDistance(a, b, u, v)).toBe(5)
  })

  test("handles degenerate case (point to segment)", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 0, y: 0 } // Zero-length segment (a point)
    const u = { x: 3, y: 0 }
    const v = { x: 10, y: 0 }

    expect(segmentToSegmentMinDistance(a, b, u, v)).toBe(3)
  })

  test("closest points are segment endpoints", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 1, y: 0 }
    const u = { x: 3, y: 1 }
    const v = { x: 4, y: 2 }

    // Distance between point (1,0) and (3,1)
    const expectedDistance = Math.sqrt(5)

    expect(segmentToSegmentMinDistance(a, b, u, v)).toBeCloseTo(
      expectedDistance,
    )
  })
})

describe("segmentToBoundsMinDistance", () => {
  test("segment intersects bounds returns distance 0", () => {
    const a = { x: 0, y: 5 }
    const b = { x: 10, y: 5 }
    const bounds = { minX: 5, minY: 0, maxX: 15, maxY: 10 }
    expect(segmentToBoundsMinDistance(a, b, bounds)).toBe(0)
  })

  test("segment inside bounds returns distance 0", () => {
    const a = { x: 6, y: 5 }
    const b = { x: 10, y: 5 }
    const bounds = { minX: 5, minY: 0, maxX: 15, maxY: 10 }
    expect(segmentToBoundsMinDistance(a, b, bounds)).toBe(0)
  })

  test("segment outside bounds returns correct distance", () => {
    const a = { x: 0, y: 15 }
    const b = { x: 10, y: 15 }
    const bounds = { minX: 5, minY: 0, maxX: 15, maxY: 10 }
    expect(segmentToBoundsMinDistance(a, b, bounds)).toBe(5)
  })

  test("segment with one point inside bounds returns distance 0", () => {
    const a = { x: 6, y: 5 }
    const b = { x: 20, y: 5 }
    const bounds = { minX: 5, minY: 0, maxX: 15, maxY: 10 }
    expect(segmentToBoundsMinDistance(a, b, bounds)).toBe(0)
  })
})

describe("segmentToBoxMinDistance", () => {
  test("segment intersects box returns distance 0", () => {
    const a = { x: 0, y: 5 }
    const b = { x: 10, y: 5 }
    const box = { center: { x: 10, y: 5 }, width: 10, height: 10 }
    expect(segmentToBoxMinDistance(a, b, box)).toBe(0)
  })

  test("segment inside box returns distance 0", () => {
    const a = { x: 6, y: 5 }
    const b = { x: 10, y: 5 }
    const box = { center: { x: 10, y: 5 }, width: 10, height: 10 }
    expect(segmentToBoxMinDistance(a, b, box)).toBe(0)
  })

  test("segment outside box returns correct distance", () => {
    const a = { x: 0, y: 15 }
    const b = { x: 10, y: 15 }
    const box = { center: { x: 10, y: 5 }, width: 10, height: 10 }
    expect(segmentToBoxMinDistance(a, b, box)).toBe(5)
  })

  test("segment with one point inside box returns distance 0", () => {
    const a = { x: 6, y: 5 }
    const b = { x: 20, y: 5 }
    const box = { center: { x: 10, y: 5 }, width: 10, height: 10 }
    expect(segmentToBoxMinDistance(a, b, box)).toBe(0)
  })
})

describe("segmentToCircleMinDistance", () => {
  test("segment intersects circle returns distance 0", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 0 }
    const circle = { x: 5, y: 0, radius: 2 }
    expect(segmentToCircleMinDistance(a, b, circle)).toBe(0)
  })

  test("segment outside circle returns correct distance", () => {
    const a = { x: 0, y: 5 }
    const b = { x: 10, y: 5 }
    const circle = { x: 5, y: 0, radius: 2 }
    expect(segmentToCircleMinDistance(a, b, circle)).toBe(3)
  })

  test("segment endpoint inside circle returns distance 0", () => {
    const a = { x: 4, y: 0 }
    const b = { x: 10, y: 0 }
    const circle = { x: 5, y: 0, radius: 2 }
    expect(segmentToCircleMinDistance(a, b, circle)).toBe(0)
  })

  test("handles degenerate case (point to circle)", () => {
    const a = { x: 10, y: 0 }
    const b = { x: 10, y: 0 } // Zero-length segment (a point)
    const circle = { x: 5, y: 0, radius: 2 }
    expect(segmentToCircleMinDistance(a, b, circle)).toBe(3)
  })

  test("closest point is on the segment", () => {
    const a = { x: 0, y: 5 }
    const b = { x: 10, y: 5 }
    const circle = { x: 5, y: 10, radius: 2 }
    expect(segmentToCircleMinDistance(a, b, circle)).toBe(3)
  })
})
