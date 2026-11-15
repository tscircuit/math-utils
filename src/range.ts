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
  const eps = Math.abs(step) * 1e-9

  if (step > 0) {
    for (let k = 0; ; k++) {
      const val = _start + k * step
      if (val >= _end - eps) break
      result.push(val)
    }
  } else {
    for (let k = 0; ; k++) {
      const val = _start + k * step
      if (val <= _end + eps) break
      result.push(val)
    }
  }
  return result
}
