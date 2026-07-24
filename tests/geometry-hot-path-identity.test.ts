import { describe, expect, test } from "bun:test"
import { distance, pointToSegmentDistance } from "../src/line-intersections"
import { segmentToSegmentMinDistance } from "../src/segment-distance"
import { doSegmentsIntersect } from "../src/line-intersections"

type Point = { x: number; y: number }

/**
 * The hot geometry helpers were rewritten to avoid per-call allocations
 * (a projection object, a distances array and a spread call). The arithmetic
 * was deliberately left untouched, so results must be bit-for-bit identical
 * to the previous implementations, which are reproduced here as references.
 */
const referencePointToSegmentDistance = (p: Point, v: Point, w: Point) => {
  const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2
  if (l2 === 0) return distance(p, v)
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
  t = Math.max(0, Math.min(1, t))
  const projection = {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y),
  }
  return distance(p, projection)
}

const referenceSegmentToSegmentMinDistance = (
  a: Point,
  b: Point,
  u: Point,
  v: Point,
) => {
  if (a.x === b.x && a.y === b.y)
    return referencePointToSegmentDistance(a, u, v)
  if (u.x === v.x && u.y === v.y)
    return referencePointToSegmentDistance(u, a, b)
  if (doSegmentsIntersect(a, b, u, v)) return 0
  const distances = [
    referencePointToSegmentDistance(a, u, v),
    referencePointToSegmentDistance(b, u, v),
    referencePointToSegmentDistance(u, a, b),
    referencePointToSegmentDistance(v, a, b),
  ]
  return Math.min(...distances)
}

/** Deterministic PRNG so a failure is reproducible. */
const makeRng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 0x100000000
}

describe("hot geometry helpers stay bit-identical", () => {
  test("pointToSegmentDistance matches the reference on random input", () => {
    const rng = makeRng(20260724)
    for (let i = 0; i < 20000; i++) {
      // mix of PCB-scale coordinates and grid-aligned values that produce
      // exactly colinear / degenerate configurations
      const q = () =>
        i % 3 === 0
          ? Math.round(rng() * 400) / 20
          : (rng() - 0.5) * 40 + rng() * 1e-13
      const p = { x: q(), y: q() }
      const v = { x: q(), y: q() }
      const w = i % 7 === 0 ? { x: v.x, y: v.y } : { x: q(), y: q() }
      const got = pointToSegmentDistance(p, v, w)
      const want = referencePointToSegmentDistance(p, v, w)
      if (!Object.is(got, want)) {
        throw new Error(
          `mismatch at i=${i}: ${got} !== ${want} for ${JSON.stringify({ p, v, w })}`,
        )
      }
    }
    expect(true).toBe(true)
  })

  test("segmentToSegmentMinDistance matches the reference on random input", () => {
    const rng = makeRng(987654321)
    for (let i = 0; i < 20000; i++) {
      const q = () =>
        i % 4 === 0 ? Math.round(rng() * 200) / 10 : (rng() - 0.5) * 30
      const a = { x: q(), y: q() }
      const b = i % 11 === 0 ? { x: a.x, y: a.y } : { x: q(), y: q() }
      const u = { x: q(), y: q() }
      const v = i % 13 === 0 ? { x: u.x, y: u.y } : { x: q(), y: q() }
      const got = segmentToSegmentMinDistance(a, b, u, v)
      const want = referenceSegmentToSegmentMinDistance(a, b, u, v)
      if (!Object.is(got, want)) {
        throw new Error(
          `mismatch at i=${i}: ${got} !== ${want} for ${JSON.stringify({ a, b, u, v })}`,
        )
      }
    }
    expect(true).toBe(true)
  })
})
