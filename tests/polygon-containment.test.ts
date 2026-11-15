import { expect, test } from "bun:test"
import {
  areBoundsCompletelyInsidePolygon,
  isRectCompletelyInsidePolygon,
  type Bounds,
  type Point,
} from "../src"

const square = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 },
]
const notched = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 6, y: 10 },
  { x: 6, y: 4 },
  { x: 4, y: 4 },
  { x: 4, y: 10 },
  { x: 0, y: 10 },
]

const cases: {
  name: string
  polygon: Point[]
  bounds: Bounds
  inside: boolean
}[] = [
  {
    name: "strict interior",
    polygon: square,
    bounds: { minX: 2, minY: 2, maxX: 8, maxY: 8 },
    inside: true,
  },
  {
    name: "equal boundaries",
    polygon: square,
    bounds: { minX: 0, minY: 0, maxX: 10, maxY: 10 },
    inside: true,
  },
  {
    name: "shared edge",
    polygon: square,
    bounds: { minX: 0, minY: 2, maxX: 4, maxY: 6 },
    inside: true,
  },
  {
    name: "mesh cell sharing two edges",
    polygon: square,
    bounds: { minX: 0, minY: 0, maxX: 5, maxY: 5 },
    inside: true,
  },
  {
    name: "tangent corner",
    polygon: [
      { x: -5, y: 0 },
      { x: 0, y: -5 },
      { x: 5, y: 0 },
      { x: 0, y: 5 },
    ],
    bounds: { minX: 0, minY: 0, maxX: 2.5, maxY: 2.5 },
    inside: true,
  },
  {
    name: "concave notch between contained corners",
    polygon: notched,
    bounds: { minX: 2, minY: 2, maxX: 8, maxY: 8 },
    inside: false,
  },
  {
    name: "shared concave boundary",
    polygon: notched,
    bounds: { minX: 2, minY: 2, maxX: 8, maxY: 4 },
    inside: true,
  },
  {
    name: "rectangle in notch with every corner on its boundary",
    polygon: notched,
    bounds: { minX: 4, minY: 4, maxX: 6, maxY: 6 },
    inside: false,
  },
  {
    name: "narrow notch is not treated as boundary contact",
    polygon: notched.map(({ x, y }) => ({ x: x * 1e-5, y: y * 1e-5 })),
    bounds: { minX: 4e-5, minY: 4e-5, maxX: 6e-5, maxY: 6e-5 },
    inside: false,
  },
  {
    name: "outside corner",
    polygon: square,
    bounds: { minX: 8, minY: 8, maxX: 12, maxY: 12 },
    inside: false,
  },
  {
    name: "contained point",
    polygon: square,
    bounds: { minX: 5, minY: 5, maxX: 5, maxY: 5 },
    inside: true,
  },
  {
    name: "boundary point",
    polygon: square,
    bounds: { minX: 0, minY: 5, maxX: 0, maxY: 5 },
    inside: true,
  },
  {
    name: "contained boundary segment",
    polygon: notched,
    bounds: { minX: 2, minY: 4, maxX: 8, maxY: 4 },
    inside: true,
  },
  {
    name: "segment crossing concave gap",
    polygon: notched,
    bounds: { minX: 2, minY: 5, maxX: 8, maxY: 5 },
    inside: false,
  },
  {
    name: "segment crossing narrow concave gap",
    polygon: notched.map(({ x, y }) => ({ x: x * 1e-5, y: y * 1e-5 })),
    bounds: { minX: 2e-5, minY: 5e-5, maxX: 8e-5, maxY: 5e-5 },
    inside: false,
  },
  {
    name: "segment along notch side",
    polygon: notched,
    bounds: { minX: 4, minY: 2, maxX: 4, maxY: 8 },
    inside: true,
  },
]

test.each(cases)(
  "complete containment: $name",
  ({ polygon, bounds, inside }) => {
    for (const swapAxes of [false, true]) {
      const transform = ({ x, y }: Point): Point =>
        swapAxes ? { x: y + 20, y: x - 30 } : { x, y }
      const min = transform({ x: bounds.minX, y: bounds.minY })
      const max = transform({ x: bounds.maxX, y: bounds.maxY })
      const transformedBounds = {
        minX: min.x,
        minY: min.y,
        maxX: max.x,
        maxY: max.y,
      }
      const transformedPolygon = polygon.map(transform)
      for (const ring of [
        transformedPolygon,
        [...transformedPolygon].reverse(),
        [...transformedPolygon, transformedPolygon[0]],
        [transformedPolygon[0], ...transformedPolygon],
      ]) {
        expect(areBoundsCompletelyInsidePolygon(transformedBounds, ring)).toBe(
          inside,
        )
        expect(isRectCompletelyInsidePolygon(transformedBounds, ring)).toBe(
          inside,
        )
        expect(
          isRectCompletelyInsidePolygon(
            {
              center: { x: (min.x + max.x) / 2, y: (min.y + max.y) / 2 },
              width: max.x - min.x,
              height: max.y - min.y,
            },
            ring,
          ),
        ).toBe(inside)
      }
    }
  },
)
