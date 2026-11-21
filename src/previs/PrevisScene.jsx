// Film previs — a virtual cinema camera that behaves like a real one.
// Choose a sensor and a focal length (mm) and the field of view is calculated
// the way it would be on set. Switch between the director's overview and
// the view through the lens.
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls, PerspectiveCamera, useAnimations, useGLTF, useHelper } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const MODEL = './models/robot.glb'

function Actor({ animation }) {
  const { scene, animations } = useGLTF(MODEL)
  const actor = useMemo(() => {
    const c = clone(scene)
    c.traverse((o) => { if (o.isMesh) o.castShadow = true })
    return c
  }, [scene])
  const { actions } = useAnimations(animations, actor)
  useEffect(() => {
    const a = actions[animation]
    a?.reset().fadeIn(0.3).play()
    return () => a?.fadeOut(0.3)
  }, [animation, actions])
  return <primitive object={actor} />
}

function SetPieces() {
  // Simple stand-ins for set dressing, so framing and depth are easy to read
  const pieces = [
    { p: [-2.5, 0.6, -2], s: [1, 1.2, 1], c: '#c9b79c' },
    { p: [2.2, 0.9, -3], s: [1.2, 1.8, 0.6], c: '#9fb3c8' },
    { p: [-1, 0.35, 2.5], s: [0.7, 0.7, 0.7], c: '#d8a48f' },
    { p: [3, 1.5, 1], s: [0.3, 3, 0.3], c: '#7d8691' },
    { p: [-3.5, 1.5, 1.5], s: [0.3, 3, 0.3], c: '#7d8691' },
  ]
  return pieces.map(({ p, s, c }, i) => (
    <mesh key={i} position={p} scale={s} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color={c} />
    </mesh>
  ))
}

function CameraRig({ camera }) {
  // Visible camera body + frustum, shown in the director's view
  useHelper(camera, THREE.CameraHelper)
  const body = useRef()
  useFrame(() => {
    if (!camera.current || !body.current) return
    body.current.position.copy(camera.current.position)
    body.current.quaternion.copy(camera.current.quaternion)
  })
  return (
    <group ref={body}>
      <mesh position={[0, 0, 0.18]}>
        <boxGeometry args={[0.22, 0.2, 0.36]} />
        <meshStandardMaterial color="#1f2328" />
      </mesh>
      <mesh position={[0, 0, -0.06]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.07, 0.08, 0.14, 24]} />
        <meshStandardMaterial color="#3a3f47" />
      </mesh>
    </group>
  )
}

export default function PrevisScene({ settings, frameRatio }) {
  const cinemaCam = useRef()
  const size = useThree((s) => s.size)
  const { lens, sensor, view, distance, height, aim, orbit, tilt, animation } = settings

  // Place the camera on a circle around the actor and aim it at a height on the actor
  useFrame(() => {
    const cam = cinemaCam.current
    if (!cam) return
    const angle = THREE.MathUtils.degToRad(orbit)
    cam.position.set(Math.sin(angle) * distance, height, Math.cos(angle) * distance)
    const target = new THREE.Vector3(0, aim, 0)
    cam.lookAt(target)
    cam.rotateX(THREE.MathUtils.degToRad(tilt))
  })

  // Real-lens field of view. The sensor width maps to the width of the framed
  // (letterboxed) area, so what's inside the frame matches the real lens exactly.
  useEffect(() => {
    const cam = cinemaCam.current
    if (!cam) return
    const frameWidthPx = Math.min(size.width, size.height * frameRatio)
    const halfTan = (sensor.width / 2 / lens) * (size.height / frameWidthPx)
    cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfTan))
    cam.aspect = size.width / size.height
    cam.updateProjectionMatrix()
  }, [lens, sensor, size, frameRatio, view])

  const throughLens = view === 'Through the lens'

  return (
    <>
      <color attach="background" args={['#d9dee4']} />
      <fog attach="fog" args={['#d9dee4', 18, 40]} />
      <PerspectiveCamera ref={cinemaCam} makeDefault={throughLens} near={0.05} far={100} />
      {!throughLens && (
        <>
          <PerspectiveCamera makeDefault position={[9, 8, 11]} fov={40} />
          <OrbitControls makeDefault target={[0, 1, 0]} />
          <CameraRig camera={cinemaCam} />
        </>
      )}

      <hemisphereLight intensity={0.5} groundColor="#8b949e" />
      <directionalLight position={[4, 8, 5]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />

      <Actor animation={animation} />
      <SetPieces />
      <mesh receiveShadow rotation-x={-Math.PI / 2}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#b9c0c8" />
      </mesh>
      <gridHelper args={[20, 20, '#8f98a3', '#a9b1ba']} position-y={0.002} />
      <ContactShadows scale={6} blur={2} opacity={0.4} far={3} />
    </>
  )
}

useGLTF.preload(MODEL)
