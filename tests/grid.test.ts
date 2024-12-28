import { expect, test, describe } from "bun:test"
import { grid } from "../src/grid"

describe("grid", () => {
  test("basic 2x2 grid with default spacing", () => {
    const cells = grid({ rows: 2, cols: 2 })

    expect(cells.length).toBe(4)
    expect(cells[0].index).toBe(0)
    expect(cells[3].index).toBe(3)

    // Check first cell (top-left in cartesian)
    expect(cells[0].center).toEqual({ x: -0.5, y: 0.5 })
    expect(cells[0].topLeft).toEqual({ x: -1, y: 1 })
    expect(cells[0].bottomRight).toEqual({ x: 0, y: 0 })
  })

  test("2x3 grid with custom spacing", () => {
    const cells = grid({
      rows: 2,
      cols: 3,
      xSpacing: 10,
      ySpacing: 5,
    })

    expect(cells.length).toBe(6)

    // Check dimensions
    const cell = cells[0]
    expect(cell.bottomRight.x - cell.topLeft.x).toBe(10)
    expect(cell.topLeft.y - cell.bottomRight.y).toBe(5)
  })

  test("grid with fixed dimensions", () => {
    const cells = grid({
      rows: 2,
      cols: 2,
      width: 100,
      height: 100,
    })

    expect(cells.length).toBe(4)

    // Each cell should be 50x50
    const cell = cells[0]
    expect(cell.bottomRight.x - cell.topLeft.x).toBe(50)
    expect(cell.topLeft.y - cell.bottomRight.y).toBe(50)
  })

  test("grid with offset", () => {
    const cells = grid({
      rows: 1,
      cols: 1,
      offsetX: 10,
      offsetY: 20,
    })

    expect(cells[0].center).toEqual({ x: 10, y: 20 })
  })

  test("up-is-negative coordinate system", () => {
    const cells = grid({
      rows: 2,
      cols: 1,
      yDirection: "up-is-negative",
    })

    // In up-is-negative, y increases downward
    expect(cells[0].center.y).toBeLessThan(cells[1].center.y)
  })

  test("cartesian coordinate system", () => {
    const cells = grid({
      rows: 2,
      cols: 1,
      yDirection: "cartesian",
    })

    // In cartesian, y increases upward
    expect(cells[0].center.y).toBeGreaterThan(cells[1].center.y)
  })

  test("centered grid (default)", () => {
    const cells = grid({
      rows: 2,
      cols: 2,
      xSpacing: 10,
      ySpacing: 10,
    })

    // For a 2x2 grid with 10 unit spacing, the total size is 20x20
    // When centered, it should go from -10 to +10 in both dimensions
    expect(cells[0].center.x).toBe(-5)
    expect(cells[0].center.y).toBe(5)
  })

  test("non-centered grid", () => {
    const cells = grid({
      rows: 2,
      cols: 2,
      xSpacing: 10,
      ySpacing: 10,
      centered: false,
    })

    // When not centered, it should start from 0,0
    expect(cells[0].center.x).toBe(5)
    expect(cells[0].center.y).toBe(15)
  })
})
