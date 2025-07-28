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
    for (let i = _start; i < _end; i += step) {
      result.push(i)
    }
  } else {
    for (let i = _start; i > _end; i += step) {
      result.push(i)
    }
  }
  return result
}
