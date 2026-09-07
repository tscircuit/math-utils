import { expect, test } from "bun:test"
import { grid } from "../src/grid"

test("an explicit zero width takes precedence over default or custom spacing", () => {
  for (const centered of [true, false]) {
    for (const xSpacing of [undefined, 3]) {
      const cells = grid({
        rows: 2,
        cols: 3,
        width: 0,
        xSpacing,
        centered,
        offsetX: 7,
      })
      expect(cells).toHaveLength(6)
      for (const cell of cells) {
        expect(cell.center.x).toBe(7)
        expect(cell.topLeft.x).toBe(7)
        expect(cell.bottomRight.x).toBe(7)
      }
    }
  }
})

test("an explicit zero height collapses both coordinate conventions at offsetY", () => {
  for (const centered of [true, false]) {
    for (const yDirection of ["cartesian", "up-is-negative"] as const) {
      const cells = grid({
        rows: 3,
        cols: 2,
        height: 0,
        ySpacing: 4,
        centered,
        yDirection,
        offsetY: -5,
      })
      expect(cells).toHaveLength(6)
      for (const cell of cells) {
        expect(cell.center.y).toBe(-5)
        expect(cell.topLeft.y).toBe(-5)
        expect(cell.bottomRight.y).toBe(-5)
      }
    }
  }
})

test("zero width and height preserve the grid indices at a single point", () => {
  const cells = grid({
    rows: 2,
    cols: 2,
    width: 0,
    height: 0,
    offsetX: 2,
    offsetY: -3,
  })
  expect(cells.map(({ index, row, col }) => [index, row, col])).toEqual([
    [0, 0, 0],
    [1, 0, 1],
    [2, 1, 0],
    [3, 1, 1],
  ])
  for (const cell of cells) {
    expect(cell.center).toEqual({ x: 2, y: -3 })
    expect(cell.topLeft).toEqual(cell.center)
    expect(cell.bottomRight).toEqual(cell.center)
  }
})

test("omitted dimensions still use the specified spacing", () => {
  const cells = grid({ rows: 2, cols: 3, xSpacing: 2, ySpacing: 4 })
  expect(cells[0]!.center).toEqual({ x: -2, y: 2 })
  expect(cells[5]!.center).toEqual({ x: 2, y: -2 })
})
