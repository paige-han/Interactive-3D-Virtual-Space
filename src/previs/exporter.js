// Builds the "shot package" handed to an AI video model:
//   prompt.txt, start/end frames (PNG), camera track (JSON),
//   previs.webm (the move rendered) and depth.webm (a depth pass for depth-conditioned models).
import * as THREE from 'three'
import { zipSync, strToU8 } from 'fflate'
import fixWebmDuration from 'fix-webm-duration'
import { applyPose, horizontalFovDeg, interpolatePose, verticalFov } from './pose.js'

const EXPORT_HEIGHT = 540
const DEPTH_NEAR = 0.5
const DEPTH_FAR = 15

// Linear depth (white = near, black = far) — easier for depth-conditioned models than raw z-buffer depth.
// Built on MeshDepthMaterial so it still follows the skinned (animated) character.
function linearDepthMaterial() {
  const material = new THREE.MeshDepthMaterial()
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uNear = { value: DEPTH_NEAR }
    shader.uniforms.uFar = { value: DEPTH_FAR }
    shader.fragmentShader = 'uniform float uNear;\nuniform float uFar;\n' + shader.fragmentShader.replace(
      'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
      'float viewZ = perspectiveDepthToViewZ( fragCoordZ, uNear, uFar );\n\t\tfloat linearDepth = viewZToOrthographicDepth( viewZ, uNear, uFar );\n\t\tgl_FragColor = vec4( vec3( 1.0 - linearDepth ), opacity );',
    )
  }
  return material
}

function pickMime() {
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']
  return types.find((t) => window.MediaRecorder?.isTypeSupported?.(t)) || ''
}

// Recording canvases must be attached to the page or the browser captures no frames
function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  c.style.cssText = 'position:fixed;left:-10000px;top:0;pointer-events:none'
  document.body.appendChild(c)
  return c
}

export function cameraTrack({ start, end, ease, duration, fps, sensor, frameRatio }) {
  const camera = new THREE.PerspectiveCamera()
  const frames = []
  const total = Math.round(duration * fps)
  for (let i = 0; i <= total; i++) {
    const t = total === 0 ? 0 : i / total
    const pose = interpolatePose(start, end, ease(t))
    applyPose(camera, pose)
    camera.updateMatrixWorld()
    frames.push({
      frame: i,
      time: +(i / fps).toFixed(4),
      position: camera.position.toArray().map((v) => +v.toFixed(4)),
      quaternion: camera.quaternion.toArray().map((v) => +v.toFixed(5)),
      focalLengthMm: +pose.lens.toFixed(2),
      horizontalFovDeg: +horizontalFovDeg(pose.lens, sensor.width).toFixed(3),
    })
  }
  return {
    units: 'meters',
    coordinateSystem: 'three.js (right-handed, Y up, camera looks down -Z)',
    fps,
    duration,
    aspectRatio: frameRatio,
    sensorWidthMm: sensor.width,
    sensorHeightMm: sensor.height,
    frames,
  }
}

export async function exportShot({ bridge, shot, onProgress }) {
  const { gl, scene } = bridge
  const { start, end, ease, duration, fps, sensor, frameRatio, prompt } = shot
  const width = Math.round((EXPORT_HEIGHT * frameRatio) / 2) * 2
  const height = EXPORT_HEIGHT

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 100)

  // A dedicated renderer at the exact output size, matching the live view's color and tone settings
  const exportGl = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  exportGl.setPixelRatio(1)
  exportGl.setSize(width, height, false)
  exportGl.toneMapping = gl.toneMapping
  exportGl.toneMappingExposure = gl.toneMappingExposure
  exportGl.outputColorSpace = gl.outputColorSpace
  exportGl.shadowMap.enabled = gl.shadowMap.enabled
  exportGl.shadowMap.type = gl.shadowMap.type

  const rgbCanvas = makeCanvas(width, height)
  const depthCanvas = makeCanvas(width, height)
  const depthMaterial = linearDepthMaterial()

  const renderTo = (canvas, pose, depth) => {
    applyPose(camera, pose)
    camera.fov = verticalFov(pose.lens, sensor.width, width / height, frameRatio)
    camera.near = depth ? DEPTH_NEAR : 0.05
    camera.far = depth ? DEPTH_FAR : 100
    camera.updateProjectionMatrix()

    const prev = { background: scene.background, fog: scene.fog, tone: exportGl.toneMapping, space: exportGl.outputColorSpace }
    if (depth) {
      scene.overrideMaterial = depthMaterial
      scene.background = new THREE.Color('#000000')
      scene.fog = null
      exportGl.toneMapping = THREE.NoToneMapping
      exportGl.outputColorSpace = THREE.LinearSRGBColorSpace
    }
    exportGl.render(scene, camera)
    scene.overrideMaterial = null
    scene.background = prev.background
    scene.fog = prev.fog
    exportGl.toneMapping = prev.tone
    exportGl.outputColorSpace = prev.space

    canvas.getContext('2d').drawImage(exportGl.domElement, 0, 0)
  }

  const canvasToPng = (canvas) =>
    new Promise((resolve) => canvas.toBlob(async (b) => resolve(new Uint8Array(await b.arrayBuffer())), 'image/png'))

  // Start and end frames (for first/last-frame conditioned models)
  renderTo(rgbCanvas, start, false)
  const startPng = await canvasToPng(rgbCanvas)
  renderTo(rgbCanvas, end, false)
  const endPng = await canvasToPng(rgbCanvas)

  // Record the move in real time so the video plays at the right speed
  const mime = pickMime()
  const files = {}
  if (mime) {
    const ext = mime.includes('mp4') ? 'mp4' : 'webm'
    const record = (canvas) => {
      const stream = canvas.captureStream(0)
      const track = stream.getVideoTracks()[0]
      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 })
      const chunks = []
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data)
      const done = new Promise((resolve) => (recorder.onstop = () => resolve(new Blob(chunks, { type: mime }))))
      recorder.start(250)
      return { track, recorder, done }
    }
    const rgbRec = record(rgbCanvas)
    const depthRec = record(depthCanvas)
    const total = Math.round(duration * fps)
    const frameMs = 1000 / fps
    const t0 = performance.now()
    for (let i = 0; i <= total; i++) {
      const pose = interpolatePose(start, end, ease(total ? i / total : 0))
      renderTo(rgbCanvas, pose, false)
      renderTo(depthCanvas, pose, true)
      rgbRec.track.requestFrame?.()
      depthRec.track.requestFrame?.()
      onProgress?.(i / total)
      // Always yield so the recorder can capture the frame; pace to real time when possible
      const wait = t0 + (i + 1) * frameMs - performance.now()
      await new Promise((r) => setTimeout(r, Math.max(0, wait)))
    }
    rgbRec.recorder.stop()
    depthRec.recorder.stop()
    // Browser-recorded WebM has no duration in its header; write it in so players and tools read it
    const finish = async (blob) => {
      const fixed = ext === 'webm' ? await fixWebmDuration(blob, duration * 1000, { logger: false }) : blob
      return new Uint8Array(await fixed.arrayBuffer())
    }
    files[`previs.${ext}`] = await finish(await rgbRec.done)
    files[`depth.${ext}`] = await finish(await depthRec.done)
  }

  depthMaterial.dispose()
  exportGl.dispose()
  exportGl.forceContextLoss()
  rgbCanvas.remove()
  depthCanvas.remove()

  const track = cameraTrack({ start, end, ease, duration, fps, sensor, frameRatio })
  files['prompt.txt'] = strToU8(prompt + '\n')
  files['start_frame.png'] = startPng
  files['end_frame.png'] = endPng
  files['camera_track.json'] = strToU8(JSON.stringify(track, null, 2))
  files['README.txt'] = strToU8(
    [
      'Shot package from Film Previs',
      '',
      'prompt.txt          Text prompt written from the shot settings',
      'start_frame.png     First frame (for image-to-video or first/last-frame models)',
      'end_frame.png       Last frame',
      'camera_track.json   Per-frame camera position, rotation and focal length',
      'previs.*            The camera move rendered as a guide video',
      'depth.*             Linear depth pass of the same move (white = near, black = far, 0.5–15 m)',
      '',
      `Resolution ${width}x${height}, ${fps} fps, ${duration}s`,
    ].join('\n'),
  )
  return new Blob([zipSync(files, { level: 0 })], { type: 'application/zip' })
}
