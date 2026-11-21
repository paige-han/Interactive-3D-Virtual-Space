// Day 1 · Lesson 6 — useMemo for expensive calculations
// Without useMemo, clicking the counter would redo the slow calculation
// on every render. With it, the result is reused until `inputValue` changes.
import { useMemo, useState } from 'react'

function calculate(number) {
  let result = 0
  for (let i = 0; i < 20_000_000; i++) result += Math.sin(i + number)
  return result
}

export default function UseMemo() {
  const [inputValue, setInputValue] = useState(1)
  const [count, setCount] = useState(0)

  const { value, ms } = useMemo(() => {
    const start = performance.now()
    const value = calculate(inputValue)
    return { value, ms: Math.round(performance.now() - start) }
  }, [inputValue])

  return (
    <div className="stack">
      <div className="row">
        <label>Input <input type="number" value={inputValue} onChange={(e) => setInputValue(Number(e.target.value) || 0)} /></label>
        <span>Result = {value.toFixed(4)} <span className="muted">({ms} ms when calculated)</span></span>
      </div>
      <div className="row">
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
        <span className="muted">Clicking here re-renders instantly — the calculation is memoized.</span>
      </div>
    </div>
  )
}
