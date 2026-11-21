// Day 3 · Lesson 4 — Dropping a 3D model into the physics world
// A loaded model can be a rigid body too. Auto-generated colliders ("hull", "trimesh")
// follow the mesh, but a rigged character's geometry is deformed by its skeleton,
// so here we turn auto colliders off and fit a simple box collider by hand —
// a common, fast approach for characters. Turn on debug to see it.
// Press "drop again" to reset the fall.
import { useMemo, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { button, useControls } from 'leva'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const MODEL = './models/robot.glb'

function Robot() {
  const { scene } = useGLTF(MODEL)
  const model = useMemo(() => {
    const copy = clone(scene) // SkeletonUtils.clone keeps the rigged character intact
    copy.traverse((o) => { if (o.isMesh) o.castShadow = true })
    return copy
  }, [scene])
  return <primitive object={model} />
}

export default function ModelPhysics() {
  const [drop, setDrop] = useState(0)
  const { debug } = useControls('Physics', {
    debug: false,
    'drop again': button(() => setDrop((d) => d + 1)),
  })

  return (
    <>
      <color attach="background" args={['#eef1f4']} />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[2, 6, 3]} intensity={1.8} shadow-mapSize={[1024, 1024]} />

      <Physics debug={debug} key={drop}>
        <RigidBody colliders={false} position={[0, 4, 0]} rotation={[0.4, 0.3, 0.6]}>
          <CuboidCollider args={[0.45, 0.9, 0.2]} position={[0, 0.9, 0]} />
          <Robot />
        </RigidBody>
        <RigidBody colliders="ball" position={[-1.5, 2, 0.5]}>
          <mesh castShadow>
            <sphereGeometry args={[0.5]} />
            <meshStandardMaterial color="#82E0AA" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed">
          <mesh receiveShadow rotation-x={-Math.PI / 2} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="#c9ced6" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}

useGLTF.preload(MODEL)
