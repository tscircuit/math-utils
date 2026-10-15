import type { Bounds, Point } from "./common"
import type { Polygon } from "./polygon"

/**
 * Conservative cover for one simple polygon ring without holes.
 * Points and rectangles use the same Cartesian frame (+X right, +Y up) and
 * units as the caller. Options are positive finite lengths in those units.
 * Returns no rectangles for fewer than three vertices or invalid lengths.
 *
 * Split at every vertex height so edge pairing is constant within each band.
 * Cover each trapezoid using its full horizontal envelope. Subdivide to bound
 * horizontal overhang, then merge only identical spans in adjacent bands.
 * The ring may use either winding and may repeat its first vertex at the end.
 * Self-intersections and holes are not supported. No input points are changed.
 */
export const coverPolygonWithRects = (
  polygon: Polygon,
  {
    maxBandHeight,
    maxSideOverhang,
  }: { maxBandHeight: number; maxSideOverhang: number },
): Array<{ center: Point; width: number; height: number }> => {
  if (polygon.length < 3) return []
  if (
    !Number.isFinite(maxBandHeight) ||
    maxBandHeight <= 0 ||
    !Number.isFinite(maxSideOverhang) ||
    maxSideOverhang <= 0
  )
    return []

  const vertexHeights = [...new Set(polygon.map((point) => point.y))].sort(
    (a, b) => a - b,
  )
  const edges = polygon
    .map((start, i) => ({ start, end: polygon[(i + 1) % polygon.length]! }))
    .filter(({ start, end }) => start.y !== end.y)
  const xAt = (edge: (typeof edges)[number], y: number) =>
    edge.start.x +
    ((y - edge.start.y) * (edge.end.x - edge.start.x)) /
      (edge.end.y - edge.start.y)
  const rectangles: Bounds[] = []
  let previousBand: Bounds[] = []

  for (let bandIndex = 0; bandIndex + 1 < vertexHeights.length; bandIndex++) {
    const bottom = vertexHeights[bandIndex]!,
      top = vertexHeights[bandIndex + 1]!
    const middle = bottom + (top - bottom) / 2
    const activeEdges = edges
      .filter(
        ({ start, end }) =>
          Math.min(start.y, end.y) <= bottom && Math.max(start.y, end.y) >= top,
      )
      .sort((a, b) => xAt(a, middle) - xAt(b, middle))
    const maxSideDrift = Math.max(
      0,
      ...activeEdges.map((edge) =>
        Math.abs(xAt(edge, top) - xAt(edge, bottom)),
      ),
    )
    const slices = Math.max(
      1,
      Math.ceil((top - bottom) / maxBandHeight),
      Math.ceil(maxSideDrift / maxSideOverhang),
    )

    for (let slice = 0; slice < slices; slice++) {
      const minY = bottom + ((top - bottom) * slice) / slices
      const maxY =
        slice + 1 === slices
          ? top
          : bottom + ((top - bottom) * (slice + 1)) / slices
      const currentBand: Bounds[] = []
      for (let pair = 0; pair < activeEdges.length; pair += 2) {
        const left = activeEdges[pair]!,
          right = activeEdges[pair + 1]!
        const minX = Math.min(xAt(left, minY), xAt(left, maxY))
        const maxX = Math.max(xAt(right, minY), xAt(right, maxY))
        if (maxX <= minX) continue
        const previous = previousBand.find(
          (rect) =>
            rect.minX === minX && rect.maxX === maxX && rect.maxY === minY,
        )
        if (previous) {
          previous.maxY = maxY
          currentBand.push(previous)
        } else {
          const rect = { minX, maxX, minY, maxY }
          rectangles.push(rect)
          currentBand.push(rect)
        }
      }
      previousBand = currentBand
    }
  }

  return rectangles.map(({ minX, maxX, minY, maxY }) => ({
    center: { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 },
    width: maxX - minX,
    height: maxY - minY,
  }))
}
