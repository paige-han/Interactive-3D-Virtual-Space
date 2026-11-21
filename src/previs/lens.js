// Real-world camera data used by the virtual cinema camera.

export const SENSORS = {
  'Super 35': { width: 24.89, height: 18.66 },
  'Full Frame': { width: 36, height: 24 },
  'Micro 4/3': { width: 17.3, height: 13 },
}

export const FOCAL_LENGTHS = [18, 24, 35, 50, 85, 135]

export const ASPECT_RATIOS = {
  '2.39:1 (Scope)': 2.39,
  '1.85:1 (Flat)': 1.85,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
}

// Common shot sizes: where the camera sits and what height on the actor it aims at
export const SHOT_PRESETS = {
  'Wide': { lens: 24, distance: 7, height: 1.6, aim: 1.0, tilt: 0 },
  'Medium': { lens: 50, distance: 4, height: 1.5, aim: 1.25, tilt: 0 },
  'Close-up': { lens: 85, distance: 3.2, height: 1.65, aim: 1.62, tilt: 0 },
  'Low angle': { lens: 24, distance: 3, height: 0.35, aim: 1.3, tilt: 0 },
}
