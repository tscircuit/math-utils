import { expect, test } from "bun:test"
import { onSegment } from "../src"

test("rejects off-line points inside a diagonal segment's bounding box", () => {
  for (const [start, end] of [
    [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
    ],
    [
      { x: 4, y: 4 },
      { x: 0, y: 0 },
    ],
    [
      { x: 0, y: 4 },
      { x: 4, y: 0 },
    ],
  ]) {
    expect(onSegment(start, { x: 1, y: 2 }, end)).toBe(false)
  }
})

test("rejects bounding-box corners which are not segment endpoints", () => {
  expect(onSegment({ x: -2, y: -2 }, { x: -2, y: 2 }, { x: 2, y: 2 })).toBe(
    false,
  )
  expect(onSegment({ x: -2, y: -2 }, { x: 2, y: -2 }, { x: 2, y: 2 })).toBe(
    false,
  )
})

test("accepts points and endpoints on diagonal, horizontal, and vertical segments", () => {
  for (const [start, middle, end] of [
    [
      { x: -2, y: -2 },
      { x: 0, y: 0 },
      { x: 2, y: 2 },
    ],
    [
      { x: -2, y: 2 },
      { x: 0, y: 0 },
      { x: 2, y: -2 },
    ],
    [
      { x: -2, y: 3 },
      { x: 0, y: 3 },
      { x: 2, y: 3 },
    ],
    [
      { x: 3, y: -2 },
      { x: 3, y: 0 },
      { x: 3, y: 2 },
    ],
  ]) {
    expect(onSegment(start, middle, end)).toBe(true)
    expect(onSegment(end, middle, start)).toBe(true)
    expect(onSegment(start, start, end)).toBe(true)
    expect(onSegment(start, end, end)).toBe(true)
  }
})

test("rejects collinear points beyond the endpoints", () => {
  expect(onSegment({ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 4, y: 4 })).toBe(false)
  expect(onSegment({ x: 0, y: 0 }, { x: -1, y: -1 }, { x: 4, y: 4 })).toBe(
    false,
  )
})

test("a zero-length segment contains only its point", () => {
  expect(onSegment({ x: 2, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 3 })).toBe(true)
  expect(onSegment({ x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 3 })).toBe(false)
})
