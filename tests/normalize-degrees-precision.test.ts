import { test } from "bun:test"
import { strict as assert } from "node:assert"
import { normalizeDegrees } from "../src/normalize-degrees"

const normalizedAngles = [0.1, 1.23, 1e-15, Number.MIN_VALUE, 359.99999999999994]
for (const angle of normalizedAngles) {
  test(`already normalized ${angle} is unchanged`, () => {
    assert.equal(normalizeDegrees(angle), angle)
    assert.equal(normalizeDegrees(normalizeDegrees(angle)), angle)
  })
}

for (const [input, expected] of [
  [-90, 270],
  [450, 90],
  [-450, 270],
  [360, 0],
  [-360, 0],
  [-0, 0],
]) {
  test(`wraps ${input} to ${expected}`, () => {
    assert.equal(normalizeDegrees(input!), expected)
  })
}

test("nonfinite and negative subnormal inputs keep their results", () => {
  assert.equal(normalizeDegrees(-Number.MIN_VALUE), 0)
  for (const angle of [NaN, Infinity, -Infinity]) {
    assert.equal(Number.isNaN(normalizeDegrees(angle)), true)
  }
})
