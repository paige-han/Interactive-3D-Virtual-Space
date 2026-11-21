// Day 3 — post-processing: bloom on emissive materials + depth of field
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { useControls } from 'leva'

export default function Glow() {
  const { bloomIntensity, glow, depthOfField } = useControls('Effects', {
    bloomIntensity: { value: 1.5, min: 0, max: 4, step: 0.1 },
    glow: { value: 4, min: 0, max: 6, step: 0.1 },
    depthOfField: false,
  })

  return (
    <>
      <color attach="background" args={['#05060a']} />
      <OrbitControls makeDefault enableDamping />
      <ambientLight intensity={0.4} />
      <directionalLight position={[1, 2, 3]} intensity={1} />

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="#82E0AA" />
      </mesh>
      <mesh rotation-y={THREE.MathUtils.degToRad(45)} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="#ff6a4d" emissive="#ff6a4d" emissiveIntensity={glow} toneMapped={false} />
      </mesh>
      <mesh position-y={-1} rotation-x={THREE.MathUtils.degToRad(-90)} scale={10}>
        <circleGeometry />
        <meshStandardMaterial color="#2b3340" />
      </mesh>

      <EffectComposer multisampling={8}>
        <Bloom mipmapBlur intensity={bloomIntensity} luminanceThreshold={0.9} />
        {depthOfField ? <DepthOfField focusDistance={0.003} focalLength={0.005} bokehScale={16} /> : <></>}
      </EffectComposer>
    </>
  )
}
