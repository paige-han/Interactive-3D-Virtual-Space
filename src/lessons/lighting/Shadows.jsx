// Light & materials — Lights and three kinds of shadows
//  • Real-time: a directional light renders a shadow map every frame.
//    Its shadow camera decides which area can receive shadows (toggle the helper to see it).
//  • Contact: a cheap, soft shadow baked from below — great for product shots.
//  • Accumulative: soft, realistic shadows built up over many frames from randomized lights.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { AccumulativeShadows, ContactShadows, OrbitControls, RandomizedLight, useHelper } from '@react-three/drei'
import { useControls } from 'leva'

function Helpers({ light }) {
  const scene = useThree((state) => state.scene)
  const cameraHelper = useRef()
  useHelper(light, THREE.DirectionalLightHelper, 0.5)

  // Show the shadow camera's box: only objects inside it can receive real-time shadows
  useEffect(() => {
    cameraHelper.current = new THREE.CameraHelper(light.current.shadow.camera)
    scene.add(cameraHelper.current)
    return () => {
      scene.remove(cameraHelper.current)
      cameraHelper.current.dispose()
    }
  }, [light, scene])
  useFrame(() => cameraHelper.current?.update())

  return null
}

export default function Shadows() {
  const cube = useRef()
  const light = useRef()

  const { mode, helpers, rotate } = useControls('Shadows', {
    mode: { options: ['Real-time', 'Contact', 'Accumulative'] },
    helpers: false,
    rotate: true,
  })
  const contact = useControls('Contact shadow', {
    color: '#1d8f75',
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  }, { render: (get) => get('Shadows.mode') === 'Contact' })

  useFrame((_, delta) => {
    if (rotate) cube.current.rotation.y += delta * 0.6
  })

  return (
    <>
      <color attach="background" args={['#f4f2ee']} />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={light}
        castShadow={mode === 'Real-time'}
        position={[1, 2, 3]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        shadow-camera-right={5}
      />
      {helpers && <Helpers light={light} />}

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="#82E0AA" />
      </mesh>
      <mesh ref={cube} castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="#F9E79F" />
      </mesh>

      {mode === 'Real-time' && (
        <mesh receiveShadow position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
          <circleGeometry />
          <meshStandardMaterial color="#d9dde3" />
        </mesh>
      )}
      {mode === 'Contact' && (
        <ContactShadows position={[0, -0.99, 0]} scale={10} resolution={512} far={5} frames={Infinity} {...contact} />
      )}
      {mode === 'Accumulative' && (
        <AccumulativeShadows position={[0, -0.99, 0]} scale={12} frames={100} temporal color="#316d39" opacity={0.6}>
          <RandomizedLight amount={8} radius={1} ambient={0.5} intensity={1} position={[1, 2, 3]} bias={0.001} />
        </AccumulativeShadows>
      )}
    </>
  )
}
