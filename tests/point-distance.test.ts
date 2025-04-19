import { describe, expect, test } from "bun:test"
import type { Box } from "../src/nearest-box"
import type { Point, Bounds } from "../src/common"
import {
  pointToBoxDistance,
  pointToBoundsDistance,
} from "../src/point-distance"

describe("pointToBoxDistance", () => {
  const box: Box = { center: { x: 5, y: 5 }, width: 10, height: 10 } // Box from (0,0) to (10,10)

  test("point inside the box returns distance 0", () => {
    const p: Point = { x: 5, y: 5 }
    expect(pointToBoxDistance(p, box)).toBe(0)
  })

  test("point on the edge returns distance 0", () => {
    const p: Point = { x: 0, y: 5 } // Left edge
    expect(pointToBoxDistance(p, box)).toBe(0)
  })

  test("point on the corner returns distance 0", () => {
    const p: Point = { x: 10, y: 10 } // Top-right corner
    expect(pointToBoxDistance(p, box)).toBe(0)
  })

  test("point outside, closest to left edge", () => {
    const p: Point = { x: -2, y: 5 }
    expect(pointToBoxDistance(p, box)).toBe(2)
  })

  test("point outside, closest to top edge", () => {
    const p: Point = { x: 5, y: 12 }
    expect(pointToBoxDistance(p, box)).toBe(2)
  })

  test("point outside, closest to bottom-right corner", () => {
    const p: Point = { x: 12, y: -3 }
    // Closest point on box is (10, 0)
    // Distance = sqrt((12-10)^2 + (-3-0)^2) = sqrt(2^2 + (-3)^2) = sqrt(4 + 9) = sqrt(13)
    expect(pointToBoxDistance(p, box)).toBeCloseTo(Math.sqrt(13))
  })

  test("point outside, closest to top-left corner", () => {
    const p: Point = { x: -1, y: 11 }
    // Closest point on box is (0, 10)
    // Distance = sqrt((-1-0)^2 + (11-10)^2) = sqrt((-1)^2 + 1^2) = sqrt(1 + 1) = sqrt(2)
    expect(pointToBoxDistance(p, box)).toBeCloseTo(Math.sqrt(2))
  })
})

describe("pointToBoundsDistance", () => {
  const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 } // Bounds from (0,0) to (10,10)

  test("point inside the bounds returns distance 0", () => {
    const p: Point = { x: 5, y: 5 }
    expect(pointToBoundsDistance(p, bounds)).toBe(0)
  })

  test("point on the edge returns distance 0", () => {
    const p: Point = { x: 0, y: 5 } // Left edge
    expect(pointToBoundsDistance(p, bounds)).toBe(0)
  })

  test("point on the corner returns distance 0", () => {
    const p: Point = { x: 10, y: 10 } // Top-right corner
    expect(pointToBoundsDistance(p, bounds)).toBe(0)
  })

  test("point outside, closest to left edge", () => {
    const p: Point = { x: -2, y: 5 }
    expect(pointToBoundsDistance(p, bounds)).toBe(2)
  })

  test("point outside, closest to top edge", () => {
    const p: Point = { x: 5, y: 12 }
    expect(pointToBoundsDistance(p, bounds)).toBe(2)
  })

  test("point outside, closest to bottom-right corner", () => {
    const p: Point = { x: 12, y: -3 }
    // Closest point on bounds is (10, 0)
    // Distance = sqrt((12-10)^2 + (-3-0)^2) = sqrt(2^2 + (-3)^2) = sqrt(4 + 9) = sqrt(13)
    expect(pointToBoundsDistance(p, bounds)).toBeCloseTo(Math.sqrt(13))
  })

  test("point outside, closest to top-left corner", () => {
    const p: Point = { x: -1, y: 11 }
    // Closest point on bounds is (0, 10)
    // Distance = sqrt((-1-0)^2 + (11-10)^2) = sqrt((-1)^2 + 1^2) = sqrt(1 + 1) = sqrt(2)
    expect(pointToBoundsDistance(p, bounds)).toBeCloseTo(Math.sqrt(2))
  })
})
