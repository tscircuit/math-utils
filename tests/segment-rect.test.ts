import { describe, expect, test } from "bun:test"
import { doesSegmentIntersectRect } from "../src/line-intersections"

const rect = { minX: 3, minY: 3, maxX: 7, maxY: 7 }

describe("doesSegmentIntersectRect", () => {
  test("segment crosses rectangle", () => {
    const a = { x: 0, y: 5 }
    const b = { x: 10, y: 5 }
    expect(doesSegmentIntersectRect(a, b, rect)).toBe(true)
  })

  test("segment outside rectangle", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 1, y: 1 }
    expect(doesSegmentIntersectRect(a, b, rect)).toBe(false)
  })

  test("segment inside rectangle", () => {
    const a = { x: 4, y: 4 }
    const b = { x: 6, y: 6 }
    expect(doesSegmentIntersectRect(a, b, rect)).toBe(true)
  })

  test("segment touches rectangle corner", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 3, y: 3 }
    expect(doesSegmentIntersectRect(a, b, rect)).toBe(true)
  })

  test("overlapping bounding boxes do not imply segment intersection", () => {
    const a = { x: 0, y: 4 }
    const b = { x: 4, y: 0 }

    expect(doesSegmentIntersectRect(a, b, rect)).toBe(false)
    expect(doesSegmentIntersectRect(b, a, rect)).toBe(false)
  })

  test("vertical segment crosses a non-square rectangle", () => {
    const bounds = { minX: 3, minY: -2, maxX: 7, maxY: 1 }
    const a = { x: 5, y: -3 }
    const b = { x: 5, y: 2 }

    expect(doesSegmentIntersectRect(a, b, bounds)).toBe(true)
    expect(doesSegmentIntersectRect(b, a, bounds)).toBe(true)
  })
})
