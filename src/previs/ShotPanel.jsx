// Left panel: choose a move, write the subject, read the generated prompt, export the package.
import { useState } from 'react'
import { MOVES } from './moves.js'
import { EASINGS } from './pose.js'
import { Segmented } from './CameraPanel.jsx'

export default function ShotPanel({
  move, onMove, duration, setDuration, easing, setEasing, onSetStart, onSetEnd,
  subject, setSubject, prompt, onExport, exportProgress, onCompareFile, hasCompare, onClearCompare,
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard blocked */ }
  }
  const exporting = exportProgress !== null

  return (
    <aside className="shot-panel">
      <section>
        <h2>Camera move</h2>
        <div className="chips">
          {Object.keys(MOVES).map((name) => (
            <button key={name} className={name === move ? 'chip on' : 'chip'} onClick={() => onMove(name)}>{name}</button>
          ))}
          {move === 'Custom' && <button className="chip on">Custom</button>}
        </div>
        <div className="row2">
          <button className="ghost" onClick={onSetStart} title="Use the current camera (panel on the right) as the first frame">Set START from camera</button>
          <button className="ghost" onClick={onSetEnd} title="Use the current camera as the last frame">Set END from camera</button>
        </div>
        <label className="field">
          <span>Duration <b>{duration}s</b></span>
          <input type="range" min={2} max={10} step={0.5} value={duration} onChange={(e) => setDuration(+e.target.value)} />
        </label>
        <div className="field-label">Speed curve</div>
        <Segmented label="Speed curve" value={easing} onChange={setEasing}
          options={Object.keys(EASINGS).map((k) => ({ value: k, label: k.replace('Ease ', '').replace('in-out', 'In-out').replace(/^in$/, 'In').replace(/^out$/, 'Out') }))} />
      </section>

      <section>
        <h2>Prompt</h2>
        <label className="field">
          <span>Subject & scene</span>
          <textarea rows={2} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <p className="prompt">{prompt}</p>
        <button className="ghost" onClick={copy}>{copied ? 'Copied ✓' : 'Copy prompt'}</button>
      </section>

      <section>
        <h2>Hand off to AI video</h2>
        <button className="primary" onClick={onExport} disabled={exporting}>
          {exporting ? `Rendering… ${Math.round(exportProgress * 100)}%` : 'Export shot package (.zip)'}
        </button>
        <p className="hint">Prompt, start & end frames, per-frame camera track, previs video and a depth pass.</p>
        <label className="ghost file">
          {hasCompare ? 'Replace AI result video' : 'Compare with an AI result…'}
          <input type="file" accept="video/*" onChange={(e) => e.target.files[0] && onCompareFile(e.target.files[0])} />
        </label>
        {hasCompare && <button className="link" onClick={onClearCompare}>Close comparison</button>}
      </section>
    </aside>
  )
}
