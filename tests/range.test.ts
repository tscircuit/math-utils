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

  test("fractional step does not emit extra element past end (issue #38)", () => {
    const r1 = range(0, 1, 0.1)
    expect(r1.length).toBe(10)
    expect(r1[0]).toBe(0)
    expect(r1[9]).toBeCloseTo(0.9, 5)

    const r2 = range(0, 3, 0.3)
    expect(r2.length).toBe(10)
    expect(r2[0]).toBe(0)
    expect(r2[9]).toBeCloseTo(2.7, 5)

    const r3 = range(1, 0, -0.1)
    expect(r3.length).toBe(10)
    expect(r3[0]).toBe(1)
    expect(r3[9]).toBeCloseTo(0.1, 5)
  })
})
