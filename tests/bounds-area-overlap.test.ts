import { test, expect, describe } from "bun:test"
import { boundsAreaOverlap } from "../src/bounds-area-overlap"
import type { Bounds } from "../src/common"

describe("boundsAreaOverlap", () => {
  test("should return overlapping area for intersecting bounds", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    expect(boundsAreaOverlap(bounds1, bounds2)).toBe(25)
  })

  test("should return zero for non-overlapping bounds", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 15, maxY: 15 }
    expect(boundsAreaOverlap(bounds1, bounds2)).toBe(0)
  })

  test("should return zero for bounds touching at edges", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 10, minY: 0, maxX: 20, maxY: 10 }
    expect(boundsAreaOverlap(bounds1, bounds2)).toBe(0)
  })

  test("should return area of smaller bounds when contained", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 20, maxY: 20 }
    const bounds2: Bounds = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    expect(boundsAreaOverlap(bounds1, bounds2)).toBe(100)
  })

  test("should handle zero-area bounds", () => {
    const bounds1: Bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(boundsAreaOverlap(bounds1, bounds2)).toBe(0)
  })
})
