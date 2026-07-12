import { expect, test } from "bun:test"
import {
  type Box,
  computeManhattanDistanceBetweenBoxes,
  computeDistanceBetweenBoxes,
} from "../src/nearest-box"

test("computeManhattanDistanceBetweenBoxes returns expected distance", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 5, y: 6 }, width: 2, height: 2 }
  const result = computeManhattanDistanceBetweenBoxes(boxA, boxB)
  expect(result.distance).toBeCloseTo(5)
})

test("computeManhattanDistanceBetweenBoxes does not overestimate when boxes overlap on one axis", () => {
  // A x:[-1,1] y:[-1,1]; B x:[9,11] y:[-0.5,1.5]. The Y ranges overlap, so the
  // distance is purely horizontal (9 - 1 = 8), not inflated by a spurious Y gap.
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 10, y: 0.5 }, width: 2, height: 2 }
  const result = computeManhattanDistanceBetweenBoxes(boxA, boxB)
  expect(result.distance).toBeCloseTo(8)
})

test("computeDistanceBetweenBoxes is a deprecated alias", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 5, y: 6 }, width: 2, height: 2 }
  const oldResult = computeDistanceBetweenBoxes(boxA, boxB)
  const newResult = computeManhattanDistanceBetweenBoxes(boxA, boxB)
  expect(oldResult.distance).toBe(newResult.distance)
  expect(oldResult.pointA).toEqual(newResult.pointA)
  expect(oldResult.pointB).toEqual(newResult.pointB)
})
