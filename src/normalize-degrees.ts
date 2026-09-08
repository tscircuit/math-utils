export function normalizeDegrees(angle: number): number {
  const normalized = angle % 360
  if (normalized === 0) return 0
  if (normalized < 0) return (normalized + 360) % 360
  return normalized
}
