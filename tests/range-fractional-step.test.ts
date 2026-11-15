import { expect, test } from "bun:test"
import { range } from "../src/range"

// range() accumulates the loop counter with `i += step`, so floating-point
// drift makes range(0, 1, 0.1) emit an extra 11th element (~0.9999999999999999)
// that is really the excluded end 1.0. The end must stay exclusive: the result
// should be [0, 0.1, ..., 0.9] with 10 elements.
test.failing("range with a fractional step keeps the end exclusive", () => {
  const result = range(0, 1, 0.1)

  expect(result).toHaveLength(10)
  expect(result.every((n) => n < 1)).toBe(true)
})
