import { orient2d } from "robust-predicates"
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

  return isPointInsidePolygonByRayCast(point, polygon)
}

const isPointInsidePolygonByRayCast = (
  point: Point,
  polygon: Polygon,
): boolean => {
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

const doesSegmentEnterBounds = (
  start: Point,
  end: Point,
  bounds: Bounds,
  corners: Point[],
): boolean => {
  // The rectangle's axes separate segments that cannot enter its open interior.
  if (
    Math.max(start.x, end.x) <= bounds.minX ||
    Math.min(start.x, end.x) >= bounds.maxX ||
    Math.max(start.y, end.y) <= bounds.minY ||
    Math.min(start.y, end.y) >= bounds.maxY
  ) {
    return false
  }

  // The remaining separating axis is perpendicular to the segment. Exact signs
  // distinguish corner contact from even a thin crossing without rounded t values.
  let positive = false
  let negative = false
  for (const corner of corners) {
    const side = orient2d(start.x, start.y, end.x, end.y, corner.x, corner.y)
    positive ||= side > 0
    negative ||= side < 0
    if (positive && negative) return true
  }
  return false
}

const isBoundsSegmentInsidePolygon = (
  bounds: Bounds,
  polygon: Polygon,
): boolean => {
  const horizontal = bounds.minY === bounds.maxY
  const fixed = horizontal ? bounds.minY : bounds.minX
  const min = horizontal ? bounds.minX : bounds.minY
  const max = horizontal ? bounds.maxX : bounds.maxY
  if (min === max) return true // The corner test already accepted this point.

  // Split at every boundary crossing, including collinear overlap endpoints.
  // Endpoints alone cannot detect a segment passing through a concave gap.
  const positions = [min, max]
  const boundaryIntervals: Array<[number, number]> = []
  for (const [start, end] of getPolygonEdges(polygon)) {
    const startFixed = horizontal ? start.y : start.x
    const endFixed = horizontal ? end.y : end.x
    const startAlong = horizontal ? start.x : start.y
    const endAlong = horizontal ? end.x : end.y
    if (startFixed === endFixed) {
      if (startFixed === fixed) {
        positions.push(startAlong, endAlong)
        boundaryIntervals.push([
          Math.min(startAlong, endAlong),
          Math.max(startAlong, endAlong),
        ])
      }
    } else if (
      fixed >= Math.min(startFixed, endFixed) &&
      fixed <= Math.max(startFixed, endFixed)
    ) {
      positions.push(
        startAlong +
          ((fixed - startFixed) / (endFixed - startFixed)) *
            (endAlong - startAlong),
      )
    }
  }
  const splits = positions.filter((value) => value >= min && value <= max)
  splits.sort((a, b) => a - b)
  for (let i = 1; i < splits.length; i++) {
    if (splits[i] === splits[i - 1]) continue
    const along = splits[i - 1] + (splits[i] - splits[i - 1]) / 2
    if (
      boundaryIntervals.some(([start, end]) => along >= start && along <= end)
    ) {
      continue
    }
    const point = horizontal ? { x: along, y: fixed } : { x: fixed, y: along }
    if (!isPointInsidePolygonByRayCast(point, polygon)) return false
  }
  return true
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

  if (bounds.minX === bounds.maxX || bounds.minY === bounds.maxY) {
    return isBoundsSegmentInsidePolygon(bounds, polygon)
  }

  // All corners can lie on a concave notch's boundary while the interior is outside.
  const center = {
    x: bounds.minX + (bounds.maxX - bounds.minX) / 2,
    y: bounds.minY + (bounds.maxY - bounds.minY) / 2,
  }
  if (!isPointInsidePolygonByRayCast(center, polygon)) return false

  // For a simple polygon, a boundary entering the rectangle's open interior
  // excludes some rectangle area. Contact confined to its boundary is allowed.
  return !getPolygonEdges(polygon).some(([start, end]) =>
    doesSegmentEnterBounds(start, end, bounds, corners),
  )
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
