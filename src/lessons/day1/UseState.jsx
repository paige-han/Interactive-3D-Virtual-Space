// Day 1 · Lesson 2 — useState
// State is a value React remembers between renders.
// Calling the setter schedules a re-render with the new value.
import { useState } from 'react'

export default function UseState() {
  const [value, setValue] = useState(1)

  return (
    <div className="row">
      <span className="big">{value}</span>
      <button onClick={() => setValue((v) => v + 1)}>+1</button>
      <button className="ghost" onClick={() => setValue(1)}>Reset</button>
    </div>
  )
}
