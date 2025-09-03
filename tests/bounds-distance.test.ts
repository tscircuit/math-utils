import { test, expect, describe } from "bun:test"
import { boundsDistance } from "../src/bounds-distance"
import type { Bounds } from "../src/common"

describe("boundsDistance", () => {
  test("should return 0 for overlapping bounds", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    expect(boundsDistance(bounds1, bounds2)).toBe(0)
  })

  test("should return 0 for touching bounds", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 10, minY: 0, maxX: 20, maxY: 10 }
    expect(boundsDistance(bounds1, bounds2)).toBe(0)
  })

  test("should return horizontal distance when separated horizontally", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 10, minY: 0, maxX: 15, maxY: 5 }
    expect(boundsDistance(bounds1, bounds2)).toBe(5)
  })

  test("should return vertical distance when separated vertically", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 0, minY: 10, maxX: 5, maxY: 15 }
    expect(boundsDistance(bounds1, bounds2)).toBe(5)
  })

  test("should return diagonal distance when separated diagonally", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 15, maxY: 15 }
    expect(boundsDistance(bounds1, bounds2)).toBeCloseTo(Math.sqrt(50))
  })
})
