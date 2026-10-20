import { expect, test } from "bun:test"
import {
  getPolygonArea,
  getPolygonCentroid,
  getPolygonPerimeter,
  type Polygon,
} from "../src/polygon"

test("getPolygonArea calculates correct area for simple geometries", () => {
  // Empty and degenerate polygons
  expect(getPolygonArea([])).toBe(0)
  expect(getPolygonArea([{ x: 0, y: 0 }])).toBe(0)
  expect(
    getPolygonArea([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ]),
  ).toBe(0)

  // 10x10 square (area = 100)
  const square: Polygon = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]
  expect(getPolygonArea(square)).toBe(100)

  // Right triangle base=6, height=8 (area = 0.5 * 6 * 8 = 24)
  const triangle: Polygon = [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 0, y: 8 },
  ]
  expect(getPolygonArea(triangle)).toBe(24)

  // Clockwise orientation returns same positive area
  const squareCW: Polygon = [
    { x: 0, y: 0 },
    { x: 0, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 0 },
  ]
  expect(getPolygonArea(squareCW)).toBe(100)
})

test("getPolygonCentroid calculates correct center of mass", () => {
  expect(getPolygonCentroid([])).toBeNull()
  expect(
    getPolygonCentroid([
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ]),
  ).toBeNull()

  // 10x10 square centered from (0,0) to (10,10) -> centroid is (5,5)
  const square: Polygon = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]
  const centroid = getPolygonCentroid(square)
  expect(centroid).not.toBeNull()
  expect(centroid?.x).toBeCloseTo(5)
  expect(centroid?.y).toBeCloseTo(5)

  // Centered rectangle from (-4,-2) to (4,2) -> centroid is (0,0)
  const rect: Polygon = [
    { x: -4, y: -2 },
    { x: 4, y: -2 },
    { x: 4, y: 2 },
    { x: -4, y: 2 },
  ]
  const rectCentroid = getPolygonCentroid(rect)
  expect(rectCentroid?.x).toBeCloseTo(0)
  expect(rectCentroid?.y).toBeCloseTo(0)
})

test("getPolygonPerimeter calculates sum of edge lengths", () => {
  expect(getPolygonPerimeter([])).toBe(0)
  expect(getPolygonPerimeter([{ x: 1, y: 1 }])).toBe(0)

  // 10x10 square -> perimeter = 40
  const square: Polygon = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]
  expect(getPolygonPerimeter(square)).toBeCloseTo(40)

  // 3-4-5 right triangle -> perimeter = 12
  const triangle: Polygon = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 0, y: 4 },
  ]
  expect(getPolygonPerimeter(triangle)).toBeCloseTo(12)
})
