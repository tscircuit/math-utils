import { describe, expect, test } from "bun:test"
import { type Bounds, boundsAreaOverlap } from "../src"

const transpose = (bounds: Bounds): Bounds => ({
  minX: bounds.minY,
  minY: bounds.minX,
  maxX: bounds.maxY,
  maxY: bounds.maxX,
})

describe("boundsAreaOverlap with finite bounds spanning an overflowing axis", () => {
  const extent = 1e308
  const cases: Array<{ name: string; a: Bounds; b: Bounds }> = [
    {
      name: "disjoint bounds",
      a: { minX: -extent, minY: -3, maxX: extent, maxY: -2 },
      b: { minX: -extent, minY: 2, maxX: extent, maxY: 3 },
    },
    {
      name: "edge-touching bounds",
      a: { minX: -extent, minY: -1, maxX: extent, maxY: 0 },
      b: { minX: -extent, minY: 0, maxX: extent, maxY: 1 },
    },
    {
      name: "zero-area bounds",
      a: { minX: -extent, minY: -2, maxX: extent, maxY: -2 },
      b: { minX: -extent, minY: -3, maxX: extent, maxY: -1 },
    },
  ]

  for (const { name, a, b } of cases) {
    test(`returns zero for ${name} in either axis or argument order`, () => {
      expect(boundsAreaOverlap(a, b)).toBe(0)
      expect(boundsAreaOverlap(b, a)).toBe(0)
      expect(boundsAreaOverlap(transpose(a), transpose(b))).toBe(0)
      expect(boundsAreaOverlap(transpose(b), transpose(a))).toBe(0)
    })
  }

  test("preserves positive area at ordinary negative coordinates", () => {
    const a = { minX: -8, minY: -6, maxX: -2, maxY: -1 }
    const b = { minX: -4, minY: -3, maxX: 2, maxY: 1 }

    expect(boundsAreaOverlap(a, b)).toBe(4)
    expect(boundsAreaOverlap(b, a)).toBe(4)
  })

  test("preserves a finite intersection within wide bounds", () => {
    const wide = { minX: -extent, minY: -1, maxX: extent, maxY: 1 }
    const small = { minX: -1, minY: -0.5, maxX: 1, maxY: 0.5 }

    expect(boundsAreaOverlap(wide, small)).toBe(2)
    expect(boundsAreaOverlap(small, wide)).toBe(2)
  })

  test("does not clamp an overflowing positive area to zero", () => {
    const a = { minX: -extent, minY: 0, maxX: extent, maxY: 2 }
    const b = { minX: -extent, minY: 1, maxX: extent, maxY: 3 }

    expect(boundsAreaOverlap(a, b)).toBe(Number.POSITIVE_INFINITY)
    expect(boundsAreaOverlap(b, a)).toBe(Number.POSITIVE_INFINITY)
    expect(boundsAreaOverlap(transpose(a), transpose(b))).toBe(
      Number.POSITIVE_INFINITY,
    )
  })
})
