import { test, expect, describe } from "bun:test"
import { getBoundsFromPoints } from "../src/get-bounds-from-points"
import type { Point, Bounds } from "../src/common"

describe("getBoundsFromPoints", () => {
  test("should return null for empty array", () => {
    expect(getBoundsFromPoints([])).toBe(null)
  })

  test("should return correct bounds for single point", () => {
    const points: Point[] = [{ x: 5, y: 10 }]
    const expected: Bounds = { minX: 5, minY: 10, maxX: 5, maxY: 10 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should return correct bounds for two points", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
    ]
    const expected: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should return correct bounds for multiple points", () => {
    const points: Point[] = [
      { x: 5, y: 5 },
      { x: 15, y: 10 },
      { x: 2, y: 8 },
      { x: 10, y: 20 },
    ]
    const expected: Bounds = { minX: 2, minY: 5, maxX: 15, maxY: 20 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle negative coordinates", () => {
    const points: Point[] = [
      { x: -10, y: -5 },
      { x: 5, y: 10 },
      { x: -3, y: 2 },
    ]
    const expected: Bounds = { minX: -10, minY: -5, maxX: 5, maxY: 10 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle points all having same x coordinate", () => {
    const points: Point[] = [
      { x: 5, y: 0 },
      { x: 5, y: 10 },
      { x: 5, y: -5 },
    ]
    const expected: Bounds = { minX: 5, minY: -5, maxX: 5, maxY: 10 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle points all having same y coordinate", () => {
    const points: Point[] = [
      { x: 0, y: 5 },
      { x: 10, y: 5 },
      { x: -5, y: 5 },
    ]
    const expected: Bounds = { minX: -5, minY: 5, maxX: 10, maxY: 5 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle all points being identical", () => {
    const points: Point[] = [
      { x: 7, y: 3 },
      { x: 7, y: 3 },
      { x: 7, y: 3 },
    ]
    const expected: Bounds = { minX: 7, minY: 3, maxX: 7, maxY: 3 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle floating point coordinates", () => {
    const points: Point[] = [
      { x: 1.5, y: 2.7 },
      { x: 3.2, y: 1.1 },
      { x: 0.5, y: 4.9 },
    ]
    const expected: Bounds = { minX: 0.5, minY: 1.1, maxX: 3.2, maxY: 4.9 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle large number of points", () => {
    const points: Point[] = []
    for (let i = 0; i < 1000; i++) {
      points.push({ x: i, y: i * 2 })
    }
    const expected: Bounds = { minX: 0, minY: 0, maxX: 999, maxY: 1998 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle points forming a rectangle", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 5 },
      { x: 0, y: 5 },
    ]
    const expected: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 5 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })

  test("should handle zero coordinates", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 0, y: 5 },
      { x: 5, y: 0 },
    ]
    const expected: Bounds = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    expect(getBoundsFromPoints(points)).toEqual(expected)
  })
})
