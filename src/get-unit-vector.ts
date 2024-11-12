import type { Point } from "./common"

export const getUnitVectorFromPointAToB = (a: Point, b: Point): Point => {
  const delta = {
    x: b.x - a.x,
    y: b.y - a.y,
  }

  const magnitude = Math.sqrt(delta.x ** 2 + delta.y ** 2)

  return {
    x: delta.x / magnitude,
    y: delta.y / magnitude,
  }
}

export const getUnitVectorFromDirection = (
  direction: "up" | "down" | "left" | "right",
): Point => {
  switch (direction) {
    case "up":
      return { x: 0, y: 1 }
    case "down":
      return { x: 0, y: -1 }
    case "left":
      return { x: -1, y: 0 }
    case "right":
      return { x: 1, y: 0 }
  }
}
