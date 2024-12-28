import type { Point } from "./common"

export type GridCell = {
  index: number
  center: Point
  topLeft: Point
  bottomRight: Point
}

export type GridOptions = {
  rows: number
  cols: number
  xSpacing?: number
  ySpacing?: number
  width?: number
  height?: number
  offsetX?: number
  offsetY?: number
  yDirection?: "cartesian" | "up-is-negative"
}

export function grid({
  rows,
  cols,
  xSpacing,
  ySpacing,
  width,
  height,
  offsetX = 0,
  offsetY = 0,
  yDirection = "cartesian",
}: GridOptions): GridCell[] {
  // Calculate cell dimensions
  const cellWidth = width ? width / cols : xSpacing ?? 1
  const cellHeight = height ? height / rows : ySpacing ?? 1

  const cells: GridCell[] = []
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      
      // Calculate center position
      const centerX = offsetX + col * cellWidth + cellWidth / 2
      const rawCenterY = offsetY + row * cellHeight + cellHeight / 2
      
      // Adjust Y coordinate based on yDirection
      const centerY = yDirection === "cartesian" 
        ? offsetY + (rows - 1 - row) * cellHeight + cellHeight / 2
        : rawCenterY

      cells.push({
        index,
        center: { x: centerX, y: centerY },
        topLeft: {
          x: centerX - cellWidth / 2,
          y: centerY + cellHeight / 2,
        },
        bottomRight: {
          x: centerX + cellWidth / 2,
          y: centerY - cellHeight / 2,
        },
      })
    }
  }

  return cells
}
