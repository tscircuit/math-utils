import { test } from "bun:test"
import { strict as assert } from "node:assert"
import { midpoint } from "../src/point-distance"
import { getBoundsCenter } from "../src/get-bounds-center"

const cases = [
  [1e308, 1e308, 1e308],
  [-1e308, -1e308, -1e308],
  [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
  [2, 6, 4],
  [-Number.MAX_VALUE, Number.MAX_VALUE, 0],
  [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE],
] as const

for (const [a, b, expected] of cases) {
  test(`midpoint of ${a} and ${b}`, () => {
    const first = Object.freeze({ x: a, y: a })
    const second = Object.freeze({ x: b, y: b })
    assert.deepEqual(midpoint(first, second), { x: expected, y: expected })
    assert.deepEqual(midpoint(second, first), { x: expected, y: expected })
  })

  test(`bounds center between ${a} and ${b}`, () => {
    const bounds = Object.freeze({
      minX: Math.min(a, b),
      minY: Math.min(a, b),
      maxX: Math.max(a, b),
      maxY: Math.max(a, b),
    })
    assert.deepEqual(getBoundsCenter(bounds), { x: expected, y: expected })
  })
}
