import { expect, test, describe } from "bun:test"
import { segmentToSegmentMinDistance } from "../src/segment-distance"

describe("segmentToSegmentMinDistance", () => {
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
