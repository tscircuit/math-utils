import { expect, test } from "bun:test"
import { getSegmentIntersection } from "../src/line-intersections"

for (const scale of [1e-7, 1e-6, 1, 1e6]) {
  test(`finds crossing segments at scale ${scale}`, () => {
    const a = { x: 0, y: 0 }
    const b = { x: 4 * scale, y: 4 * scale }
    const u = { x: 0, y: 4 * scale }
    const v = { x: 4 * scale, y: 0 }
    for (const [p, q, r, s] of [
      [a, b, u, v],
      [b, a, u, v],
      [u, v, a, b],
    ]) {
      const result = getSegmentIntersection(p, q, r, s)
      expect(result).not.toBeNull()
      expect(result!.x / scale).toBeCloseTo(2, 10)
      expect(result!.y / scale).toBeCloseTo(2, 10)
    }
  })

  test(`handles endpoints and exclusions at scale ${scale}`, () => {
    const a = { x: 0, y: 0 }
    const b = { x: scale, y: 0 }
    const endpoint = getSegmentIntersection(a, b, b, { x: scale, y: scale })
    expect(endpoint).not.toBeNull()
    expect(endpoint!.x / scale).toBeCloseTo(1, 10)
    expect(endpoint!.y).toBe(0)
    expect(
      getSegmentIntersection(
        a,
        b,
        { x: 2 * scale, y: -scale },
        { x: 2 * scale, y: scale },
      ),
    ).toBeNull()
    expect(
      getSegmentIntersection(a, b, { x: 0, y: scale }, { x: scale, y: scale }),
    ).toBeNull()
    expect(getSegmentIntersection(a, b, a, b)).toBeNull()
    expect(getSegmentIntersection(a, a, a, b)).toBeNull()
  })
}
