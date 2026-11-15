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
  const dx = end.x - start.x
  const dy = end.y - start.y
  const squaredLength = dx ** 2 + dy ** 2
  if (squaredLength === 0) return false

  const cross = (point.y - start.y) * dx - (point.x - start.x) * dy
  const roundoffTolerance =
    8 *
    Number.EPSILON *
    (Math.max(Math.abs(start.x), Math.abs(end.x), Math.abs(point.x)) *
      Math.abs(dy) +
      Math.max(Math.abs(start.y), Math.abs(end.y), Math.abs(point.y)) *
        Math.abs(dx))
  // Shrink the tolerance for short edges, allowing for rounded coordinates.
  const crossTolerance = Math.min(
    1e-9,
    Math.max(1e-9 * squaredLength, roundoffTolerance),
  )
  if (Math.abs(cross) > crossTolerance) {
    return false
  }

  const dot = (point.x - start.x) * dx + (point.y - start.y) * dy
  if (dot < 0) {
    return false
  }

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
