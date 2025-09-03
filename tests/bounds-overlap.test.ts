import { test, expect, describe } from "bun:test"
import { doBoundsOverlap } from "../src/bounds-overlap"
import type { Bounds } from "../src/common"

describe("doBoundsOverlap", () => {
  test("should return true for overlapping bounds", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(true)
  })

  test("should return true for identical bounds", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(true)
  })

  test("should return true for bounds touching at edges", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 10, minY: 0, maxX: 20, maxY: 10 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(true)
  })

  test("should return true for bounds touching at corners", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 20, maxY: 20 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(true)
  })

  test("should return false for non-overlapping bounds (separated horizontally)", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 10 }
    const bounds2: Bounds = { minX: 10, minY: 0, maxX: 15, maxY: 10 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(false)
  })

  test("should return false for non-overlapping bounds (separated vertically)", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 5 }
    const bounds2: Bounds = { minX: 0, minY: 10, maxX: 10, maxY: 15 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(false)
  })

  test("should return false for non-overlapping bounds (separated diagonally)", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 15, maxY: 15 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(false)
  })

  test("should handle one bound inside another", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 20, maxY: 20 }
    const bounds2: Bounds = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(true)
  })

  test("should handle negative coordinates", () => {
    const bounds1: Bounds = { minX: -10, minY: -10, maxX: 0, maxY: 0 }
    const bounds2: Bounds = { minX: -5, minY: -5, maxX: 5, maxY: 5 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(true)
  })

  test("should handle zero-area bounds (point)", () => {
    const bounds1: Bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(true)
  })

  test("should handle zero-area bounds not overlapping", () => {
    const bounds1: Bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 10, maxY: 10 }
    expect(doBoundsOverlap(bounds1, bounds2)).toBe(false)
  })
})
