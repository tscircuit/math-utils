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
})
