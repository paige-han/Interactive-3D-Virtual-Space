import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { button, Leva, useControls } from 'leva'
import PrevisScene from './PrevisScene.jsx'
import { ASPECT_RATIOS, FOCAL_LENGTHS, SENSORS, SHOT_PRESETS } from './lens.js'

function FrameGuides({ ratio, showThirds }) {
  // Letterbox bars + rule-of-thirds grid for the chosen aspect ratio
  return (
    <div className="frame" style={{ '--ratio': ratio }}>
      <div className="frame-window">
        {showThirds && (
          <>
            <span className="third v" style={{ left: '33.333%' }} />
            <span className="third v" style={{ left: '66.666%' }} />
            <span className="third h" style={{ top: '33.333%' }} />
            <span className="third h" style={{ top: '66.666%' }} />
          </>
        )}
      </div>
    </div>
  )
}

export default function PrevisApp() {
  const [camera, setCamera] = useControls('Camera', () => ({
    view: { options: ['Through the lens', "Director's view"] },
    sensor: { options: Object.keys(SENSORS) },
    lens: { options: Object.fromEntries(FOCAL_LENGTHS.map((f) => [`${f}mm`, f])), value: 35 },
    distance: { value: 4, min: 1.5, max: 12, step: 0.1 },
    height: { value: 1.5, min: 0.2, max: 6, step: 0.05 },
    aim: { value: 1.25, min: 0, max: 2, step: 0.05, label: 'aim height' },
    orbit: { value: 20, min: -180, max: 180, step: 1 },
    tilt: { value: 0, min: -30, max: 30, step: 0.5 },
  }))
  useControls('Shot presets', Object.fromEntries(
    Object.entries(SHOT_PRESETS).map(([name, p]) => [name, button(() => setCamera(p))]),
  ))
  const frame = useControls('Frame', {
    aspect: { options: Object.keys(ASPECT_RATIOS) },
    thirds: true,
  })
  const actor = useControls('Actor', {
    animation: { options: ['Idle', 'Walk', 'Run', 'Jump'] },
  })

  const sensor = SENSORS[camera.sensor]
  const ratio = ASPECT_RATIOS[frame.aspect]
  const throughLens = camera.view === 'Through the lens'
  const hfov = (2 * Math.atan((sensor.width / 2) / camera.lens) * 180) / Math.PI

  return (
    <div className="previs">
      <header className="previs-bar">
        <div>
          <a className="back" href="./">← Back to demo</a>
          <h1>Film Previs <span className="badge">Work in progress</span></h1>
        </div>
      </header>

      <Leva titleBar={{ title: 'Previs controls' }} />

      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PrevisScene settings={{ ...camera, sensor, animation: actor.animation }} frameRatio={ratio} />
        </Suspense>
      </Canvas>

      {throughLens && <FrameGuides ratio={ratio} showThirds={frame.thirds} />}

      <div className="slate">
        <span><b>{camera.lens}mm</b></span>
        <span>{camera.sensor} ({sensor.width}×{sensor.height}mm)</span>
        <span>{frame.aspect.split(' ')[0]}</span>
        <span>H-FOV {hfov.toFixed(1)}°</span>
        <span>{throughLens ? 'Through the lens' : "Director's view"}</span>
      </div>
    </div>
  )
}
