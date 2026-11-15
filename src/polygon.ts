import type { Bounds, Point, UniversalRect } from "./common"
import { doSegmentsIntersect } from "./line-intersections"

export type Polygon = readonly Point[]

const universalRectToBounds = (rect: UniversalRect): Bounds => {
  if ("minX" in rect) {
    return rect
  }

  const halfWidth = rect.width / 2
  const halfHeight = rect.height / 2

  return {
    minX: rect.center.x - halfWidth,
    minY: rect.center.y - halfHeight,
    maxX: rect.center.x + halfWidth,
    maxY: rect.center.y + halfHeight,
  }
}

const getBoundsCorners = (bounds: Bounds): Point[] => [
  { x: bounds.minX, y: bounds.minY },
  { x: bounds.maxX, y: bounds.minY },
  { x: bounds.maxX, y: bounds.maxY },
  { x: bounds.minX, y: bounds.maxY },
]

const getPolygonEdges = (polygon: Polygon): Array<[Point, Point]> => {
  const edges: Array<[Point, Point]> = []
  for (let i = 0; i < polygon.length; i++) {
    const start = polygon[i]
    const end = polygon[(i + 1) % polygon.length]
    edges.push([start, end])
  }
  return edges
}

const isPointOnSegment = (point: Point, start: Point, end: Point): boolean => {
  const cross =
    (point.y - start.y) * (end.x - start.x) -
    (point.x - start.x) * (end.y - start.y)
  if (Math.abs(cross) > 1e-9) {
    return false
  }

  const dot =
    (point.x - start.x) * (end.x - start.x) +
    (point.y - start.y) * (end.y - start.y)
  if (dot < 0) {
    return false
  }

  const squaredLength = (end.x - start.x) ** 2 + (end.y - start.y) ** 2
  if (squaredLength === 0) return false
  if (dot > squaredLength) {
    return false
  }

  return true
}

export const isPointInsideBounds = (point: Point, bounds: Bounds): boolean =>
  point.x >= bounds.minX &&
  point.x <= bounds.maxX &&
  point.y >= bounds.minY &&
  point.y <= bounds.maxY

export const isPointInsidePolygon = (
  point: Point,
  polygon: Polygon,
): boolean => {
  if (polygon.length < 3) return false

  const edges = getPolygonEdges(polygon)
  for (const [start, end] of edges) {
    if (isPointOnSegment(point, start, end)) {
      return true
    }
  }

  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi

    if (intersects) {
      inside = !inside
    }
  }

  return inside
}

const doesPolygonIntersectBounds = (
  bounds: Bounds,
  polygon: Polygon,
): boolean => {
  const boundsCorners = getBoundsCorners(bounds)
  const boundsEdges: Array<[Point, Point]> = [
    [boundsCorners[0], boundsCorners[1]],
    [boundsCorners[1], boundsCorners[2]],
    [boundsCorners[2], boundsCorners[3]],
    [boundsCorners[3], boundsCorners[0]],
  ]

  const polygonEdges = getPolygonEdges(polygon)

  for (const [start, end] of polygonEdges) {
    for (const [rectStart, rectEnd] of boundsEdges) {
      if (doSegmentsIntersect(start, end, rectStart, rectEnd)) {
        return true
      }
    }
  }

  return false
}

export const areBoundsOverlappingPolygon = (
  bounds: Bounds,
  polygon: Polygon,
): boolean => {
  if (polygon.length < 3) return false

  if (polygon.some((point) => isPointInsideBounds(point, bounds))) {
    return true
  }

  const corners = getBoundsCorners(bounds)
  if (corners.some((corner) => isPointInsidePolygon(corner, polygon))) {
    return true
  }

  return doesPolygonIntersectBounds(bounds, polygon)
}

export const areBoundsCompletelyInsidePolygon = (
  bounds: Bounds,
  polygon: Polygon,
): boolean => {
  if (polygon.length < 3) return false

  const corners = getBoundsCorners(bounds)
  if (!corners.every((corner) => isPointInsidePolygon(corner, polygon))) {
    return false
  }

  return !doesPolygonIntersectBounds(bounds, polygon)
}

export const isRectOverlappingPolygon = (
  rect: UniversalRect,
  polygon: Polygon,
): boolean => areBoundsOverlappingPolygon(universalRectToBounds(rect), polygon)

export const isRectCompletelyInsidePolygon = (
  rect: UniversalRect,
  polygon: Polygon,
): boolean =>
  areBoundsCompletelyInsidePolygon(universalRectToBounds(rect), polygon)


export const getPolygonArea = (polygon: Polygon): number => {
  if (polygon.length < 3) return 0
  let area = 0
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    area += (polygon[j].x + polygon[i].x) * (polygon[j].y - polygon[i].y)
  }
  return Math.abs(area / 2)
}

export const getPolygonCentroid = (polygon: Polygon): Point | null => {
  if (polygon.length < 3) return null
  let area = 0
  let cx = 0
  let cy = 0
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const factor = polygon[j].x * polygon[i].y - polygon[i].x * polygon[j].y
    area += factor
    cx += (polygon[j].x + polygon[i].x) * factor
    cy += (polygon[j].y + polygon[i].y) * factor
  }
  area = area / 2
  if (Math.abs(area) < 1e-9) return null
  return {
    x: cx / (6 * area),
    y: cy / (6 * area),
  }
}

export const getPolygonPerimeter = (polygon: Polygon): number => {
  if (polygon.length < 2) return 0
  let perimeter = 0
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    perimeter += Math.hypot(polygon[i].x - polygon[j].x, polygon[i].y - polygon[j].y)
  }
  return perimeter
}
