import { describe, expect, test } from "bun:test"
import type { Point } from "../src/common"
import {
  distance,
  doSegmentsIntersect,
  pointToSegmentDistance,
} from "../src/line-intersections"
import { segmentToSegmentMinDistance } from "../src/segment-distance"

const referencePointToSegmentDistance = (p: Point, v: Point, w: Point) => {
  const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2
  if (l2 === 0) return distance(p, v)

  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
  t = Math.max(0, Math.min(1, t))

  return distance(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y),
  })
}

const referenceSegmentToSegmentMinDistance = (
  a: Point,
  b: Point,
  u: Point,
  v: Point,
) => {
  if (a.x === b.x && a.y === b.y) {
    return referencePointToSegmentDistance(a, u, v)
  }
  if (u.x === v.x && u.y === v.y) {
    return referencePointToSegmentDistance(u, a, b)
  }
  if (doSegmentsIntersect(a, b, u, v)) return 0

  return Math.min(
    ...[
      referencePointToSegmentDistance(a, u, v),
      referencePointToSegmentDistance(b, u, v),
      referencePointToSegmentDistance(u, a, b),
      referencePointToSegmentDistance(v, a, b),
    ],
  )
}

const createRandomNumberGenerator = (initialSeed: number) => {
  let seed = initialSeed
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0x100000000
  }
}

describe("geometry hot paths", () => {
  test("point-to-segment distance remains bit-identical", () => {
    const random = createRandomNumberGenerator(20260724)

    for (let index = 0; index < 20_000; index++) {
      const coordinate = () =>
        index % 3 === 0
          ? Math.round(random() * 400) / 20
          : (random() - 0.5) * 40 + random() * 1e-13
      const point = { x: coordinate(), y: coordinate() }
      const start = { x: coordinate(), y: coordinate() }
      const end =
        index % 7 === 0
          ? { x: start.x, y: start.y }
          : { x: coordinate(), y: coordinate() }

      expect(
        Object.is(
          pointToSegmentDistance(point, start, end),
          referencePointToSegmentDistance(point, start, end),
        ),
      ).toBe(true)
    }
  })

  test("segment-to-segment distance remains bit-identical", () => {
    const random = createRandomNumberGenerator(987654321)

    for (let index = 0; index < 20_000; index++) {
      const coordinate = () =>
        index % 4 === 0
          ? Math.round(random() * 200) / 10
          : (random() - 0.5) * 30
      const a = { x: coordinate(), y: coordinate() }
      const b =
        index % 11 === 0
          ? { x: a.x, y: a.y }
          : { x: coordinate(), y: coordinate() }
      const u = { x: coordinate(), y: coordinate() }
      const v =
        index % 13 === 0
          ? { x: u.x, y: u.y }
          : { x: coordinate(), y: coordinate() }

      expect(
        Object.is(
          segmentToSegmentMinDistance(a, b, u, v),
          referenceSegmentToSegmentMinDistance(a, b, u, v),
        ),
      ).toBe(true)
    }
  })
})
