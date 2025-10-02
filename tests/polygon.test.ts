import { describe, expect, test } from "bun:test"
import {
  areBoundsCompletelyInsidePolygon,
  areBoundsOverlappingPolygon,
  isPointInsidePolygon,
  isRectCompletelyInsidePolygon,
  isRectOverlappingPolygon,
  type Bounds,
  type Point,
  type Rect,
} from "../src"

describe("polygon utilities", () => {
  const square: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]

  const concave: Point[] = [
    { x: 0, y: 0 },
    { x: 8, y: 0 },
    { x: 8, y: 3 },
    { x: 4, y: 3 },
    { x: 4, y: 6 },
    { x: 8, y: 6 },
    { x: 8, y: 9 },
    { x: 0, y: 9 },
  ]

  test("isPointInsidePolygon detects interior and exterior points", () => {
    expect(isPointInsidePolygon({ x: 5, y: 5 }, square)).toBe(true)
    expect(isPointInsidePolygon({ x: -1, y: -1 }, square)).toBe(false)
    expect(isPointInsidePolygon({ x: 0, y: 5 }, square)).toBe(true)
  })

  test("areBoundsOverlappingPolygon returns true when overlap exists", () => {
    const insideBounds: Bounds = { minX: 2, minY: 2, maxX: 4, maxY: 4 }
    const overlappingBounds: Bounds = { minX: 8, minY: 8, maxX: 12, maxY: 12 }
    const outsideBounds: Bounds = { minX: 12, minY: 12, maxX: 15, maxY: 15 }

    expect(areBoundsOverlappingPolygon(insideBounds, square)).toBe(true)
    expect(areBoundsOverlappingPolygon(overlappingBounds, square)).toBe(true)
    expect(areBoundsOverlappingPolygon(outsideBounds, square)).toBe(false)
  })

  test("areBoundsCompletelyInsidePolygon handles concave polygons", () => {
    const insideConcave: Bounds = { minX: 1, minY: 1, maxX: 3, maxY: 2 }
    const crossingConcave: Bounds = { minX: 3, minY: 2, maxX: 5, maxY: 4 }

    expect(areBoundsCompletelyInsidePolygon(insideConcave, concave)).toBe(true)
    expect(areBoundsCompletelyInsidePolygon(crossingConcave, concave)).toBe(
      false,
    )
  })

  test("rect convenience wrappers use x/y/width/height format", () => {
    const rectInside: Rect = { x: 1, y: 1, width: 2, height: 2 }
    const rectCross: Rect = { x: 7, y: 7, width: 4, height: 4 }

    expect(isRectCompletelyInsidePolygon(rectInside, square)).toBe(true)
    expect(isRectOverlappingPolygon(rectInside, square)).toBe(true)
    expect(isRectOverlappingPolygon(rectCross, square)).toBe(true)
    expect(isRectCompletelyInsidePolygon(rectCross, square)).toBe(false)
  })
})
