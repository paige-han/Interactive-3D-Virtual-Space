import Composition from './react/Composition.jsx'
import UseState from './react/UseState.jsx'
import UseEffect from './react/UseEffect.jsx'
import EffectCleanup from './react/EffectCleanup.jsx'
import UseRef from './react/UseRef.jsx'
import UseMemo from './react/UseMemo.jsx'
import ForwardRef from './react/ForwardRef.jsx'
import Shadows from './lighting/Shadows.jsx'
import EnvironmentLighting from './lighting/EnvironmentLighting.jsx'
import LoadModel from './models/LoadModel.jsx'
import PostProcessing from './effects/PostProcessing.jsx'
import PhysicsBasics from './physics/PhysicsBasics.jsx'
import KinematicCollisions from './physics/KinematicCollisions.jsx'
import ModelPhysics from './physics/ModelPhysics.jsx'

export const GROUPS = [
  {
    title: 'React foundations',
    description: 'How interactive UI state works before adding 3D.',
    lessons: [
      { id: 'composition', title: 'Composition with children', file: 'react/Composition.jsx', kind: 'dom', Component: Composition,
        summary: 'Wrapper components receive whatever is nested inside them as props.children.' },
      { id: 'use-state', title: 'useState', file: 'react/UseState.jsx', kind: 'dom', Component: UseState,
        summary: 'State is a value React remembers between renders; setting it triggers a re-render.' },
      { id: 'use-effect', title: 'useEffect & dependencies', file: 'react/UseEffect.jsx', kind: 'dom', Component: UseEffect,
        summary: 'The dependency array controls when an effect runs. Watch the log as you click and type.' },
      { id: 'effect-cleanup', title: 'Effect cleanup', file: 'react/EffectCleanup.jsx', kind: 'dom', Component: EffectCleanup,
        summary: 'Returning a cleanup function stops the timer when the component unmounts.' },
      { id: 'use-ref', title: 'useRef for DOM access', file: 'react/UseRef.jsx', kind: 'dom', Component: UseRef,
        summary: 'A ref points at a real DOM node — used here to focus and read an input.' },
      { id: 'use-memo', title: 'useMemo', file: 'react/UseMemo.jsx', kind: 'dom', Component: UseMemo,
        summary: 'An expensive calculation is cached and only recomputed when its input changes.' },
      { id: 'forward-ref', title: 'forwardRef', file: 'react/ForwardRef.jsx', kind: 'dom', Component: ForwardRef,
        summary: 'forwardRef lets a parent reach the input inside a custom component.' },
    ],
  },
  {
    title: 'Light & materials',
    description: 'Making surfaces read as real objects.',
    lessons: [
      { id: 'shadows', title: 'Lights & shadows', file: 'lighting/Shadows.jsx', kind: '3d', camera: [4, 3, 6], Component: Shadows,
        summary: 'Compare real-time, contact and accumulative shadows. Turn on helpers to see the shadow camera.' },
      { id: 'environment', title: 'Environment lighting', file: 'lighting/EnvironmentLighting.jsx', kind: '3d', camera: [4, 2, 6], Component: EnvironmentLighting,
        summary: 'Light the whole scene from an environment map and see it in metallic reflections.' },
    ],
  },
  {
    title: '3D models',
    description: 'Bringing designed assets into the browser.',
    lessons: [
      { id: 'load-model', title: 'Loading a GLB model', file: 'models/LoadModel.jsx', kind: '3d', camera: [2.2, 1.7, 3.6], Component: LoadModel,
        summary: 'Load a 3D model with useGLTF and make every mesh cast shadows.' },
    ],
  },
  {
    title: 'Visual effects',
    description: 'Setting mood with post-processing.',
    lessons: [
      { id: 'post-processing', title: 'Post-processing', file: 'effects/PostProcessing.jsx', kind: '3d', camera: [4, 2, 6], Component: PostProcessing,
        summary: 'Bloom, glitch, noise, vignette and depth of field — filters applied to the rendered image.' },
    ],
  },
  {
    title: 'Physics & interaction',
    description: 'Objects that react to touch and to each other.',
    lessons: [
      { id: 'physics-basics', title: 'Physics basics', file: 'physics/PhysicsBasics.jsx', kind: '3d', camera: [5, 4, 8], Component: PhysicsBasics,
        summary: 'Rigid bodies, colliders and gravity. Click the cube to push it with an impulse.' },
      { id: 'kinematic', title: 'Kinematic bodies & collisions', file: 'physics/KinematicCollisions.jsx', kind: '3d', camera: [5, 5, 9], Component: KinematicCollisions,
        summary: 'A code-driven bar knocks objects around; collision events log hits and play a sound.' },
      { id: 'model-physics', title: 'A model with physics', file: 'physics/ModelPhysics.jsx', kind: '3d', camera: [4, 3, 6], Component: ModelPhysics,
        summary: 'Turn a loaded character into a rigid body with a hand-fitted box collider, then drop it.' },
    ],
  },
]

export const ALL_LESSONS = GROUPS.flatMap((g) => g.lessons)
