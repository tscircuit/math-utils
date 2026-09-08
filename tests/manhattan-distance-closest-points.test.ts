import { expect, test } from "bun:test"
import {
  type Box,
  computeGapBetweenBoxes,
  computeManhattanDistanceBetweenBoxes,
  getBoundingBox,
} from "../src/nearest-box"

const expectPointInsideBounds = (
  point: { x: number; y: number },
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
) => {
  expect(point.x).toBeGreaterThanOrEqual(bounds.minX - 1e-9)
  expect(point.x).toBeLessThanOrEqual(bounds.maxX + 1e-9)
  expect(point.y).toBeGreaterThanOrEqual(bounds.minY - 1e-9)
  expect(point.y).toBeLessThanOrEqual(bounds.maxY + 1e-9)
}

test("returns exact gap distance when centers are offset on the overlapping axis", () => {
  // Regression for https://github.com/tscircuit/math-utils/issues/35
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 } // [-1,1]x[-1,1]
  const boxB: Box = { center: { x: 10, y: 0.5 }, width: 2, height: 2 } // [9,11]x[-0.5,1.5]

  const result = computeManhattanDistanceBetweenBoxes(boxA, boxB)

  expect(result.distance).toBeCloseTo(8)
  expect(result.distance).toBeCloseTo(computeGapBetweenBoxes(boxA, boxB))
  expectPointInsideBounds(result.pointA, getBoundingBox(boxA))
  expectPointInsideBounds(result.pointB, getBoundingBox(boxB))
})

test("distance matches computeGapBetweenBoxes across separated configurations", () => {
  const configurations: Array<[Box, Box]> = [
    // diagonal separation
    [
      { center: { x: 0, y: 0 }, width: 2, height: 2 },
      { center: { x: 10, y: 10 }, width: 2, height: 2 },
    ],
    // vertical separation, x-overlapping, offset centers
    [
      { center: { x: 0.4, y: 0 }, width: 3, height: 2 },
      { center: { x: -0.6, y: 8 }, width: 2, height: 2 },
    ],
    // touching edges
    [
      { center: { x: 0, y: 0 }, width: 2, height: 2 },
      { center: { x: 2, y: 0.3 }, width: 2, height: 2 },
    ],
    // far apart on x, y-overlapping
    [
      { center: { x: -50, y: 3 }, width: 4, height: 4 },
      { center: { x: 50, y: -2 }, width: 6, height: 6 },
    ],
  ]

  for (const [boxA, boxB] of configurations) {
    const forward = computeManhattanDistanceBetweenBoxes(boxA, boxB)
    const reverse = computeManhattanDistanceBetweenBoxes(boxB, boxA)

    expect(forward.distance).toBeCloseTo(computeGapBetweenBoxes(boxA, boxB))
    expect(forward.distance).toBeCloseTo(reverse.distance)
    expectPointInsideBounds(forward.pointA, getBoundingBox(boxA))
    expectPointInsideBounds(forward.pointB, getBoundingBox(boxB))
  }
})

test("overlapping boxes still return zero distance", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 4, height: 4 }
  const boxB: Box = { center: { x: 1, y: 1 }, width: 4, height: 4 }

  const result = computeManhattanDistanceBetweenBoxes(boxA, boxB)

  expect(result.distance).toBe(0)
})
