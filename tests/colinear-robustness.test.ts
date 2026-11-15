import { describe, expect, test } from "bun:test"
import { doSegmentsIntersect, orientation } from "../src/line-intersections"
import { segmentToSegmentMinDistance } from "../src/segment-distance"

/**
 * Regression coverage for colinear inputs whose cross product degenerates to
 * floating point cancellation dust. Before the tolerance in `orientation`,
 * the dust carried a sign, `doSegmentsIntersect` took its "general case"
 * branch, and disjoint colinear segments were reported as intersecting.
 */
describe("colinear robustness", () => {
  // Captured from a real PCB autoroute (both segments lie exactly on y = x - 19.2,
  // 0.424mm apart). Their cross products evaluate to 0, 3.469e-18, 0, 3.469e-18.
  const a1 = { x: 19.45000000000001, y: 0.25 }
  const a2 = { x: 19.35000000000001, y: 0.15 }
  const b1 = { x: 18.950000000000003, y: -0.25 }
  const b2 = { x: 19.050000000000004, y: -0.15 }

  test("disjoint colinear segments with float dust do not intersect", () => {
    expect(doSegmentsIntersect(a1, a2, b1, b2)).toBe(false)
  })

  test("segmentToSegmentMinDistance reports the real gap, not 0", () => {
    expect(segmentToSegmentMinDistance(a1, a2, b1, b2)).toBeCloseTo(0.4243, 4)
  })

  test("orientation treats cancellation dust as colinear", () => {
    expect(orientation(a1, a2, b1)).toBe(0)
    expect(orientation(a1, a2, b2)).toBe(0)
    expect(orientation(b1, b2, a1)).toBe(0)
    expect(orientation(b1, b2, a2)).toBe(0)
  })

  test("orientation still distinguishes genuine turns", () => {
    expect(orientation({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: -1 })).toBe(1)
    expect(orientation({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 1 })).toBe(2)
    expect(orientation({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 })).toBe(0)
  })

  test("colinear segments that overlap still intersect", () => {
    expect(
      doSegmentsIntersect(
        { x: 0, y: 0 },
        { x: 2, y: 2 },
        { x: 1, y: 1 },
        { x: 3, y: 3 },
      ),
    ).toBe(true)
  })

  test("colinear segments sharing an endpoint still intersect", () => {
    expect(
      doSegmentsIntersect(
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ),
    ).toBe(true)
  })

  test("crossing segments still intersect", () => {
    expect(
      doSegmentsIntersect(
        { x: 0, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
        { x: 2, y: 0 },
      ),
    ).toBe(true)
  })

  test("T junction (endpoint on the interior of the other segment) intersects", () => {
    expect(
      doSegmentsIntersect(
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 2 },
      ),
    ).toBe(true)
  })

  test("parallel non-colinear segments do not intersect", () => {
    expect(
      doSegmentsIntersect(
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 5 },
        { x: 1, y: 6 },
      ),
    ).toBe(false)
  })

  test("shallow but genuine crossing is preserved", () => {
    // ~0.0006 rad crossing: far above the dust threshold, must still intersect
    expect(
      doSegmentsIntersect(
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 0, y: -0.03 },
        { x: 100, y: 0.03 },
      ),
    ).toBe(true)
  })

  test("axis aligned colinear traces separated along their shared line", () => {
    // The common PCB case: two segments of the same net direction on one line
    const gap = segmentToSegmentMinDistance(
      { x: 0, y: 1 },
      { x: 5, y: 1 },
      { x: 8, y: 1 },
      { x: 12, y: 1 },
    )
    expect(gap).toBeCloseTo(3, 10)
  })
})
