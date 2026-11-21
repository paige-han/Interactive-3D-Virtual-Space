// Day 3 · Lesson 3 — Kinematic bodies and collision events
// A kinematic body is moved by code, not by physics — but it still pushes things.
// The spinning bar below is animated every frame with useFrame.
// onCollisionEnter fires when two bodies touch; here it logs the hit and plays a sound.
// (The course used an MP3; this version synthesizes a short "tock" with the Web Audio API.)
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

let audioCtx
function playHit(volume) {
  if (audioCtx?.state !== 'running') return // browsers only allow sound after a click
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.frequency.value = 180 + Math.random() * 120
  gain.gain.setValueAtTime(volume, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15)
  osc.connect(gain).connect(audioCtx.destination)
  osc.start()
  osc.stop(audioCtx.currentTime + 0.15)
}

export default function KinematicCollisions() {
  const twister = useRef()
  const [log, setLog] = useState([])
  const { speed, sound } = useControls('Twister', {
    speed: { value: 1, min: 0, max: 3, step: 0.1 },
    sound: true,
  })

  // Browsers block audio until the user interacts, so unlock it on the first click
  useEffect(() => {
    const unlock = () => {
      audioCtx ??= new AudioContext()
      audioCtx.resume()
    }
    window.addEventListener('pointerdown', unlock)
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed
    twister.current.setNextKinematicRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, time, 0)))
    twister.current.setNextKinematicTranslation({ x: Math.cos(time) * 2, y: -0.8, z: 0 })
  })

  const onCollision = (event) => {
    const a = event.target.rigidBodyObject?.name
    const b = event.other.rigidBodyObject?.name
    if (!a || !b || b === 'floor') return
    setLog((l) => [`${a} hit ${b}`, ...l].slice(0, 5))
    if (sound) playHit(0.05 + Math.random() * 0.15)
  }

  return (
    <>
      <color attach="background" args={['#f4f2ee']} />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.6} />
      <directionalLight castShadow position={[2, 5, 3]} intensity={1.5} />

      <Html position={[-4.5, 3, 0]} className="collision-log">
        <strong>Collisions</strong>
        <em>click anywhere to turn on sound</em>
        {log.length ? log.map((line, i) => <div key={i}>{line}</div>) : <div>waiting…</div>}
      </Html>

      <Physics>
        <RigidBody name="ball" colliders="ball" position={[-1.5, 2, 0]} onCollisionEnter={onCollision} ccd>
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="#82E0AA" />
          </mesh>
        </RigidBody>
        <RigidBody name="box" position={[1.5, 2, 0]} onCollisionEnter={onCollision} ccd>
          <mesh castShadow>
            <boxGeometry />
            <meshStandardMaterial color="#F9E79F" />
          </mesh>
        </RigidBody>

        <RigidBody name="twister" ref={twister} type="kinematicPosition" position={[0, -0.8, 0]} friction={0}>
          <mesh castShadow scale={[0.4, 0.4, 4]}>
            <boxGeometry />
            <meshStandardMaterial color="#e8806f" />
          </mesh>
        </RigidBody>

        <RigidBody name="floor" type="fixed">
          <mesh receiveShadow position-y={-1.25} rotation-x={-Math.PI / 2} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="#c9ced6" />
          </mesh>
          <CuboidCollider args={[5, 3, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 3, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 3, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 3, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>
      </Physics>
    </>
  )
}
