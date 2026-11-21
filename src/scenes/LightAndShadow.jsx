// Day 2 — lights, materials and soft contact shadows
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'

export default function LightAndShadow() {
  const cube = useRef()

  const { rotate, lightIntensity } = useControls('Scene', {
    rotate: true,
    lightIntensity: { value: 1.5, min: 0, max: 4, step: 0.1 },
  })
  const shadow = useControls('Contact shadow', {
    color: '#1d8f75',
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  })

  useFrame((_, delta) => {
    if (rotate) cube.current.rotation.y += delta * 0.6
  })

  return (
    <>
      <color attach="background" args={['#f4f2ee']} />
      <OrbitControls makeDefault enableDamping />
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={lightIntensity} />

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="#82E0AA" roughness={0.4} />
      </mesh>
      <mesh ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="#F9E79F" roughness={0.5} />
      </mesh>

      <ContactShadows position={[0, -0.99, 0]} scale={10} resolution={512} far={5} frames={Infinity} {...shadow} />
    </>
  )
}
