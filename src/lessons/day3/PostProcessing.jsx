// Day 3 · Lesson 1 — Post-processing effects
// Effects run on the finished image, like filters on a photo.
//  • Bloom makes very bright pixels glow. A material only glows if its color goes
//    beyond 1.0, so the cube uses emissive light with toneMapping turned off.
//  • Glitch, Noise and Vignette change the mood; Depth of Field blurs what's out of focus.
import { OrbitControls } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer, Glitch, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { useControls } from 'leva'

export default function PostProcessing() {
  const { effect } = useControls('Effect', {
    effect: { options: ['Bloom', 'Glitch', 'Noise', 'Vignette', 'Depth of field'] },
  })
  const bloom = useControls('Bloom', {
    intensity: { value: 1.5, min: 0, max: 4 },
    emissive: { value: 4, min: 0, max: 8 },
  }, { render: (get) => get('Effect.effect') === 'Bloom' })
  const glitch = useControls('Glitch', {
    mode: { options: Object.keys(GlitchMode), value: 'SPORADIC' },
    strength: { value: [0.2, 0.4], min: 0, max: 1 },
  }, { render: (get) => get('Effect.effect') === 'Glitch' })
  const noise = useControls('Noise', {
    blendFunction: { options: ['OVERLAY', 'SOFT_LIGHT', 'SCREEN', 'MULTIPLY'], value: 'OVERLAY' },
  }, { render: (get) => get('Effect.effect') === 'Noise' })
  const vignette = useControls('Vignette', {
    offset: { value: 0.3, min: 0, max: 1, step: 0.01 },
    darkness: { value: 0.9, min: 0, max: 1.5, step: 0.01 },
  }, { render: (get) => get('Effect.effect') === 'Vignette' })

  const dark = effect === 'Bloom'

  return (
    <>
      <color attach="background" args={[dark ? '#05060a' : '#f4f2ee']} />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={1.2} />

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="#82E0AA" />
      </mesh>
      <mesh rotation-y={Math.PI / 4} position-x={2} scale={1.5}>
        <boxGeometry />
        {effect === 'Bloom'
          ? <meshStandardMaterial color="#ff6a4d" emissive="#ff6a4d" emissiveIntensity={bloom.emissive} toneMapped={false} />
          : <meshStandardMaterial color="#F9E79F" />}
      </mesh>
      <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
        <circleGeometry />
        <meshStandardMaterial color={dark ? '#2b3340' : '#5D6D7E'} />
      </mesh>

      <EffectComposer multisampling={8}>
        {effect === 'Bloom' ? <Bloom mipmapBlur intensity={bloom.intensity} luminanceThreshold={0.9} /> : <></>}
        {effect === 'Glitch' ? <Glitch delay={[0.5, 1]} duration={[0.1, 0.3]} strength={glitch.strength} mode={GlitchMode[glitch.mode]} /> : <></>}
        {effect === 'Noise' ? <Noise premultiply blendFunction={BlendFunction[noise.blendFunction]} /> : <></>}
        {effect === 'Vignette' ? <Vignette offset={vignette.offset} darkness={vignette.darkness} /> : <></>}
        {effect === 'Depth of field' ? <DepthOfField focusDistance={0.003} focalLength={0.005} bokehScale={16} /> : <></>}
      </EffectComposer>
    </>
  )
}
