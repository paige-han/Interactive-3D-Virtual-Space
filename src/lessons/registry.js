import Composition from './day1/Composition.jsx'
import UseState from './day1/UseState.jsx'
import UseEffect from './day1/UseEffect.jsx'
import EffectCleanup from './day1/EffectCleanup.jsx'
import UseRef from './day1/UseRef.jsx'
import UseMemo from './day1/UseMemo.jsx'
import ForwardRef from './day1/ForwardRef.jsx'
import Shadows from './day2/Shadows.jsx'
import EnvironmentLighting from './day2/EnvironmentLighting.jsx'
import LoadModel from './day2/LoadModel.jsx'
import PostProcessing from './day3/PostProcessing.jsx'
import PhysicsBasics from './day3/PhysicsBasics.jsx'
import KinematicCollisions from './day3/KinematicCollisions.jsx'
import ModelPhysics from './day3/ModelPhysics.jsx'

export const DAYS = [
  {
    title: 'Day 1 · React fundamentals',
    lessons: [
      { id: 'composition', title: 'Composition with children', file: 'day1/Composition.jsx', kind: 'dom', Component: Composition,
        summary: 'Wrapper components receive whatever is nested inside them as props.children.' },
      { id: 'use-state', title: 'useState', file: 'day1/UseState.jsx', kind: 'dom', Component: UseState,
        summary: 'State is a value React remembers between renders; setting it triggers a re-render.' },
      { id: 'use-effect', title: 'useEffect & dependencies', file: 'day1/UseEffect.jsx', kind: 'dom', Component: UseEffect,
        summary: 'The dependency array controls when an effect runs. Watch the log as you click and type.' },
      { id: 'effect-cleanup', title: 'Effect cleanup', file: 'day1/EffectCleanup.jsx', kind: 'dom', Component: EffectCleanup,
        summary: 'Returning a cleanup function stops the timer when the component unmounts.' },
      { id: 'use-ref', title: 'useRef for DOM access', file: 'day1/UseRef.jsx', kind: 'dom', Component: UseRef,
        summary: 'A ref points at a real DOM node — used here to focus and read an input.' },
      { id: 'use-memo', title: 'useMemo', file: 'day1/UseMemo.jsx', kind: 'dom', Component: UseMemo,
        summary: 'An expensive calculation is cached and only recomputed when its input changes.' },
      { id: 'forward-ref', title: 'forwardRef', file: 'day1/ForwardRef.jsx', kind: 'dom', Component: ForwardRef,
        summary: 'forwardRef lets a parent reach the input inside a custom component.' },
    ],
  },
  {
    title: 'Day 2 · 3D scene basics',
    lessons: [
      { id: 'shadows', title: 'Lights & shadows', file: 'day2/Shadows.jsx', kind: '3d', camera: [4, 3, 6], Component: Shadows,
        summary: 'Compare real-time, contact and accumulative shadows. Turn on helpers to see the shadow camera.' },
      { id: 'environment', title: 'Environment lighting', file: 'day2/EnvironmentLighting.jsx', kind: '3d', camera: [4, 2, 6], Component: EnvironmentLighting,
        summary: 'Light the whole scene from an environment map and see it in metallic reflections.' },
      { id: 'load-model', title: 'Loading a GLB model', file: 'day2/LoadModel.jsx', kind: '3d', camera: [2.2, 1.7, 3.6], Component: LoadModel,
        summary: 'Load a 3D model with useGLTF and make every mesh cast shadows.' },
    ],
  },
  {
    title: 'Day 3 · Effects & physics',
    lessons: [
      { id: 'post-processing', title: 'Post-processing', file: 'day3/PostProcessing.jsx', kind: '3d', camera: [4, 2, 6], Component: PostProcessing,
        summary: 'Bloom, glitch, noise, vignette and depth of field — filters applied to the rendered image.' },
      { id: 'physics-basics', title: 'Physics basics', file: 'day3/PhysicsBasics.jsx', kind: '3d', camera: [5, 4, 8], Component: PhysicsBasics,
        summary: 'Rigid bodies, colliders and gravity. Click the cube to push it with an impulse.' },
      { id: 'kinematic', title: 'Kinematic bodies & collisions', file: 'day3/KinematicCollisions.jsx', kind: '3d', camera: [5, 5, 9], Component: KinematicCollisions,
        summary: 'A code-driven bar knocks objects around; collision events log hits and play a sound.' },
      { id: 'model-physics', title: 'A model with physics', file: 'day3/ModelPhysics.jsx', kind: '3d', camera: [4, 3, 6], Component: ModelPhysics,
        summary: 'Turn a loaded character into a rigid body with a hand-fitted box collider, then drop it.' },
    ],
  },
]

export const ALL_LESSONS = DAYS.flatMap((d) => d.lessons)
