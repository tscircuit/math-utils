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
})
