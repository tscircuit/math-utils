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

  if (step > 0) {
    if (_start >= _end) return []
    const count = Math.max(0, Math.ceil((_end - _start) / step - 1e-10))
    for (let k = 0; k < count; k++) {
      const val = _start + k * step
      if (val < _end) {
        result.push(val)
      }
    }
  } else {
    if (_start <= _end) return []
    const count = Math.max(0, Math.ceil((_start - _end) / -step - 1e-10))
    for (let k = 0; k < count; k++) {
      const val = _start + k * step
      if (val > _end) {
        result.push(val)
      }
    }
  }
  return result
}

