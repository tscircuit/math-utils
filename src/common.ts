export type Point = {
  x: number
  y: number
}

export type Bounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type UniversalRect =
  | {
      center: Point
      width: number
      height: number
    }
  | Bounds
