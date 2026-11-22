// Right panel: the camera you're editing, framing and the actor — in set terms, with units.
import { ASPECT_RATIOS, FOCAL_LENGTHS, SENSORS, SHOT_PRESETS } from './lens.js'

function Segmented({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => {
        const v = typeof o === 'object' ? o.value : o
        const text = typeof o === 'object' ? o.label : o
        return (
          <button key={text} role="radio" aria-checked={v === value} className={v === value ? 'on' : ''} onClick={() => onChange(v)}>
            {text}
          </button>
        )
      })}
    </div>
  )
}

function Slider({ label, value, min, max, step, unit, onChange, format = (v) => v.toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0) }) {
  return (
    <label className="slider">
      <span className="slider-head">
        <span>{label}</span>
        <b>{format(value)}{unit}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  )
}

export { Segmented }

export default function CameraPanel({ camera, setCamera, frame, setFrame, animation, setAnimation, animations }) {
  const set = (key) => (value) => setCamera({ [key]: value })

  return (
    <aside className="camera-panel">
      <section>
        <h2>View</h2>
        <Segmented label="View" options={[{ value: 'Through the lens', label: 'Through the lens' }, { value: "Director's view", label: 'Director' }]} value={camera.view} onChange={set('view')} />
      </section>

      <section>
        <h2>Lens</h2>
        <div className="chips">
          {FOCAL_LENGTHS.map((mm) => (
            <button key={mm} className={mm === camera.lens ? 'chip on' : 'chip'} onClick={() => setCamera({ lens: mm })}>{mm}mm</button>
          ))}
        </div>
        <div className="field-label">Sensor</div>
        <Segmented label="Sensor" options={Object.keys(SENSORS)} value={camera.sensor} onChange={set('sensor')} />
      </section>

      <section>
        <h2>Shot size</h2>
        <div className="chips">
          {Object.entries(SHOT_PRESETS).map(([name, p]) => (
            <button key={name} className="chip" onClick={() => setCamera(p)}>{name}</button>
          ))}
        </div>
      </section>

      <section>
        <h2>Camera position</h2>
        <Slider label="Distance to actor" value={camera.distance} min={1.2} max={12} step={0.1} unit=" m" onChange={set('distance')} />
        <Slider label="Camera height" value={camera.height} min={0.2} max={6} step={0.05} unit=" m" onChange={set('height')} />
        <Slider label="Aim at (height on actor)" value={camera.aim} min={0} max={2} step={0.05} unit=" m" onChange={set('aim')} />
        <Slider label="Angle around actor" value={camera.orbit} min={-180} max={180} step={1} unit="°" onChange={set('orbit')} />
        <Slider label="Tilt" value={camera.tilt} min={-30} max={30} step={0.5} unit="°" onChange={set('tilt')} />
      </section>

      <section>
        <h2>Frame</h2>
        <Segmented label="Aspect ratio" options={Object.keys(ASPECT_RATIOS).map((k) => ({ value: k, label: k.split(' ')[0] }))}
          value={frame.aspect} onChange={(v) => setFrame({ aspect: v })} />
        <label className="toggle">
          <input type="checkbox" checked={frame.thirds} onChange={(e) => setFrame({ thirds: e.target.checked })} />
          <span>Rule-of-thirds grid</span>
        </label>
      </section>

      <section>
        <h2>Actor</h2>
        <Segmented label="Actor action" options={animations} value={animation} onChange={setAnimation} />
      </section>
    </aside>
  )
}
