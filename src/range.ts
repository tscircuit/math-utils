export function range(start: number, end?: number, step = 1): number[] {
  if (step === 0) throw new Error("step cannot be 0")
  let _start: number
  let _end: number

  if (end === undefined) {
    _start = 0
    _end = start
  } else {
    _start = start
    _end = end
  }

  // Derive each element as _start + k * step instead of accumulating with
  // `i += step`. Accumulation drifts — range(0, 1, 0.1) would push a spurious
  // ~0.9999999999999999 past the exclusive end — so compute the count up front
  // and multiply, which keeps the end exclusive for fractional steps.
  const count = Math.max(0, Math.ceil((_end - _start) / step))
  const result: number[] = []
  for (let k = 0; k < count; k++) {
    result.push(_start + k * step)
  }
  return result
}
