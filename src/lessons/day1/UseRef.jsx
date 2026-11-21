// Day 1 · Lesson 5 — useRef for DOM access
// A ref holds a value that survives re-renders without causing one.
// Attached to an element, `ref.current` is that DOM node.
import { useEffect, useRef, useState } from 'react'

export default function UseRef() {
  const inputRef = useRef(null)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    inputRef.current.focus() // focus on mount
  }, [])

  const login = () => {
    setGreeting(`Welcome, ${inputRef.current.value || 'guest'}!`)
    inputRef.current.focus()
  }

  return (
    <div className="stack">
      <div className="row">
        <input ref={inputRef} type="text" placeholder="Your name" onKeyDown={(e) => e.key === 'Enter' && login()} />
        <button onClick={login}>Log in</button>
      </div>
      {greeting && <p className="big">{greeting}</p>}
    </div>
  )
}
