// Physics & interaction — Physics basics with Rapier
// Wrapping meshes in <RigidBody> hands them to the physics engine:
//  • dynamic bodies (default) fall and collide, • fixed bodies never move.
// `colliders` picks the invisible shape used for collisions — turn on debug to see them.
// Clicking the cube applies an impulse (a push) and a torque impulse (a spin).
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

export default function PhysicsBasics() {
  const cube = useRef()
  const { gravity, debug } = useControls('Physics', {
    gravity: { value: -9.81, min: -20, max: 0, step: 0.1 },
    debug: true,
  })

  const cubeJump = (event) => {
    event.stopPropagation()
    const mass = cube.current.mass()
    cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 }, true)
    cube.current.applyTorqueImpulse({ x: 0, y: mass, z: 0 }, true)
  }

  return (
    <>
      <color attach="background" args={['#f4f2ee']} />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />

      <Physics gravity={[0, gravity, 0]} debug={debug}>
        <RigidBody name="ball" colliders="ball" position={[-1.5, 2, 0]}>
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="#82E0AA" />
          </mesh>
        </RigidBody>

        <RigidBody name="box" ref={cube} position={[1.5, 2, 0]} friction={0}>
          <mesh castShadow onClick={cubeJump}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}>
            <boxGeometry />
            <meshStandardMaterial color="#F9E79F" />
          </mesh>
        </RigidBody>

        <RigidBody name="floor" type="fixed" friction={0.3}>
          <mesh receiveShadow position-y={-1.25} rotation-x={-Math.PI / 2} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="#5D6D7E" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}
