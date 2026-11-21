// 3D models — Loading a 3D model (GLB)
// useGLTF loads a .glb file and returns its scene graph, which we place with <primitive>.
// Every mesh inside has to opt in to casting shadows.
import { useEffect } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'

const MODEL = './models/robot.glb'

export default function LoadModel() {
  const { scene } = useGLTF(MODEL)
  const { scale } = useControls('Model', { scale: { value: 1, min: 0.3, max: 2, step: 0.05 } })

  useEffect(() => {
    scene.traverse((o) => { if (o.isMesh) o.castShadow = true })
  }, [scene])

  return (
    <>
      <color attach="background" args={['#eef1f4']} />
      <OrbitControls makeDefault target={[0, 0.9, 0]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[1, 3, 3]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} />
      <primitive object={scene} scale={scale} />
      <mesh receiveShadow rotation-x={-Math.PI / 2} scale={10}>
        <circleGeometry />
        <meshStandardMaterial color="#c9ced6" />
      </mesh>
    </>
  )
}

useGLTF.preload(MODEL)
