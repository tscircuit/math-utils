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

test("computeManhattanDistanceBetweenBoxes returns points on the correct boxes", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 5, y: 6 }, width: 2, height: 2 }
  const { pointA, pointB } = computeManhattanDistanceBetweenBoxes(boxA, boxB)

  // pointA must lie on boxA (bounds [-1,1]x[-1,1]) and pointB on boxB
  // (bounds [4,6]x[5,7])
  expect(pointA.x).toBeGreaterThanOrEqual(-1)
  expect(pointA.x).toBeLessThanOrEqual(1)
  expect(pointA.y).toBeGreaterThanOrEqual(-1)
  expect(pointA.y).toBeLessThanOrEqual(1)

  expect(pointB.x).toBeGreaterThanOrEqual(4)
  expect(pointB.x).toBeLessThanOrEqual(6)
  expect(pointB.y).toBeGreaterThanOrEqual(5)
  expect(pointB.y).toBeLessThanOrEqual(7)

  // The closest point on boxA toward boxB is its top-right corner (1,1)
  expect(pointA).toEqual({ x: 1, y: 1 })
  // The closest point on boxB toward boxA is its bottom-left corner (4,5)
  expect(pointB).toEqual({ x: 4, y: 5 })
})

test("computeManhattanDistanceBetweenBoxes returns points on the correct boxes when axis-aligned", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 0, y: 5 }, width: 2, height: 2 }
  const { pointA, pointB, distance } = computeManhattanDistanceBetweenBoxes(
    boxA,
    boxB,
  )

  expect(distance).toBeCloseTo(3)
  // Closest point on boxA toward boxB is on boxA's top edge
  expect(pointA).toEqual({ x: 0, y: 1 })
  // Closest point on boxB toward boxA is on boxB's bottom edge
  expect(pointB).toEqual({ x: 0, y: 4 })
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
