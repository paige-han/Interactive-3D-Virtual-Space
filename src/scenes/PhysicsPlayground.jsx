// Day 3 — Rapier physics: gravity, rigid bodies, impulses and a kinematic obstacle
import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

function Twister({ enabled }) {
  const twister = useRef()
  useFrame((state) => {
    if (!enabled) return
    if (!twister.current) return
    const time = state.clock.getElapsedTime() * 0.7
    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, time, 0))
    twister.current.setNextKinematicRotation(rotation)
    twister.current.setNextKinematicTranslation({ x: Math.cos(time) * 2, y: -0.8, z: 0 })
  })
  return (
    <RigidBody ref={twister} type="kinematicPosition" position={[0, -0.8, 0]} friction={0}>
      <mesh castShadow scale={[0.4, 0.4, 4]}>
        <boxGeometry />
        <meshStandardMaterial color="#e8806f" />
      </mesh>
    </RigidBody>
  )
}

export default function PhysicsPlayground() {
  const cube = useRef()
  const { gravity, twister, debug } = useControls('Physics', {
    gravity: { value: -9.81, min: -20, max: 0, step: 0.1 },
    twister: true,
    debug: false,
  })

  const cubeJump = (event) => {
    event.stopPropagation()
    const mass = cube.current.mass()
    cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 }, true)
    cube.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 }, true)
  }

  return (
    <>
      <color attach="background" args={['#f4f2ee']} />
      <OrbitControls makeDefault enableDamping />
      <ambientLight intensity={0.6} />
      <directionalLight castShadow position={[2, 6, 3]} intensity={1.6} shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />

      <Physics gravity={[0, gravity, 0]} debug={debug}>
        <RigidBody colliders="ball" position={[-1.5, 3, 0]} restitution={0.4} ccd>
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="#82E0AA" />
          </mesh>
        </RigidBody>

        <RigidBody ref={cube} position={[1.5, 3, 0]} friction={0.2} ccd>
          <mesh castShadow onClick={cubeJump}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}>
            <boxGeometry />
            <meshStandardMaterial color="#F9E79F" />
          </mesh>
        </RigidBody>

        {twister && <Twister enabled={twister} />}

        <RigidBody type="fixed" friction={0.7}>
          <mesh receiveShadow position-y={-1.25} rotation-x={THREE.MathUtils.degToRad(-90)} scale={12}>
            <planeGeometry />
            <meshStandardMaterial color="#c9ced6" />
          </mesh>
        </RigidBody>
        {/* invisible walls keep objects on the floor */}
        <RigidBody type="fixed">
          <CuboidCollider args={[6, 5, 0.5]} position={[0, 3, 6.5]} />
          <CuboidCollider args={[6, 5, 0.5]} position={[0, 3, -6.5]} />
          <CuboidCollider args={[0.5, 5, 6]} position={[6.5, 3, 0]} />
          <CuboidCollider args={[0.5, 5, 6]} position={[-6.5, 3, 0]} />
        </RigidBody>
      </Physics>
    </>
  )
}
