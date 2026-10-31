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

  const result: number[] = []
  const count = Math.max(0, Math.ceil((_end - _start) / step))

  for (let k = 0; k < count; k++) {
    const value = _start + k * step
    if (step > 0 ? value >= _end : value <= _end) break
    result.push(value)
  }
  return result
}
