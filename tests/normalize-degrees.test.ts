import { test, expect } from "bun:test"
import { normalizeDegrees } from "../src/normalize-degrees"

test("normalizeDegrees should wrap angles correctly", () => {
  expect(normalizeDegrees(0)).toBe(0)
  expect(normalizeDegrees(360)).toBe(0)
  expect(normalizeDegrees(370)).toBe(10)
  expect(normalizeDegrees(-10)).toBe(350)
  expect(normalizeDegrees(-720)).toBe(0)
  expect(normalizeDegrees(1080)).toBe(0)
})
