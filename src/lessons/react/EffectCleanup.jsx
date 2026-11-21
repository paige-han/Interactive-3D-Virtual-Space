// React foundations — Effect cleanup on unmount
// An effect can return a cleanup function. React runs it when the
// component unmounts, so the interval below never keeps running in the background.
import { useEffect, useState } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id) // cleanup
  }, [])

  return <span className="big">{seconds}s</span>
}

export default function EffectCleanup() {
  const [showTimer, setShowTimer] = useState(false)

  return (
    <div className="row">
      <button onClick={() => setShowTimer(!showTimer)}>Timer {showTimer ? 'OFF' : 'ON'}</button>
      {showTimer ? <Timer /> : <span className="muted">Timer unmounted — interval cleared</span>}
    </div>
  )
}
