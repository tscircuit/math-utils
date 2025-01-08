import type { Point } from "./common"

export type GridCellPositions = {
  index: number
  row: number
  col: number
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
  centered?: boolean
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
  centered = true,
}: GridOptions): GridCellPositions[] {
  // Set default spacing if neither spacing nor dimensions are specified
  const effectiveXSpacing = xSpacing ?? 1
  const effectiveYSpacing = ySpacing ?? 1

  // Calculate cell dimensions
  const totalWidth = width ?? cols * effectiveXSpacing
  const totalHeight = height ?? rows * effectiveYSpacing

  // Calculate centering offsets if needed
  const centeringOffsetX = centered ? -totalWidth / 2 : 0
  const centeringOffsetY = centered ? -totalHeight / 2 : 0

  const cellWidth = width ? width / cols : effectiveXSpacing
  const cellHeight = height ? height / rows : effectiveYSpacing

  const cells: GridCellPositions[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col

      // Calculate center position
      const centerX =
        offsetX + centeringOffsetX + col * cellWidth + cellWidth / 2
      const rawCenterY = offsetY + row * cellHeight + cellHeight / 2

      // Adjust Y coordinate based on yDirection
      const centerY =
        yDirection === "cartesian"
          ? offsetY +
            centeringOffsetY +
            (rows - 1 - row) * cellHeight +
            cellHeight / 2
          : offsetY + centeringOffsetY + row * cellHeight + cellHeight / 2

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
        row,
        col,
      })
    }
  }

  return cells
}
