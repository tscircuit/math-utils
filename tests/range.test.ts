import { describe, expect, test } from "bun:test"
import { range } from "../src/range"

describe("range", () => {
  test("single argument", () => {
    expect(range(3)).toEqual([0, 1, 2])
  })

  test("start and end", () => {
    expect(range(1, 4)).toEqual([1, 2, 3])
  })

  test("custom step", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
  })

  test("negative step", () => {
    expect(range(5, 1, -1)).toEqual([5, 4, 3, 2])
  })

  test("fractional step does not emit extra element past exclusive end", () => {
    const r01 = range(0, 1, 0.1)
    expect(r01).toHaveLength(10)
    expect(r01[0]).toBe(0)
    expect(r01[9]).toBeCloseTo(0.9, 12)
    expect(r01.every((v) => v < 1)).toBe(true)

    const r03 = range(0, 3, 0.3)
    expect(r03).toHaveLength(10)
    expect(r03[0]).toBe(0)
    expect(r03[9]).toBeCloseTo(2.7, 12)
    expect(r03.every((v) => v < 3)).toBe(true)

    const rSub = range(0.1, 0.4, 0.1)
    expect(rSub).toHaveLength(3)
    expect(rSub.every((v) => v < 0.4)).toBe(true)

    const rNeg = range(1, 0, -0.1)
    expect(rNeg).toHaveLength(10)
    expect(rNeg.every((v) => v > 0)).toBe(true)
  })
})
