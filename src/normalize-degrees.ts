export function normalizeDegrees(angle: number): number {
  const normalized = ((angle % 360) + 360) % 360
  return normalized
}
