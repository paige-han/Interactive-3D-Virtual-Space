// Turns a shot (in set terms) into a text prompt for video generation models.
import { horizontalFovDeg } from './pose.js'

const ACTOR_HEIGHT = 1.8

// How much of the actor fits vertically in frame → conventional shot size
export function shotSize(pose, sensor, frameRatio) {
  const hfov = (horizontalFovDeg(pose.lens, sensor.width) * Math.PI) / 180
  const frameWidthAtSubject = 2 * pose.distance * Math.tan(hfov / 2)
  const frameHeightAtSubject = frameWidthAtSubject / frameRatio
  const ratio = frameHeightAtSubject / ACTOR_HEIGHT
  if (ratio > 3) return 'extreme wide shot'
  if (ratio > 1.4) return 'wide shot'
  if (ratio > 0.95) return 'full shot'
  if (ratio > 0.55) return 'medium shot'
  if (ratio > 0.32) return 'medium close-up'
  if (ratio > 0.16) return 'close-up'
  return 'extreme close-up'
}

export function lensCharacter(mm) {
  if (mm < 24) return 'ultra-wide lens'
  if (mm < 35) return 'wide-angle lens'
  if (mm <= 60) return 'normal lens'
  if (mm <= 100) return 'short telephoto lens'
  return 'telephoto lens'
}

export function cameraAngle(pose) {
  const diff = pose.height - pose.aim
  if (diff > 1.5) return 'high angle looking down'
  if (diff > 0.4) return 'slightly high angle'
  if (diff < -0.6) return 'low angle looking up'
  return 'eye level'
}

export function composePrompt({ subject, start, end, move, duration, easing, sensorName, sensor, aspectLabel, frameRatio }) {
  const startSize = shotSize(start, sensor, frameRatio)
  const endSize = shotSize(end, sensor, frameRatio)
  const sizeText = startSize === endSize ? startSize : `${startSize} moving to a ${endSize}`
  const lensText = Math.round(start.lens) === Math.round(end.lens)
    ? `${Math.round(start.lens)}mm ${lensCharacter(start.lens)}`
    : `lens going from ${Math.round(start.lens)}mm to ${Math.round(end.lens)}mm`
  const pace = duration <= 3 ? 'quick' : duration >= 7 ? 'slow' : 'smooth'

  return [
    `${capitalize(sizeText)} of ${subject.trim() || 'the subject'}.`,
    `Shot on a ${lensText}, ${sensorName} sensor, ${cameraAngle(start)}.`,
    `Camera movement: ${pace} ${move.describe}, over ${duration} seconds, ${easing.toLowerCase()}.`,
    `Aspect ratio ${aspectLabel}. Cinematic, physically plausible camera motion, no cuts.`,
  ].join(' ')
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
