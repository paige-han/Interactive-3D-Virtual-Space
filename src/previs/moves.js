// Camera moves, described the way a DP would call them.
// Each move turns the current pose into a start and an end pose.

const clampLens = (mm) => Math.min(135, Math.max(14, mm))

export const MOVES = {
  Static: {
    label: 'Static',
    describe: 'locked-off static camera',
    make: (p) => ({ start: { ...p }, end: { ...p } }),
  },
  'Dolly in': {
    label: 'Dolly in',
    describe: 'slow dolly in toward the subject',
    make: (p) => ({ start: { ...p, distance: p.distance + 1.5 }, end: { ...p, distance: Math.max(1.2, p.distance - 1) } }),
  },
  'Dolly out': {
    label: 'Dolly out',
    describe: 'dolly out, pulling away from the subject',
    make: (p) => ({ start: { ...p, distance: Math.max(1.2, p.distance - 1) }, end: { ...p, distance: p.distance + 2 } }),
  },
  Arc: {
    label: 'Arc',
    describe: 'arcing around the subject',
    make: (p) => ({ start: { ...p, orbit: p.orbit - 35 }, end: { ...p, orbit: p.orbit + 35 } }),
  },
  'Crane up': {
    label: 'Crane up',
    describe: 'crane up, rising above the subject',
    make: (p) => ({ start: { ...p, height: 0.6 }, end: { ...p, height: 3.8, distance: p.distance + 1 } }),
  },
  'Zoom in': {
    label: 'Zoom in',
    describe: 'zoom in on a fixed camera position',
    make: (p) => ({ start: { ...p, lens: clampLens(p.lens) }, end: { ...p, lens: clampLens(p.lens * 2.4) } }),
  },
  'Dolly zoom': {
    label: 'Dolly zoom',
    describe: 'dolly zoom (Vertigo effect): the camera dollies in while zooming out, so the subject keeps its size and the background stretches',
    // Subject size stays constant when distance / focal length stays constant
    make: (p) => {
      const startLens = 85
      const endLens = 28
      const startDistance = 6.5
      return {
        start: { ...p, lens: startLens, distance: startDistance },
        end: { ...p, lens: endLens, distance: (startDistance * endLens) / startLens },
      }
    },
  },
}

// Describe any start → end change in DP terms (used for custom moves)
export function describeChange(start, end) {
  const parts = []
  const dd = end.distance - start.distance
  const dh = end.height - start.height
  const dor = end.orbit - start.orbit
  const dl = end.lens - start.lens
  // distance and focal length changing together keeps the subject's size: a dolly zoom
  if (Math.abs(dd) > 0.3 && Math.abs(dl) > 5 && Math.sign(dd) === Math.sign(dl)) parts.push('dolly zoom')
  else {
    if (dd < -0.3) parts.push('dolly in')
    if (dd > 0.3) parts.push('dolly out')
    if (Math.abs(dl) > 5) parts.push(dl > 0 ? 'zoom in' : 'zoom out')
  }
  if (Math.abs(dor) > 5) parts.push(`arc ${dor > 0 ? 'right' : 'left'} around the subject`)
  if (dh > 0.3) parts.push('crane up')
  if (dh < -0.3) parts.push('crane down')
  return parts.length ? parts.join(' combined with ') : 'locked-off static camera'
}
