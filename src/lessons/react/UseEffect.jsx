// React foundations — useEffect and dependency arrays
// The dependency array decides WHEN an effect runs:
//   []          → once, after the first render (mount)
//   [count]     → after renders where `count` changed
//   (no array)  → after every render
import { useEffect, useState } from 'react'

export default function UseEffect() {
  const [count, setCount] = useState(1)
  const [text, setText] = useState('')
  const [log, setLog] = useState([])

  const write = (msg) => setLog((l) => [`${new Date().toLocaleTimeString()}  ${msg}`, ...l].slice(0, 8))

  useEffect(() => { write('[]  mounted') }, [])
  useEffect(() => { write('[count]  count changed') }, [count])
  useEffect(() => { write('[text]  text changed') }, [text])

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something…" />
      </div>
      <ul className="log">
        {log.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    </div>
  )
}
