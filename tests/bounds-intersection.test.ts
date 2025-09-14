import { test, expect, describe } from "bun:test"
import { boundsIntersection } from "../src/bounds-intersection"
import type { Bounds } from "../src/common"

describe("boundsIntersection", () => {
  test("returns overlapping bounds for intersecting rectangles", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    expect(boundsIntersection(bounds1, bounds2)).toEqual({
      minX: 5,
      minY: 5,
      maxX: 10,
      maxY: 10,
    })
  })

  test("returns null for non-overlapping bounds", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 15, maxY: 15 }
    expect(boundsIntersection(bounds1, bounds2)).toBeNull()
  })

  test("returns identical bounds for identical inputs", () => {
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(boundsIntersection(bounds, bounds)).toEqual(bounds)
  })

  test("handles one bound inside another", () => {
    const outer: Bounds = { minX: 0, minY: 0, maxX: 20, maxY: 20 }
    const inner: Bounds = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    expect(boundsIntersection(outer, inner)).toEqual(inner)
  })

  test("handles bounds touching at edge", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 10, minY: 0, maxX: 20, maxY: 10 }
    expect(boundsIntersection(bounds1, bounds2)).toEqual({
      minX: 10,
      minY: 0,
      maxX: 10,
      maxY: 10,
    })
  })

  test("handles bounds touching at corner", () => {
    const bounds1: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 20, maxY: 20 }
    expect(boundsIntersection(bounds1, bounds2)).toEqual({
      minX: 10,
      minY: 10,
      maxX: 10,
      maxY: 10,
    })
  })

  test("handles negative coordinates", () => {
    const bounds1: Bounds = { minX: -10, minY: -10, maxX: 0, maxY: 0 }
    const bounds2: Bounds = { minX: -5, minY: -5, maxX: 5, maxY: 5 }
    expect(boundsIntersection(bounds1, bounds2)).toEqual({
      minX: -5,
      minY: -5,
      maxX: 0,
      maxY: 0,
    })
  })

  test("returns null for separate zero-area bounds", () => {
    const bounds1: Bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 10, minY: 10, maxX: 10, maxY: 10 }
    expect(boundsIntersection(bounds1, bounds2)).toBeNull()
  })

  test("returns point for overlapping zero-area bound", () => {
    const bounds1: Bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    const bounds2: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(boundsIntersection(bounds1, bounds2)).toEqual(bounds1)
  })
})
