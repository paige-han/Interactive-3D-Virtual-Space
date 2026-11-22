// Play / scrub the camera move. Owns the animation loop so only this bar re-renders.
import { useEffect, useRef, useState } from 'react'

export default function Timeline({ tRef, duration, fps, playing, setPlaying, onScrub, videoRef }) {
  const [t, setT] = useState(tRef.current)
  const [loop, setLoop] = useState(true)
  const last = useRef(0)

  useEffect(() => {
    if (!playing) return
    let raf
    last.current = performance.now()
    const video = videoRef?.current
    if (Number.isFinite(video?.duration) && video.duration > 0) {
      video.playbackRate = Math.min(16, Math.max(0.0625, video.duration / duration))
      video.currentTime = tRef.current * video.duration
      video.play().catch(() => {})
    }
    const tick = (now) => {
      const dt = (now - last.current) / 1000
      last.current = now
      let next = tRef.current + dt / duration
      if (next >= 1) {
        if (loop) {
          next = 0
          if (Number.isFinite(video?.duration)) video.currentTime = 0
        } else {
          next = 1
          setPlaying(false)
        }
      }
      tRef.current = next
      setT(next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      video?.pause()
    }
  }, [playing, duration, loop, tRef, setPlaying, videoRef])

  // Keep the bar in sync when the move changes
  useEffect(() => setT(tRef.current), [tRef, duration])

  const scrub = (value) => {
    setPlaying(false)
    tRef.current = value
    setT(value)
    const video = videoRef?.current
    if (Number.isFinite(video?.duration)) video.currentTime = value * video.duration
    onScrub?.()
  }

  const frame = Math.round(t * duration * fps)
  return (
    <div className="timeline">
      <button className="play" onClick={() => { if (tRef.current >= 1) scrub(0); setPlaying(!playing); onScrub?.() }}
        aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? '❚❚' : '▶'}
      </button>
      <div className="track">
        <span className="mark start">START</span>
        <input type="range" min={0} max={1} step={0.001} value={t} onChange={(e) => scrub(+e.target.value)} aria-label="Playhead" />
        <span className="mark end">END</span>
      </div>
      <span className="time">{(t * duration).toFixed(2)}s / {duration.toFixed(1)}s · f{frame}</span>
      <label className="loop"><input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Loop</label>
    </div>
  )
}
