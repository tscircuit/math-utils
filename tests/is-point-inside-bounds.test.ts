import { describe, expect, test } from "bun:test"
import type { Bounds, Point } from "../src/common"
import { isPointInsideBounds } from "../src/polygon"

describe("isPointInsideBounds", () => {
  test("should return true for point inside bounds", () => {
    const point: Point = { x: 5, y: 5 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point on left edge", () => {
    const point: Point = { x: 0, y: 5 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point on right edge", () => {
    const point: Point = { x: 10, y: 5 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point on top edge", () => {
    const point: Point = { x: 5, y: 0 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point on bottom edge", () => {
    const point: Point = { x: 5, y: 10 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point at top-left corner", () => {
    const point: Point = { x: 0, y: 0 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point at top-right corner", () => {
    const point: Point = { x: 10, y: 0 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point at bottom-left corner", () => {
    const point: Point = { x: 0, y: 10 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return true for point at bottom-right corner", () => {
    const point: Point = { x: 10, y: 10 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return false for point left of bounds", () => {
    const point: Point = { x: -1, y: 5 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(false)
  })

  test("should return false for point right of bounds", () => {
    const point: Point = { x: 11, y: 5 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(false)
  })

  test("should return false for point above bounds", () => {
    const point: Point = { x: 5, y: -1 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(false)
  })

  test("should return false for point below bounds", () => {
    const point: Point = { x: 5, y: 11 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(false)
  })

  test("should return false for point diagonally outside bounds", () => {
    const point: Point = { x: -1, y: -1 }
    const bounds: Bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    expect(isPointInsideBounds(point, bounds)).toBe(false)
  })

  test("should handle negative coordinates", () => {
    const point: Point = { x: -5, y: -5 }
    const bounds: Bounds = { minX: -10, minY: -10, maxX: 0, maxY: 0 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should handle zero-area bounds (point bounds)", () => {
    const point: Point = { x: 5, y: 5 }
    const bounds: Bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    expect(isPointInsideBounds(point, bounds)).toBe(true)
  })

  test("should return false for point not in zero-area bounds", () => {
    const point: Point = { x: 4, y: 5 }
    const bounds: Bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    expect(isPointInsideBounds(point, bounds)).toBe(false)
  })
})
