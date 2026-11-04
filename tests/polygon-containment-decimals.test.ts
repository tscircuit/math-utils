import { expect, test } from "bun:test"
import {
  type Point,
  areBoundsCompletelyInsidePolygon,
  isRectCompletelyInsidePolygon,
} from "../src"

const triangle = [
  { x: 0, y: 0.1 },
  { x: 1.5, y: 1.1 },
  { x: 1.5, y: 0.1 },
]

function* ringOrders(polygon: Point[]) {
  for (let offset = 0; offset < polygon.length; offset++) {
    const rotated = [...polygon.slice(offset), ...polygon.slice(0, offset)]
    for (const ring of [rotated, [...rotated].reverse()]) {
      yield ring
      yield [...ring, ring[0]]
    }
  }
}

test.each([
  { name: "one ULP below the corner", maxY: 0.49999999999999994, inside: true },
  { name: "reported decimal corner", maxY: 0.5, inside: true },
  { name: "one ULP outside the edge", maxY: 0.5000000000000001, inside: false },
])("decimal containment: $name", ({ maxY, inside }) => {
  const bounds = { minX: 0.6, minY: 0.2, maxX: 1.4, maxY }
  for (const ring of ringOrders(triangle)) {
    expect(areBoundsCompletelyInsidePolygon(bounds, ring)).toBe(inside)
    expect(isRectCompletelyInsidePolygon(bounds, ring)).toBe(inside)
  }
})

test("decimal containment accepts a center-based rectangle", () => {
  for (const ring of ringOrders(triangle)) {
    expect(
      isRectCompletelyInsidePolygon(
        { center: { x: 1, y: 0.35 }, width: 0.8, height: 0.3 },
        ring,
      ),
    ).toBe(true)
  }
})

test.each([
  { name: "thin inward notch", delta: -(2 ** -40), inside: false },
  { name: "tangent notch", delta: 0, inside: true },
  { name: "nearby exterior notch", delta: 2 ** -40, inside: true },
])("concave containment: $name", ({ delta, inside }) => {
  const polygon = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 6, y: 10 },
    { x: 5, y: 6 + delta },
    { x: 4, y: 10 },
    { x: 0, y: 10 },
  ]
  const bounds = { minX: 2, minY: 2, maxX: 8, maxY: 6 }
  for (const ring of ringOrders(polygon)) {
    expect(areBoundsCompletelyInsidePolygon(bounds, ring)).toBe(inside)
    expect(isRectCompletelyInsidePolygon(bounds, ring)).toBe(inside)
  }
})
