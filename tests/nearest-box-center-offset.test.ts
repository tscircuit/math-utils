import { expect, test } from "bun:test"
import {
  type Box,
  computeGapBetweenBoxes,
  computeManhattanDistanceBetweenBoxes,
} from "../src/nearest-box"

// boxA and boxB are 8 apart on x, and their y-ranges overlap, so the true
// minimum distance between them is exactly 8 (a purely horizontal gap).
//
// The closest points are computed by clamping each box's *center* onto the
// other box's bounds, so the y center offset (0 vs 0.5) leaks into the final
// hypot and the distance comes out as ~8.0156 instead of 8 — and the returned
// points are not an actual closest pair. computeGapBetweenBoxes, in the same
// file, correctly returns hypot(dx, dy) = 8 for the same input.
test("computeManhattanDistanceBetweenBoxes ignores the center offset on the overlapping axis", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 10, y: 0.5 }, width: 2, height: 2 }

  const { distance, pointA, pointB } = computeManhattanDistanceBetweenBoxes(
    boxA,
    boxB,
  )

  expect(distance).toBeCloseTo(8)
  // ...and it must agree with the sibling gap helper.
  expect(distance).toBeCloseTo(computeGapBetweenBoxes(boxA, boxB))

  // The returned points are a real closest pair: pointA on box A's right edge,
  // pointB on box B's left edge, sharing a y in the overlapping range.
  expect(pointA.x).toBeCloseTo(1)
  expect(pointB.x).toBeCloseTo(9)
  expect(pointA.y).toBeCloseTo(pointB.y)
  expect(Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y)).toBeCloseTo(
    distance,
  )
})
