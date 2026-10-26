import { describe, expect, test } from "bun:test"
import { type Point, pointToSegmentClosestPoint } from "../src"

describe("closest-point projections across finite coordinate scales", () => {
  for (const scale of [1, 1e160, 1e-170]) {
    for (const reverse of [false, true]) {
      test(`axis-aligned projections and clamps at ${scale}, reverse=${reverse}`, () => {
        for (const vertical of [false, true]) {
          const point = (along: number, across: number): Point =>
            vertical
              ? { x: across * scale, y: along * scale }
              : { x: along * scale, y: across * scale }
          const left = point(-2, 3)
          const right = point(2, 3)
          const a = reverse ? right : left
          const b = reverse ? left : right

          for (const [along, expected] of [
            [0, 0],
            [-5, -2],
            [5, 2],
          ]) {
            const actual = pointToSegmentClosestPoint(point(along, 8), a, b)
            const want = point(expected, 3)
            expect(actual.x / scale).toBeCloseTo(want.x / scale, 12)
            expect(actual.y / scale).toBeCloseTo(want.y / scale, 12)
          }
        }
      })

      test(`diagonal projection at ${scale}, reverse=${reverse}`, () => {
        const a = { x: 0, y: 0 }
        const b = { x: 4 * scale, y: 4 * scale }
        const p = { x: 2 * scale, y: 4 * scale }
        const actual = pointToSegmentClosestPoint(
          p,
          reverse ? b : a,
          reverse ? a : b,
        )
        expect(actual.x / scale).toBeCloseTo(3, 12)
        expect(actual.y / scale).toBeCloseTo(3, 12)
      })
    }
  }

  for (const sign of [1, -1]) {
    for (const reverse of [false, true]) {
      test(`subnormal diagonal endpoint identity, sign=${sign}, reverse=${reverse}`, () => {
        const a = { x: 0, y: 0 }
        const b = { x: Number.MIN_VALUE, y: sign * Number.MIN_VALUE }
        expect(
          pointToSegmentClosestPoint(b, reverse ? b : a, reverse ? a : b),
        ).toEqual(b)
      })

      test(`subnormal diagonal midpoint identity, sign=${sign}, reverse=${reverse}`, () => {
        const a = { x: 0, y: 0 }
        const b = { x: 2 * Number.MIN_VALUE, y: sign * 2 * Number.MIN_VALUE }
        const p = { x: Number.MIN_VALUE, y: sign * Number.MIN_VALUE }
        expect(
          pointToSegmentClosestPoint(p, reverse ? b : a, reverse ? a : b),
        ).toEqual(p)
      })
    }
  }

  test("a tiny segment ignores a large perpendicular displacement", () => {
    const p = { x: 2e-170, y: 1e160 }
    expect(
      pointToSegmentClosestPoint(p, { x: 0, y: 0 }, { x: 4e-170, y: 0 }),
    ).toEqual({ x: 2e-170, y: 0 })
  })

  for (const reverse of [false, true]) {
    for (const sign of [1, -1]) {
      test(`non-diagonal subnormal projection, reverse=${reverse}, sign=${sign}`, () => {
        const q = Number.MIN_VALUE
        const a = { x: 0, y: 0 }
        const b = { x: 2 * q, y: sign * q }
        const p = { x: q, y: sign * q }
        // Exact projection is (6q/5, +/-3q/5); each coordinate rounds to p.
        expect(
          pointToSegmentClosestPoint(p, reverse ? b : a, reverse ? a : b),
        ).toEqual(p)
      })
    }
  }

  test("translated subnormal projection retains the representable result", () => {
    const q = Number.MIN_VALUE
    const a = { x: -q, y: 2 * q }
    const b = { x: q, y: 3 * q }
    const p = { x: 0, y: 3 * q }
    expect(pointToSegmentClosestPoint(p, a, b)).toEqual(p)
    expect(pointToSegmentClosestPoint(p, b, a)).toEqual(p)
  })

  for (const length of [1, 2 ** -1021]) {
    for (const sign of [1, -1]) {
      for (const reverse of [false, true]) {
        test(`subnormal projection on normal segment ${length}, sign=${sign}, reverse=${reverse}`, () => {
          const q = Number.MIN_VALUE
          const p = { x: q, y: sign * q }
          const a = { x: 0, y: 0 }
          const b = { x: 2 * length, y: sign * length }
          expect(
            pointToSegmentClosestPoint(p, reverse ? b : a, reverse ? a : b),
          ).toEqual(p)
        })
      }
    }
  }

  test("tiny axial projections survive reversal despite a large perpendicular offset", () => {
    const q = Number.MIN_VALUE
    for (const vertical of [false, true]) {
      const a = { x: 0, y: 0 }
      const b = vertical ? { x: 0, y: 2 } : { x: 2, y: 0 }
      const p = vertical ? { x: 1e160, y: q } : { x: q, y: 1e160 }
      const want = vertical ? { x: 0, y: q } : { x: q, y: 0 }
      expect(pointToSegmentClosestPoint(p, a, b)).toEqual(want)
      expect(pointToSegmentClosestPoint(p, b, a)).toEqual(want)
    }
  })

  test("an equidistant origin choice is independent of endpoint order", () => {
    const q = Number.MIN_VALUE
    const a = { x: 0, y: 0 }
    const b = { x: q, y: 2 }
    const p = { x: 0, y: 1 }
    const want = { x: 0, y: 1 } // Exact projected x is below q/2 and rounds to zero.
    expect(pointToSegmentClosestPoint(p, a, b)).toEqual(want)
    expect(pointToSegmentClosestPoint(p, b, a)).toEqual(want)
  })

  test("subnormal segment still handles an overflowing perpendicular offset ratio", () => {
    const q = Number.MIN_VALUE
    expect(
      pointToSegmentClosestPoint(
        { x: q, y: 1e308 },
        { x: 0, y: 0 },
        { x: 2 * q, y: 0 },
      ),
    ).toEqual({ x: q, y: 0 })
  })

  test("large diagonal projection does not overflow its dot-product sum", () => {
    const p = { x: 9e307, y: 9e307 }
    expect(
      pointToSegmentClosestPoint(p, { x: 0, y: 0 }, { x: 1e308, y: 1e308 }),
    ).toEqual(p)
  })

  test("negative overflowing dot product clamps to the original endpoint", () => {
    const a = { x: 0, y: 0 }
    expect(
      pointToSegmentClosestPoint({ x: -9e307, y: -9e307 }, a, {
        x: 1e308,
        y: 1e308,
      }),
    ).toEqual(a)
  })

  test("origin selection does not overflow an otherwise finite diagonal projection", () => {
    const along = (1e308 - 9e307) / 2
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const a = { x: 0, y: 0 }
        const b = { x: sx * 1e308, y: sy * 1e308 }
        const p = { x: sx * 1e308, y: sy * -9e307 }
        for (const reverse of [false, true]) {
          const actual = pointToSegmentClosestPoint(
            p,
            reverse ? b : a,
            reverse ? a : b,
          )
          expect(actual.x / along).toBeCloseTo(sx, 12)
          expect(actual.y / along).toBeCloseTo(sy, 12)
        }
      }
    }
  })

  test("a vertical-dominant segment also selects finite query offsets", () => {
    const a = { x: 0, y: 0 }
    const b = { x: 5e307, y: 1e308 }
    const p = { x: -1.4e308, y: 1e308 }
    // Projection onto direction (1,2) is (1.2e307,2.4e307).
    for (const reverse of [false, true]) {
      const actual = pointToSegmentClosestPoint(
        p,
        reverse ? b : a,
        reverse ? a : b,
      )
      expect(actual.x / 1e307).toBeCloseTo(1.2, 12)
      expect(actual.y / 1e307).toBeCloseTo(2.4, 12)
    }
  })

  test("coincident endpoints stay a point and inputs are not mutated", () => {
    const endpoint = Object.freeze({ x: 2, y: -3 })
    const query = Object.freeze({ x: 8, y: 9 })
    expect(pointToSegmentClosestPoint(query, endpoint, endpoint)).toEqual(
      endpoint,
    )
    expect(query).toEqual({ x: 8, y: 9 })
    expect(endpoint).toEqual({ x: 2, y: -3 })
  })
})
