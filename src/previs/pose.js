// A camera "pose" is described in set terms rather than raw 3D coordinates:
//   distance (m) from the actor, camera height (m), aim height on the actor (m),
//   orbit angle around the actor (deg), tilt offset (deg) and lens (mm).
import * as THREE from 'three'

export const POSE_KEYS = ['distance', 'height', 'aim', 'orbit', 'tilt', 'lens']

export function interpolatePose(a, b, t) {
  const out = {}
  for (const k of POSE_KEYS) out[k] = a[k] + (b[k] - a[k]) * t
  return out
}

const _target = new THREE.Vector3()

// Place a three.js camera for a pose
export function applyPose(camera, pose) {
  const angle = THREE.MathUtils.degToRad(pose.orbit)
  camera.position.set(Math.sin(angle) * pose.distance, pose.height, Math.cos(angle) * pose.distance)
  camera.lookAt(_target.set(0, pose.aim, 0))
  camera.rotateX(THREE.MathUtils.degToRad(pose.tilt))
}

// Vertical FOV so that the sensor width maps exactly to the framed (letterboxed) area.
// viewAspect = width / height of the drawing surface, frameRatio = chosen aspect ratio.
export function verticalFov(lens, sensorWidth, viewAspect, frameRatio) {
  const frameAspectInView = Math.min(viewAspect, frameRatio)
  const halfTanH = sensorWidth / 2 / lens
  const halfTanV = halfTanH / frameAspectInView
  return THREE.MathUtils.radToDeg(2 * Math.atan(halfTanV))
}

export function horizontalFovDeg(lens, sensorWidth) {
  return THREE.MathUtils.radToDeg(2 * Math.atan(sensorWidth / 2 / lens))
}

export const EASINGS = {
  'Ease in-out': (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  Linear: (t) => t,
  'Ease in': (t) => t * t,
  'Ease out': (t) => 1 - (1 - t) * (1 - t),
}
