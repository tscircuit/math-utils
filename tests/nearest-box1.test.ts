import { expect, test } from "bun:test"
import {
  findNearestPointsBetweenBoxSets,
  type BoxSet,
} from "../src/nearest-box"

test("findNearestPointsBetweenBoxSets", () => {
  const boxSetA: BoxSet = [
    { center: { x: 1, y: 1 }, width: 2, height: 2 },
    { center: { x: 5, y: 5 }, width: 2, height: 2 },
  ]

  const boxSetB: BoxSet = [
    { center: { x: 5, y: 2 }, width: 2, height: 2 },
    { center: { x: 8, y: 8 }, width: 2, height: 2 },
  ]

  const result = findNearestPointsBetweenBoxSets(boxSetA, boxSetB)

  expect(result.distance).toBeDefined()
  expect(result.pointA).toBeDefined()
  expect(result.pointB).toBeDefined()

  expect(result.pointA.x).toBeGreaterThanOrEqual(0)
  expect(result.pointA.y).toBeGreaterThanOrEqual(0)
  expect(result.pointB.x).toBeGreaterThanOrEqual(0)
  expect(result.pointB.y).toBeGreaterThanOrEqual(0)

  expect(result.distance).toBe(1)
})
