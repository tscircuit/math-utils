import { expect, test } from "bun:test"
import {
  type Bounds,
  type Box,
  type Point,
  computeDistanceBetweenBoxes,
  computeManhattanDistanceBetweenBoxes,
  findNearestPointsBetweenBoxSets,
} from "../src"

const cases: Array<{
  name: string
  a: Box
  b: Box
  intersection: Bounds
}> = [
  {
    name: "partial overlap",
    a: { center: { x: 0, y: 0 }, width: 4, height: 4 },
    b: { center: { x: 3, y: 1 }, width: 4, height: 4 },
    intersection: { minX: 1, maxX: 2, minY: -1, maxY: 2 },
  },
  {
    name: "contained box with an offset center",
    a: { center: { x: 0, y: 0 }, width: 8, height: 6 },
    b: { center: { x: 1, y: 0.5 }, width: 2, height: 1 },
    intersection: { minX: 0, maxX: 2, minY: 0, maxY: 1 },
  },
  {
    name: "shared vertical edge",
    a: { center: { x: 0, y: 0 }, width: 2, height: 2 },
    b: { center: { x: 2, y: 0.5 }, width: 2, height: 2 },
    intersection: { minX: 1, maxX: 1, minY: -0.5, maxY: 1 },
  },
  {
    name: "shared horizontal edge",
    a: { center: { x: 0, y: 0 }, width: 2, height: 2 },
    b: { center: { x: 0.5, y: 2 }, width: 2, height: 2 },
    intersection: { minX: -0.5, maxX: 1, minY: 1, maxY: 1 },
  },
  {
    name: "shared corner",
    a: { center: { x: 0, y: 0 }, width: 2, height: 2 },
    b: { center: { x: 2, y: 2 }, width: 2, height: 2 },
    intersection: { minX: 1, maxX: 1, minY: 1, maxY: 1 },
  },
  {
    name: "identical boxes",
    a: { center: { x: 1, y: -1 }, width: 4, height: 2 },
    b: { center: { x: 1, y: -1 }, width: 4, height: 2 },
    intersection: { minX: -1, maxX: 3, minY: -2, maxY: 0 },
  },
]

const expectInside = (point: Point, bounds: Bounds) => {
  expect(point.x).toBeGreaterThanOrEqual(bounds.minX)
  expect(point.x).toBeLessThanOrEqual(bounds.maxX)
  expect(point.y).toBeGreaterThanOrEqual(bounds.minY)
  expect(point.y).toBeLessThanOrEqual(bounds.maxY)
}

for (const { name, a, b, intersection } of cases) {
  test(`nearest points coincide in the intersection for ${name}`, () => {
    for (const { scale, x, y } of [
      { scale: 1, x: 0, y: 0 },
      { scale: 1, x: 7, y: -5 },
      { scale: 0.25, x: -3, y: 2 },
    ]) {
      const transform = (box: Box): Box =>
        Object.freeze({
          center: Object.freeze({
            x: box.center.x * scale + x,
            y: box.center.y * scale + y,
          }),
          width: box.width * scale,
          height: box.height * scale,
        })
      const first = transform(a)
      const second = transform(b)
      // These fixture intersections are hand-derived, not computed by the API.
      const expectedIntersection = {
        minX: intersection.minX * scale + x,
        maxX: intersection.maxX * scale + x,
        minY: intersection.minY * scale + y,
        maxY: intersection.maxY * scale + y,
      }

      for (const [boxA, boxB] of [
        [first, second],
        [second, first],
      ]) {
        for (const result of [
          computeManhattanDistanceBetweenBoxes(boxA, boxB),
          computeDistanceBetweenBoxes(boxA, boxB),
          findNearestPointsBetweenBoxSets([boxA], [boxB]),
        ]) {
          expect(result.distance).toBe(0)
          expectInside(result.pointA, expectedIntersection)
          expectInside(result.pointB, expectedIntersection)
          const dx = result.pointA.x - result.pointB.x
          const dy = result.pointA.y - result.pointB.y
          expect(Math.abs(dx) + Math.abs(dy)).toBe(0)
          expect(Math.hypot(dx, dy)).toBe(0)
        }
      }
    }
  })
}
