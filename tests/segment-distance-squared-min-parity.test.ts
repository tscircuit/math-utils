import { expect, test } from "bun:test"
import type { Point } from "../src/common"
import { distance, doSegmentsIntersect, pointToSegmentDistance } from "../src/line-intersections"
import { clamp } from "../src/nearest-box"
import { segmentToSegmentMinDistance, segmentToBoundsMinDistance } from "../src/segment-distance"

// Frozen v0.0.36 evaluator: takes each square root before choosing the minimum.
function originalSegmentDistance(
  a: Point,
  b: Point,
  u: Point,
  v: Point,
): number {
  if (a.x === b.x && a.y === b.y) {
    return pointToSegmentDistance(a, u, v)
  }
  if (u.x === v.x && u.y === v.y) {
    return pointToSegmentDistance(u, a, b)
  }

  if (doSegmentsIntersect(a, b, u, v)) {
    return 0
  }

  const distances = [
    pointToSegmentDistance(a, u, v),
    pointToSegmentDistance(b, u, v),
    pointToSegmentDistance(u, a, b),
    pointToSegmentDistance(v, a, b),
  ]

  return Math.min(...distances)
}

function originalBoundsDistance(
  a: Point,
  b: Point,
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
): number {
  const topLeft = { x: bounds.minX, y: bounds.minY }
  const topRight = { x: bounds.maxX, y: bounds.minY }
  const bottomLeft = { x: bounds.minX, y: bounds.maxY }
  const bottomRight = { x: bounds.maxX, y: bounds.maxY }

  if (
    doSegmentsIntersect(a, b, topLeft, topRight) ||
    doSegmentsIntersect(a, b, topRight, bottomRight) ||
    doSegmentsIntersect(a, b, bottomRight, bottomLeft) ||
    doSegmentsIntersect(a, b, bottomLeft, topLeft)
  ) {
    return 0
  }

  if (
    a.x >= bounds.minX &&
    a.x <= bounds.maxX &&
    a.y >= bounds.minY &&
    a.y <= bounds.maxY &&
    b.x >= bounds.minX &&
    b.x <= bounds.maxX &&
    b.y >= bounds.minY &&
    b.y <= bounds.maxY
  ) {
    return 0
  }

  const distances = [
    pointToSegmentDistance(topLeft, a, b),
    pointToSegmentDistance(topRight, a, b),
    pointToSegmentDistance(bottomLeft, a, b),
    pointToSegmentDistance(bottomRight, a, b),
  ]

  if (
    a.x >= bounds.minX &&
    a.x <= bounds.maxX &&
    a.y >= bounds.minY &&
    a.y <= bounds.maxY
  ) {
    return 0
  }

  if (
    b.x >= bounds.minX &&
    b.x <= bounds.maxX &&
    b.y >= bounds.minY &&
    b.y <= bounds.maxY
  ) {
    return 0
  }

  if (
    a.x < bounds.minX ||
    a.x > bounds.maxX ||
    a.y < bounds.minY ||
    a.y > bounds.maxY
  ) {
    const closestX = clamp(a.x, bounds.minX, bounds.maxX)
    const closestY = clamp(a.y, bounds.minY, bounds.maxY)
    distances.push(distance(a, { x: closestX, y: closestY }))
  }

  if (
    b.x < bounds.minX ||
    b.x > bounds.maxX ||
    b.y < bounds.minY ||
    b.y > bounds.maxY
  ) {
    const closestX = clamp(b.x, bounds.minX, bounds.maxX)
    const closestY = clamp(b.y, bounds.minY, bounds.maxY)
    distances.push(distance(b, { x: closestX, y: closestY }))
  }

  return Math.min(...distances)
}


test("fused roots preserve native segment and bounds distances and coordinate reads", () => {
  const edgeCases = [0, -0, Number.MIN_VALUE, -Number.MIN_VALUE, 1e-200, -1e-200,
    1e-150, -1e-150, 0.095, 0.1, 1, -1, 1e9, -1e9, 1e150, -1e150,
    1e308, -1e308, Infinity, -Infinity, NaN]
  let state = 0x895eed
  const random = (): number => {
    state = Math.imul(state, 1664525) + 1013904223 | 0
    return (state >>> 0) / 0x100000000
  }
  const point = (scale: number): Point => ({x: (random() - 0.5) * scale, y: (random() - 0.5) * scale})
  const check = (a: Point, b: Point, u: Point, v: Point): void => {
    expect(Object.is(segmentToSegmentMinDistance(a, b, u, v), originalSegmentDistance(a, b, u, v))).toBe(true)
    const bounds = {minX: Math.min(u.x, v.x), minY: Math.min(u.y, v.y), maxX: Math.max(u.x, v.x), maxY: Math.max(u.y, v.y)}
    expect(Object.is(segmentToBoundsMinDistance(a, b, bounds), originalBoundsDistance(a, b, bounds))).toBe(true)
  }
  for (const scale of [1e-300, 1e-150, 1e-8, 1, 1e9, 1e150, 1e300]) {
    for (let index = 0; index < 200; index++) {
      const a = point(scale), b = point(scale), u = point(scale), v = point(scale)
      check(a, b, u, v)
      check(a, a, u, v)
      check(a, b, u, u)
      check(a, b, {x: a.x, y: b.y}, {x: b.x, y: a.y})
    }
  }
  for (let index = 0; index < 1200; index++) {
    const special = (): Point => ({x: edgeCases[Math.floor(random() * edgeCases.length)]!, y: edgeCases[Math.floor(random() * edgeCases.length)]!})
    check(special(), special(), special(), special())
  }
  // Adjacent floating-point clearance values and legacy cancellation intersections.
  for (const gap of [0.095, 0.095 - Number.EPSILON, 0.095 + Number.EPSILON])
    check({x:0,y:0}, {x:1,y:0}, {x:0,y:gap}, {x:1,y:gap})
  check({x: 1e9, y: 1e9}, {x: 1e9 + 1, y: 1e9 + 1}, {x: 1e9 + 2, y: 1e9 + 2}, {x: 1e9 + 3, y: 1e9 + 3})

  // Coordinates may be getters or coercible objects: preserve their read/coercion sequence.
  for (const coercible of [false, true]) {
    for (const coordinates of [
      [[0,0], [1,0], [0,2], [1,2]],
      [[0,0], [0,0], [2,0], [2,3]],
      [[0,0], [1,1], [0,1], [1,0]],
    ]) {
      const invoke = (original: boolean, boundsMode: boolean): { result: number; reads: string[] } => {
        const reads: string[] = []
        const makePoint = (index: number): Point => Object.defineProperties({}, {
          x: {get: () => {
            reads.push(`${index}.x`)
            const value = coordinates[index]![0]!
            return coercible ? {valueOf: () => {reads.push(`${index}.x.valueOf`); return value}} : value
          }},
          y: {get: () => {
            reads.push(`${index}.y`)
            const value = coordinates[index]![1]!
            return coercible ? {valueOf: () => {reads.push(`${index}.y.valueOf`); return value}} : value
          }},
        }) as Point
        const [a,b,u,v] = [0,1,2,3].map(makePoint)
        const bounds = Object.defineProperties({}, {
          minX: {get: () => {reads.push("bounds.minX"); return 2}},
          minY: {get: () => {reads.push("bounds.minY"); return 2}},
          maxX: {get: () => {reads.push("bounds.maxX"); return 4}},
          maxY: {get: () => {reads.push("bounds.maxY"); return 4}},
        }) as {minX:number; minY:number; maxX:number; maxY:number}
        const result = boundsMode
          ? (original ? originalBoundsDistance : segmentToBoundsMinDistance)(a!, b!, bounds)
          : (original ? originalSegmentDistance : segmentToSegmentMinDistance)(a!, b!, u!, v!)
        return {result, reads}
      }
      for (const boundsMode of [false, true]) {
        const baseline = invoke(true, boundsMode), candidate = invoke(false, boundsMode)
        expect(Object.is(candidate.result, baseline.result)).toBe(true)
        expect(candidate.reads).toEqual(baseline.reads)
      }
    }
  }
})
