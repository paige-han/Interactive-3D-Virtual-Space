import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import PrevisScene from './PrevisScene.jsx'
import ShotPanel from './ShotPanel.jsx'
import CameraPanel from './CameraPanel.jsx'
import Timeline from './Timeline.jsx'
import { ASPECT_RATIOS, SENSORS } from './lens.js'
import { EASINGS, POSE_KEYS, horizontalFovDeg, interpolatePose } from './pose.js'
import { MOVES, describeChange } from './moves.js'
import { composePrompt } from './prompt.js'
import { exportShot } from './exporter.js'

const FPS = 24

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

const pickPose = (o) => Object.fromEntries(POSE_KEYS.map((k) => [k, o[k]]))

export default function PrevisApp() {
  // ── Camera (the pose you're editing) ──────────────────────────────
  const [camera, setCameraState] = useState({
    view: 'Through the lens', sensor: 'Super 35', lens: 35,
    distance: 4, height: 1.5, aim: 1.25, orbit: 20, tilt: 0,
  })
  const setCamera = useCallback((patch) => setCameraState((c) => ({ ...c, ...patch })), [])
  const [frame, setFrameState] = useState({ aspect: '2.39:1 (Scope)', thirds: true })
  const setFrame = (patch) => setFrameState((f) => ({ ...f, ...patch }))
  const [animation, setAnimation] = useState('Walk')

  const sensor = SENSORS[camera.sensor]
  const ratio = ASPECT_RATIOS[frame.aspect]
  const editPose = useMemo(() => pickPose(camera), [camera])

  // ── Shot (start → end) ───────────────────────────────────────────
  const [move, setMove] = useState('Dolly in')
  const [shot, setShot] = useState(() => MOVES['Dolly in'].make(pickPose({ lens: 35, distance: 4, height: 1.5, aim: 1.25, orbit: 20, tilt: 0 })))
  const [duration, setDuration] = useState(5)
  const [easing, setEasing] = useState('Ease in-out')
  const [subject, setSubject] = useState('a person walking through a minimal studio set')

  // ── Playback ─────────────────────────────────────────────────────
  const tRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [previewing, setPreviewing] = useState(true)
  const ease = EASINGS[easing]

  // Editing the camera on the right switches back to "edit pose" mode
  const lastEdit = useRef(editPose)
  useEffect(() => {
    if (POSE_KEYS.some((k) => lastEdit.current[k] !== editPose[k])) {
      setPreviewing(false)
      setPlaying(false)
    }
    lastEdit.current = editPose
  }, [editPose])

  const latest = useRef({})
  latest.current = { previewing, shot, ease, editPose }
  const getPose = useCallback(() => {
    const { previewing, shot, ease, editPose } = latest.current
    return previewing ? interpolatePose(shot.start, shot.end, ease(tRef.current)) : editPose
  }, [])

  const chooseMove = (name) => {
    setMove(name)
    setShot(MOVES[name].make(editPose))
    tRef.current = 0
    setPreviewing(true)
    setPlaying(true)
  }
  const setStart = () => { setShot((s) => ({ ...s, start: { ...editPose } })); setMove('Custom'); tRef.current = 0; setPreviewing(true) }
  const setEnd = () => { setShot((s) => ({ ...s, end: { ...editPose } })); setMove('Custom'); tRef.current = 1; setPreviewing(true) }

  const moveInfo = move === 'Custom'
    ? { describe: describeChange(shot.start, shot.end) }
    : MOVES[move]
  const prompt = composePrompt({
    subject, start: shot.start, end: shot.end, move: moveInfo, duration, easing,
    sensorName: camera.sensor, sensor, aspectLabel: frame.aspect.split(' ')[0], frameRatio: ratio,
  })

  // ── Export ───────────────────────────────────────────────────────
  const exporterRef = useRef(null)
  const [exportProgress, setExportProgress] = useState(null)
  const onExport = async () => {
    if (!exporterRef.current) return
    setPlaying(false)
    setExportProgress(0)
    try {
      const blob = await exportShot({
        bridge: exporterRef.current,
        shot: { start: shot.start, end: shot.end, ease, duration, fps: FPS, sensor, frameRatio: ratio, prompt },
        onProgress: setExportProgress,
      })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `shot-${move.toLowerCase().replace(/\s+/g, '-')}-${Math.round(shot.start.lens)}mm.zip`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 5000)
    } finally {
      setExportProgress(null)
    }
  }

  // ── Compare with a generated video ──────────────────────────────
  const [compareUrl, setCompareUrl] = useState(null)
  const videoRef = useRef(null)
  const onCompareFile = (file) => {
    if (compareUrl) URL.revokeObjectURL(compareUrl)
    setCompareUrl(URL.createObjectURL(file))
    tRef.current = 0
    setPreviewing(true)
    setPlaying(false)
    setCamera({ view: 'Through the lens' })
  }

  const throughLens = camera.view === 'Through the lens'
  const livePose = previewing ? null : editPose
  const slatePose = livePose || shot.start
  const hfov = horizontalFovDeg(slatePose.lens, sensor.width)

  return (
    <div className={compareUrl ? 'previs comparing' : 'previs'}>
      <header className="previs-bar">
        <a className="back" href="./">← Back to demo</a>
        <h1>Film Previs <span className="badge">Work in progress</span></h1>
      </header>

      <ShotPanel
        move={move} onMove={chooseMove}
        duration={duration} setDuration={setDuration}
        easing={easing} setEasing={setEasing}
        onSetStart={setStart} onSetEnd={setEnd}
        subject={subject} setSubject={setSubject}
        prompt={prompt}
        onExport={onExport} exportProgress={exportProgress}
        onCompareFile={onCompareFile} hasCompare={!!compareUrl}
        onClearCompare={() => { URL.revokeObjectURL(compareUrl); setCompareUrl(null) }}
      />


      <div className="stage">
        <div className="view">
          {compareUrl && <span className="view-label">Previs (intent)</span>}
          <Canvas shadows dpr={[1, 2]}>
            <Suspense fallback={null}>
              <PrevisScene getPose={getPose} sensor={sensor} frameRatio={ratio} view={camera.view}
                animation={animation} exporterRef={exporterRef} />
            </Suspense>
          </Canvas>
          {throughLens && <FrameGuides ratio={ratio} showThirds={frame.thirds} />}
        </div>
        {compareUrl && (
          <div className="view">
            <span className="view-label">AI result</span>
            <div className="frame" style={{ '--ratio': ratio }}>
              <div className="frame-window video-window">
                <video ref={videoRef} src={compareUrl} muted playsInline preload="auto" />
              </div>
            </div>
          </div>
        )}
      </div>

      <CameraPanel camera={camera} setCamera={setCamera} frame={frame} setFrame={setFrame}
        animation={animation} setAnimation={setAnimation} animations={['Idle', 'Walk', 'Run', 'Jump']} />

      <div className="bottom">
        <Timeline tRef={tRef} duration={duration} fps={FPS} playing={playing} setPlaying={setPlaying}
          videoRef={videoRef} onScrub={() => setPreviewing(true)} />
        <div className="slate">
          <span><b>{!previewing ? `${editPose.lens}mm` : Math.round(shot.start.lens) === Math.round(shot.end.lens) ? `${Math.round(shot.start.lens)}mm` : `${Math.round(shot.start.lens)}→${Math.round(shot.end.lens)}mm`}</b></span>
          <span>{camera.sensor}</span>
          <span>{frame.aspect.split(' ')[0]}</span>
          <span>H-FOV {hfov.toFixed(1)}°</span>
          <span>{previewing ? `Previewing: ${move}` : 'Editing camera'}</span>
        </div>
      </div>
    </div>
  )
}
