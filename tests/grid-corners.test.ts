import { expect, test } from "bun:test"
import { grid } from "../src/grid"

for (const centered of [false, true]) {
  for (const yDirection of ["cartesian", "up-is-negative"] as const) {
    test(`cell corners respect ${yDirection}, centered=${centered}`, () => {
      const cells = grid({
        rows: 2,
        cols: 2,
        width: 8,
        height: 12,
        offsetX: 10,
        offsetY: 20,
        centered,
        yDirection,
      })
      const sign = yDirection === "cartesian" ? 1 : -1
      for (const cell of cells) {
        expect(cell.topLeft.x).toBe(cell.center.x - 2)
        expect(cell.bottomRight.x).toBe(cell.center.x + 2)
        expect(cell.topLeft.y).toBe(cell.center.y + sign * 3)
        expect(cell.bottomRight.y).toBe(cell.center.y - sign * 3)
      }
      // Adjacent rows share a horizontal boundary in either coordinate system.
      expect(cells[0].bottomRight.y).toBe(cells[2].topLeft.y)
    })
  }
}

test("non-centered screen coordinates produce the expected outer corners", () => {
  const cells = grid({
    rows: 2,
    cols: 3,
    xSpacing: 4,
    ySpacing: 6,
    yDirection: "up-is-negative",
    centered: false,
    offsetX: 10,
    offsetY: 20,
  })
  expect(cells[0].topLeft).toEqual({ x: 10, y: 20 })
  expect(cells[5].bottomRight).toEqual({ x: 22, y: 32 })
})
