import { expect, test } from "bun:test"
import { getBoundFromCenteredRect } from "../src/get-bound-from-centered-rect"

test("getBoundFromCenteredRect", () => {
  const result = getBoundFromCenteredRect({
    center: { x: 5, y: 5 },
    width: 4,
    height: 4,
  })

  expect(result).toEqual({
    minX: 3,
    maxX: 7,
    minY: 3,
    maxY: 7,
  })
})

test("getBoundFromCenteredRect preserves each axis", () => {
  const result = getBoundFromCenteredRect({
    center: { x: 10, y: -3 },
    width: 6,
    height: 2,
  })

  expect(result).toEqual({
    minX: 7,
    maxX: 13,
    minY: -4,
    maxY: -2,
  })
})
