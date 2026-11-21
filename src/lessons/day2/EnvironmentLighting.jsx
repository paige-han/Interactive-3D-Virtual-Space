// Day 2 · Lesson 2 — Image-based lighting with an environment map
// Instead of placing individual lights, an environment map lights the scene
// from every direction and shows up in reflections. Here the environment is built
// from glowing panels (Lightformers) so it works without downloading an HDRI file.
import { Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'

export default function EnvironmentLighting() {
  const { intensity, roughness, metalness, showBackground } = useControls('Environment', {
    intensity: { value: 1, min: 0, max: 4, step: 0.1 },
    roughness: { value: 0.2, min: 0, max: 1 },
    metalness: { value: 0.6, min: 0, max: 1 },
    showBackground: false,
  })
  const material = { envMapIntensity: intensity, roughness, metalness }

  return (
    <>
      <color attach="background" args={['#1b1f27']} />
      <OrbitControls makeDefault />
      <Environment resolution={256} background={showBackground} blur={0.4}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffd6a5" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#a5d8ff" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="ring" intensity={4} color="#ffffff" position={[0, 1, -6]} scale={3} />
      </Environment>

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="#82E0AA" {...material} />
      </mesh>
      <mesh position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="#F9E79F" {...material} />
      </mesh>
      <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
        <circleGeometry />
        <meshStandardMaterial color="#5D6D7E" {...material} metalness={0} roughness={0.8} />
      </mesh>
    </>
  )
}
