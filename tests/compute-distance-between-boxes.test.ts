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

test("computeDistanceBetweenBoxes is a deprecated alias", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 5, y: 6 }, width: 2, height: 2 }
  const oldResult = computeDistanceBetweenBoxes(boxA, boxB)
  const newResult = computeManhattanDistanceBetweenBoxes(boxA, boxB)
  expect(oldResult.distance).toBe(newResult.distance)
  expect(oldResult.pointA).toEqual(newResult.pointA)
  expect(oldResult.pointB).toEqual(newResult.pointB)
})
