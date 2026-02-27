import { expect, test } from "bun:test"
import { getBoundsFromCenteredRect } from "../src/get-bound-from-centered-rect"

test("getBoundFromCenteredRect", () => {
  const result = getBoundsFromCenteredRect({
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
