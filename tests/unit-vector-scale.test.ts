import { expect, test } from "bun:test"
import { getUnitVectorFromPointAToB } from "../src/get-unit-vector"

test("unit vectors retain their direction for large and small finite displacements", () => {
  for (const scale of [1, 1e200, 1e-200]) {
    for (const sign of [1, -1]) {
      const vector = getUnitVectorFromPointAToB(
        { x: 0, y: 0 },
        { x: sign * 3 * scale, y: sign * 4 * scale },
      )
      expect(vector.x).toBeCloseTo(sign * 0.6, 12)
      expect(vector.y).toBeCloseTo(sign * 0.8, 12)
      expect(Math.hypot(vector.x, vector.y)).toBeCloseTo(1, 12)
    }
  }
})
