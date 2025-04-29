import { describe, expect, test } from "bun:test"
import {
  distance,
  doSegmentsIntersect,
  getSegmentIntersection,
  onSegment,
  orientation,
  pointToSegmentDistance,
} from "../src/line-intersections"

describe("getSegmentIntersection", () => {
  test("should return intersection point for intersecting segments", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 10 }
    const u = { x: 0, y: 10 }
    const v = { x: 10, y: 0 }
    const intersection = getSegmentIntersection(a, b, u, v)
    expect(intersection).not.toBeNull()
    expect(intersection?.x).toBeCloseTo(5)
    expect(intersection?.y).toBeCloseTo(5)
  })

  test("should return null for non-intersecting segments", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 1, y: 1 }
    const u = { x: 2, y: 2 }
    const v = { x: 3, y: 3 }
    expect(getSegmentIntersection(a, b, u, v)).toBeNull()
  })

  test("should return null for parallel segments", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 0 }
    const u = { x: 0, y: 5 }
    const v = { x: 10, y: 5 }
    expect(getSegmentIntersection(a, b, u, v)).toBeNull()
  })

  test("should return null for collinear non-overlapping segments", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 5, y: 0 }
    const u = { x: 6, y: 0 }
    const v = { x: 10, y: 0 }
    expect(getSegmentIntersection(a, b, u, v)).toBeNull()
  })

  test("should return null for collinear overlapping segments", () => {
    // Current implementation returns null for collinear cases due to denominator being zero.
    // A specific intersection point isn't well-defined for overlap.
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 0 }
    const u = { x: 5, y: 0 }
    const v = { x: 15, y: 0 }
    expect(getSegmentIntersection(a, b, u, v)).toBeNull()
  })

  test("should return intersection point when intersection is at an endpoint", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 5, y: 5 }
    const u = { x: 5, y: 5 }
    const v = { x: 10, y: 0 }
    const intersection = getSegmentIntersection(a, b, u, v)
    expect(intersection).not.toBeNull()
    expect(intersection?.x).toBeCloseTo(5)
    expect(intersection?.y).toBeCloseTo(5)
  })

  test("should return null when lines intersect but segments do not", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 5, y: 5 } // Segment ends at (5,5)
    const u = { x: 0, y: 10 }
    const v = { x: 10, y: 0 } // Intersects line AB at (5,5)
    // Extend segment AB line: y = x
    // Extend segment UV line: y = -x + 10
    // Intersection: x = -x + 10 => 2x = 10 => x = 5, y = 5
    // But segment AB ends before the intersection point relative to segment UV's parameterization
    // Let's try another case where intersection is clearly outside both segments
    const a2 = { x: 0, y: 0 }
    const b2 = { x: 2, y: 2 }
    const u2 = { x: 0, y: 10 }
    const v2 = { x: 2, y: 8 } // Line: y = -x + 10
    // Intersection of lines y=x and y=-x+10 is (5,5)
    expect(getSegmentIntersection(a2, b2, u2, v2)).toBeNull()
  })

  test("vertical line segment intersection", () => {
    const a = { x: 5, y: 0 }
    const b = { x: 5, y: 10 }
    const u = { x: 0, y: 5 }
    const v = { x: 10, y: 5 }
    const intersection = getSegmentIntersection(a, b, u, v)
    expect(intersection).not.toBeNull()
    expect(intersection?.x).toBeCloseTo(5)
    expect(intersection?.y).toBeCloseTo(5)
  })

  test("horizontal line segment intersection", () => {
    const a = { x: 0, y: 5 }
    const b = { x: 10, y: 5 }
    const u = { x: 5, y: 0 }
    const v = { x: 5, y: 10 }
    const intersection = getSegmentIntersection(a, b, u, v)
    expect(intersection).not.toBeNull()
    expect(intersection?.x).toBeCloseTo(5)
    expect(intersection?.y).toBeCloseTo(5)
  })
})

// Keep existing tests for other functions if this file grows
describe("orientation", () => {
  // Add tests if needed
})
describe("onSegment", () => {
  // Add tests if needed
})
describe("doSegmentsIntersect", () => {
  // Add tests if needed
})
describe("pointToSegmentDistance", () => {
  // Add tests if needed
})
describe("distance", () => {
  // Add tests if needed
})
