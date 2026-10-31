import { expect, test } from "bun:test"
import {
  type Box,
  computeDistanceBetweenBoxes,
  computeGapBetweenBoxes,
  computeManhattanDistanceBetweenBoxes,
  findNearestPointsBetweenBoxSets,
  getBoundingBox,
} from "../src/nearest-box"

test("computeManhattanDistanceBetweenBoxes returns expected distance", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 5, y: 6 }, width: 2, height: 2 }
  const result = computeManhattanDistanceBetweenBoxes(boxA, boxB)
  expect(result.distance).toBeCloseTo(5)
  expect(result.pointA).toEqual({ x: 1, y: 1 })
  expect(result.pointB).toEqual({ x: 4, y: 5 })
})

test("computeManhattanDistanceBetweenBoxes does not inflate distance when centers are offset on overlapping axis", () => {
  const boxA: Box = { center: { x: 0, y: 0 }, width: 2, height: 2 }
  const boxB: Box = { center: { x: 10, y: 0.5 }, width: 2, height: 2 }

  const result = computeManhattanDistanceBetweenBoxes(boxA, boxB)
  const gap = computeGapBetweenBoxes(boxA, boxB)

  expect(result.distance).toBe(8)
  expect(result.distance).toBe(gap)

  const boundsA = getBoundingBox(boxA)
  const boundsB = getBoundingBox(boxB)
  expect(result.pointA.x).toBe(boundsA.maxX)
  expect(result.pointB.x).toBe(boundsB.minX)
  expect(result.pointA.y).toBe(result.pointB.y)
  expect(result.pointA.y).toBeGreaterThanOrEqual(
    Math.max(boundsA.minY, boundsB.minY),
  )
  expect(result.pointA.y).toBeLessThanOrEqual(
    Math.min(boundsA.maxY, boundsB.maxY),
  )
})

test("findNearestPointsBetweenBoxSets picks the true nearest box pair when centers are offset on overlapping axis", () => {
  const setA = [{ center: { x: 0, y: 0 }, width: 2, height: 10 }]
  const closerOffsetBox = { center: { x: 5, y: 4 }, width: 2, height: 2 }
  const slightlyFurtherAlignedBox = {
    center: { x: 5.5, y: 0 },
    width: 2,
    height: 2,
  }

  const result = findNearestPointsBetweenBoxSets(setA, [
    slightlyFurtherAlignedBox,
    closerOffsetBox,
  ])
  expect(result.distance).toBe(3)
  expect(result.pointA.x).toBe(1)
  expect(result.pointB.x).toBe(4)
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
