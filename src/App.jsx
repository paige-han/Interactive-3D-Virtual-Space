import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import LightAndShadow from './scenes/LightAndShadow.jsx'
import Character from './scenes/Character.jsx'
import Glow from './scenes/Glow.jsx'
import PhysicsPlayground from './scenes/PhysicsPlayground.jsx'
import City from './scenes/City.jsx'

const SCENES = [
  {
    id: 'light',
    label: 'Light & Shadow',
    hint: 'Drag to orbit · Tune the contact shadow in the panel',
    camera: [4, 3, 6],
    Component: LightAndShadow,
  },
  {
    id: 'character',
    label: 'Character',
    hint: 'Switch between the robot’s animations in the panel',
    camera: [2.2, 1.7, 3.6],
    Component: Character,
  },
  {
    id: 'glow',
    label: 'Glow & Focus',
    hint: 'Bloom makes emissive materials glow · Toggle depth of field',
    camera: [4, 2, 6],
    dark: true,
    Component: Glow,
  },
  {
    id: 'physics',
    label: 'Physics',
    hint: 'Click the yellow cube to make it jump',
    camera: [6, 7, 11],
    Component: PhysicsPlayground,
  },
  {
    id: 'city',
    label: 'City',
    hint: 'Drag to orbit · Scroll to zoom into the city model',
    camera: [120, 90, 160],
    Component: City,
  },
]

function Scene({ scene }) {
  const { performance } = useControls('Display', { performance: false })
  const { Component } = scene
  return (
    <>
      {performance && <Perf position="bottom-left" />}
      <Component />
    </>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState(SCENES[0].id)
  const scene = SCENES.find((s) => s.id === activeId)

  return (
    <div className={scene.dark ? 'app dark' : 'app'}>
      <header className="topbar">
        <div className="title">
          <span className="eyebrow">React Three Fiber</span>
          <h1>Interactive 3D Virtual Space</h1>
          <a className="lessons-link" href="./lessons.html">Building blocks →</a>
        </div>
        <nav className="tabs" aria-label="Scenes">
          {SCENES.map((s) => (
            <button
              key={s.id}
              className={s.id === activeId ? 'tab active' : 'tab'}
              aria-pressed={s.id === activeId}
              onClick={() => setActiveId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <Leva collapsed={false} titleBar={{ title: 'Controls' }} />

      <Canvas
        key={scene.id}
        shadows
        dpr={[1, 2]}
        camera={{ position: scene.camera, fov: 45, near: 0.1, far: 2000 }}
      >
        <Suspense fallback={null}>
          <Scene scene={scene} />
        </Suspense>
      </Canvas>

      <p className="hint">{scene.hint}</p>
    </div>
  )
}
